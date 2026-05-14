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
      const pick = await vscode.window.showQuickPick(
        projects.map((p) => ({ label: p.name, description: p.path, project: p })),
        { placeHolder: 'Select project to pin/unpin' }
      );
      if (pick) {
        await projectManager.togglePin(pick.project.path);
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
