import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { ProjectManager } from './projectManager';

const VIEW_TYPE = 'fogioJetBrainsDashboard';
const THEME_PACK = [
  'fogio.jetbrains-color-theme',
  'fogio.jetbrains-file-icon-theme',
  'fogio.jetbrains-product-icon-theme',
];

interface InMessage {
  type: string;
  payload?: any;
}

export class DashboardPanel {
  private static current: DashboardPanel | undefined;

  private readonly panel: vscode.WebviewPanel;
  private readonly disposables: vscode.Disposable[] = [];

  static createOrShow(context: vscode.ExtensionContext, projectManager: ProjectManager): void {
    if (DashboardPanel.current) {
      DashboardPanel.current.panel.reveal(vscode.ViewColumn.One);
      DashboardPanel.current.sendProjects();
      return;
    }
    const panel = vscode.window.createWebviewPanel(
      VIEW_TYPE,
      'JetBrains Dashboard',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, 'dist'),
        ],
      }
    );
    DashboardPanel.current = new DashboardPanel(panel, context, projectManager);
  }

  static refreshIfOpen(): void {
    DashboardPanel.current?.sendProjects();
  }

  static disposeCurrent(): void {
    DashboardPanel.current?.dispose();
  }

  private constructor(
    panel: vscode.WebviewPanel,
    private readonly context: vscode.ExtensionContext,
    private readonly projectManager: ProjectManager
  ) {
    this.panel = panel;
    this.panel.webview.html = this.renderHtml();

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this.panel.webview.onDidReceiveMessage(
      (msg: InMessage) => this.handleMessage(msg),
      null,
      this.disposables
    );

    this.sendProjects();
  }

  private async handleMessage(msg: InMessage): Promise<void> {
    switch (msg.type) {
      case 'ready':
        this.sendProjects();
        return;
      case 'openProject': {
        const { path: p, newWindow } = msg.payload || {};
        if (typeof p !== 'string') return;
        if (!fs.existsSync(p)) {
          await this.handleMessage({ type: 'missingProject', payload: { path: p } });
          return;
        }
        await this.projectManager.touch(p);
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(p), {
          forceNewWindow: !!newWindow,
        });
        return;
      }
      case 'removeProject': {
        const { path: p } = msg.payload || {};
        if (typeof p !== 'string') return;
        await this.projectManager.remove(p);
        this.sendProjects();
        return;
      }
      case 'missingProject': {
        const { path: p } = msg.payload || {};
        if (typeof p !== 'string') return;
        const pick = await vscode.window.showWarningMessage(
          `Project path no longer exists:\n${p}`,
          'Remove from list',
          'Cancel'
        );
        if (pick === 'Remove from list') {
          await this.projectManager.remove(p);
          this.sendProjects();
        }
        return;
      }
      case 'togglePin': {
        const { path: p } = msg.payload || {};
        if (typeof p !== 'string') return;
        await this.projectManager.togglePin(p);
        this.sendProjects();
        return;
      }
      case 'newProject': {
        const folderUri = await vscode.window.showOpenDialog({
          canSelectFolders: true,
          canSelectFiles: false,
          canSelectMany: false,
          openLabel: 'Create / Select Folder for New Project',
        });
        if (folderUri && folderUri[0]) {
          await this.projectManager.addManual(folderUri[0].fsPath);
          await this.projectManager.touch(folderUri[0].fsPath);
          await vscode.commands.executeCommand('vscode.openFolder', folderUri[0], { forceNewWindow: false });
        }
        return;
      }
      case 'openFolder':
        await vscode.commands.executeCommand('workbench.action.files.openFolder');
        return;
      case 'cloneRepo':
        await vscode.commands.executeCommand('git.clone');
        return;
      case 'selectTheme':
        await vscode.commands.executeCommand('workbench.action.selectTheme');
        return;
      case 'openKeymap':
        await vscode.commands.executeCommand('workbench.action.openGlobalKeybindings');
        return;
      case 'openExtensions':
        await vscode.commands.executeCommand('workbench.view.extensions');
        return;
      case 'applyThemePack':
        await this.applyThemePack();
        return;
    }
  }

  private async applyThemePack(): Promise<void> {
    const missing: string[] = [];
    for (const id of THEME_PACK) {
      if (!vscode.extensions.getExtension(id)) missing.push(id);
    }
    if (missing.length > 0) {
      const pick = await vscode.window.showInformationMessage(
        `Install missing JetBrains theme pack extensions?\n${missing.join('\n')}`,
        { modal: true },
        'Install'
      );
      if (pick !== 'Install') return;
      for (const id of missing) {
        try {
          await vscode.commands.executeCommand('workbench.extensions.installExtension', id);
        } catch (err) {
          vscode.window.showErrorMessage(`Failed to install ${id}: ${String(err)}`);
        }
      }
    }

    const isDark = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark
      || vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.HighContrast;
    const colorThemeId = isDark ? 'dark-jetbrains-color-theme' : 'light-jetbrains-color-theme';

    const config = vscode.workspace.getConfiguration();
    const updates: Array<[string, string]> = [
      ['workbench.colorTheme', colorThemeId],
      ['workbench.iconTheme', 'jetbrains-file-icon-theme-auto'],
      ['workbench.productIconTheme', 'jetbrains-product-icon-theme'],
    ];
    for (const [key, value] of updates) {
      try {
        await config.update(key, value, vscode.ConfigurationTarget.Global);
      } catch (err) {
        vscode.window.showWarningMessage(`Failed to set ${key}: ${String(err)}`);
      }
    }
    vscode.window.showInformationMessage('JetBrains theme pack applied.');
  }

  private async sendProjects(): Promise<void> {
    const projects = await this.projectManager.list();
    this.panel.webview.postMessage({ type: 'projects', payload: projects });
  }

  private renderHtml(): string {
    const webview = this.panel.webview;
    const distUri = vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview');
    const htmlPath = path.join(distUri.fsPath, 'index.html');
    const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(distUri, 'styles.css'));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(distUri, 'main.js'));
    const nonce = getNonce();

    let html: string;
    try {
      html = fs.readFileSync(htmlPath, 'utf8');
    } catch {
      html = '<!doctype html><html><body>Dashboard webview missing. Run build.</body></html>';
    }

    const csp = [
      `default-src 'none'`,
      `style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com`,
      `font-src ${webview.cspSource} https://fonts.gstatic.com data:`,
      `script-src 'nonce-${nonce}'`,
    ].join('; ');

    return html
      .replace(/%CSP%/g, csp)
      .replace(/%STYLES_URI%/g, stylesUri.toString())
      .replace(/%SCRIPT_URI%/g, scriptUri.toString())
      .replace(/%NONCE%/g, nonce);
  }

  dispose(): void {
    DashboardPanel.current = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      const d = this.disposables.pop();
      try {
        d?.dispose();
      } catch {
        // ignore
      }
    }
  }
}

function getNonce(): string {
  return crypto.randomBytes(16).toString('hex');
}
