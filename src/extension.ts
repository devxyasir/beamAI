import * as vscode from 'vscode';
import { BeamChatPanel } from './panels/BeamChatPanel';
import { explainCode, refactorCode, fixError } from './commands/contextMenuCommands';

export function activate(context: vscode.ExtensionContext) {
    console.log('Beam AI extension activated');

    // Register sidebar webview provider
    const provider = new BeamChatPanel(context.extensionUri);
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'beamChatView',
            provider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true
                }
            }
        )
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('beam.openChat', () => {
            vscode.commands.executeCommand('workbench.view.extension.beam-sidebar');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('beam.explainCode', () => {
            explainCode(provider);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('beam.refactorCode', () => {
            refactorCode(provider);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('beam.fixError', () => {
            fixError(provider);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('beam.clearChat', () => {
            provider.clearChat();
        })
    );
}

export function deactivate() {
    console.log('Beam AI extension deactivated');
}
