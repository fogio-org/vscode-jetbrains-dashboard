import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

export interface ProjectMeta {
  pinned?: boolean;
  customName?: string;
  lastOpened?: number;
}

export interface Project {
  path: string;
  name: string;
  pinned: boolean;
  lastOpened: number;
  exists: boolean;
}

const META_KEY = 'fogioDashboard.projectMeta';
const MANUAL_KEY = 'fogioDashboard.manualProjects';

export class ProjectManager {
  constructor(private context: vscode.ExtensionContext) {}

  private getMeta(): Record<string, ProjectMeta> {
    return this.context.globalState.get<Record<string, ProjectMeta>>(META_KEY, {});
  }

  private async setMeta(meta: Record<string, ProjectMeta>): Promise<void> {
    await this.context.globalState.update(META_KEY, meta);
  }

  private getManual(): string[] {
    return this.context.globalState.get<string[]>(MANUAL_KEY, []);
  }

  private async setManual(paths: string[]): Promise<void> {
    await this.context.globalState.update(MANUAL_KEY, paths);
  }

  async list(): Promise<Project[]> {
    const config = vscode.workspace.getConfiguration('fogioDashboard');
    const source = config.get<string>('projectsSource', 'recentlyOpened');
    const max = config.get<number>('maxProjects', 25);

    const paths = new Set<string>();

    if (source === 'recentlyOpened' || source === 'both') {
      const recent = await this.fetchRecentlyOpened();
      for (const p of recent) paths.add(p);
    }
    if (source === 'manual' || source === 'both') {
      for (const p of this.getManual()) paths.add(p);
    }

    const meta = this.getMeta();
    const projects: Project[] = [];
    for (const p of paths) {
      const m = meta[p] || {};
      projects.push({
        path: p,
        name: m.customName || path.basename(p) || 'Project',
        pinned: !!m.pinned,
        lastOpened: m.lastOpened || 0,
        exists: this.safeExists(p),
      });
    }

    projects.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.lastOpened - a.lastOpened;
    });

    return projects.slice(0, max);
  }

  private safeExists(p: string): boolean {
    try {
      return fs.existsSync(p);
    } catch {
      return false;
    }
  }

  private async fetchRecentlyOpened(): Promise<string[]> {
    try {
      const result: any = await vscode.commands.executeCommand('_workbench.getRecentlyOpened');
      const out: string[] = [];
      if (result && Array.isArray(result.workspaces)) {
        for (const item of result.workspaces) {
          if (item.folderUri) {
            const uri = vscode.Uri.parse(String(item.folderUri));
            if (uri.scheme === 'file') out.push(uri.fsPath);
          } else if (item.workspace?.configPath) {
            const uri = vscode.Uri.parse(String(item.workspace.configPath));
            if (uri.scheme === 'file') out.push(uri.fsPath);
          } else if (typeof item.path === 'string') {
            out.push(item.path);
          }
        }
      }
      return out;
    } catch {
      return [];
    }
  }

  async togglePin(projectPath: string): Promise<void> {
    const meta = this.getMeta();
    const m = meta[projectPath] || {};
    m.pinned = !m.pinned;
    meta[projectPath] = m;
    await this.setMeta(meta);
  }

  async remove(projectPath: string): Promise<void> {
    const meta = this.getMeta();
    delete meta[projectPath];
    await this.setMeta(meta);

    const manual = this.getManual().filter((p) => p !== projectPath);
    await this.setManual(manual);

    try {
      await vscode.commands.executeCommand('vscode.removeFromRecentlyOpened', vscode.Uri.file(projectPath));
    } catch {
      // ignore
    }
  }

  async addManual(projectPath: string): Promise<void> {
    const manual = this.getManual();
    if (!manual.includes(projectPath)) {
      manual.push(projectPath);
      await this.setManual(manual);
    }
  }

  async touch(projectPath: string): Promise<void> {
    const meta = this.getMeta();
    const m = meta[projectPath] || {};
    m.lastOpened = Date.now();
    meta[projectPath] = m;
    await this.setMeta(meta);
  }

  async clear(): Promise<void> {
    await this.setMeta({});
    await this.setManual([]);
    try {
      await vscode.commands.executeCommand('workbench.action.clearRecentFiles');
    } catch {
      // ignore
    }
  }
}
