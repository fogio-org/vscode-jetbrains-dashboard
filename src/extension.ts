import * as vscode from 'vscode';
import { DashboardPanel } from './DashboardPanel';
import { ProjectManager } from './projectManager';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const projectManager = new ProjectManager(context);

  context.subscriptions.push(
    vscode.commands.registerCommand('fogioDashboard.open', () => {
      DashboardPanel.createOrShow(context, projectManager);
    }),
    vscode.commands.registerCommand('fogioDashboard.pinProject', async () => {
      const projects = await projectManager.list();
      if (projects.length === 0) {
        vscode.window.showInformationMessage('No projects to pin.');
        return;
      }
      const pick = await vscode.window.showQuickPick(
        projects.map((p) => ({
          label: `${p.pinned ? '$(pinned) ' : ''}${p.name}`,
          description: p.path,
          detail: p.pinned ? 'Pinned' : undefined,
          project: p,
        })),
        { placeHolder: 'Select project to pin/unpin', matchOnDescription: true }
      );
      if (pick) {
        await projectManager.togglePin(pick.project.path);
        DashboardPanel.refreshIfOpen();
      }
    }),
    vscode.commands.registerCommand('fogioDashboard.addProject', async () => {
      const folderUri = await vscode.window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: 'Add to Dashboard',
      });
      if (folderUri && folderUri[0]) {
        await projectManager.addManual(folderUri[0].fsPath);
        await projectManager.touch(folderUri[0].fsPath);
        DashboardPanel.refreshIfOpen();
      }
    }),
    vscode.commands.registerCommand('fogioDashboard.clearHistory', async () => {
      const confirm = await vscode.window.showWarningMessage(
        'Clear all project history?',
        { modal: true },
        'Clear'
      );
      if (confirm === 'Clear') {
        await projectManager.clear();
        DashboardPanel.refreshIfOpen();
      }
    })
  );

  const config = vscode.workspace.getConfiguration('fogioDashboard');
  const showOnStartup = config.get<boolean>('showOnStartup', true);
  const noWorkspaceOpen = !vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0;

  if (showOnStartup && noWorkspaceOpen) {
    DashboardPanel.createOrShow(context, projectManager);
  }
}

export function deactivate(): void {
  DashboardPanel.disposeCurrent();
}
