import * as vscode from 'vscode';
import { BeamApiClient } from './beamApiClient';
import { BeamMessage, ContextInfo } from '../types/beam';

export class MessageHandler {
    private apiClient: BeamApiClient;

    constructor() {
        this.apiClient = new BeamApiClient();
    }

    async handleUserMessage(
        message: string,
        webview: vscode.Webview
    ): Promise<void> {
        try {
            // Get current context
            const context = this.getCurrentContext();

            // Show thinking state
            webview.postMessage({
                type: 'agentThinking',
                data: {
                    status: 'Analyzing your request...',
                    progress: 0
                }
            });

            // Execute task
            const response = await this.apiClient.executeTask(
                message,
                context,
                (progressData) => {
                    // Send progress updates
                    webview.postMessage({
                        type: 'agentProgress',
                        data: progressData
                    });
                }
            );

            // Send final response
            const agentMessage: BeamMessage = {
                id: Date.now().toString(),
                role: 'agent',
                content: response.narrative || 'Task completed',
                timestamp: new Date().toISOString(),
                plan: response.plan,
                changes: response.changes,
                recommendations: response.recommendations,
                confidence: response.confidence,
                changeId: response.changeId,
                status: response.status
            };

            webview.postMessage({
                type: 'agentResponse',
                data: agentMessage
            });

        } catch (error) {
            webview.postMessage({
                type: 'error',
                data: {
                    message: error instanceof Error ? error.message : 'Unknown error'
                }
            });
        }
    }

    async handleApplyChanges(
        changeId: string,
        webview: vscode.Webview
    ): Promise<void> {
        try {
            const result = await this.apiClient.applyChanges(changeId);
            
            webview.postMessage({
                type: 'changesApplied',
                data: result
            });

            if (result.success) {
                vscode.window.showInformationMessage('Changes applied successfully!');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to apply changes';
            vscode.window.showErrorMessage(message);
            webview.postMessage({
                type: 'error',
                data: { message }
            });
        }
    }

    async handleViewDiff(
        changeId: string,
        file: string
    ): Promise<void> {
        try {
            const diffData = await this.apiClient.getDiff(changeId, file);
            
            // Create temp file with diff content
            const uri = vscode.Uri.parse(`beam-diff:${file}`);
            const document = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(document);

        } catch (error) {
            vscode.window.showErrorMessage(
                `Failed to load diff: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    async handleOpenFile(file: string, line?: number): Promise<void> {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                return;
            }

            const filePath = vscode.Uri.joinPath(workspaceFolders[0].uri, file);
            const document = await vscode.workspace.openTextDocument(filePath);
            const editor = await vscode.window.showTextDocument(document);

            if (line !== undefined && line > 0) {
                const position = new vscode.Position(line - 1, 0);
                editor.selection = new vscode.Selection(position, position);
                editor.revealRange(
                    new vscode.Range(position, position),
                    vscode.TextEditorRevealType.InCenter
                );
            }
        } catch (error) {
            vscode.window.showErrorMessage(
                `Failed to open file: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    private getCurrentContext(): ContextInfo {
        const editor = vscode.window.activeTextEditor;
        const workspaceFolders = vscode.workspace.workspaceFolders;

        const context: ContextInfo = {
            workspacePath: workspaceFolders?.[0]?.uri.fsPath
        };

        if (editor) {
            context.currentFile = vscode.workspace.asRelativePath(editor.document.uri);
            
            const selection = editor.selection;
            if (!selection.isEmpty) {
                context.selectedCode = editor.document.getText(selection);
            }

            context.cursorPosition = {
                line: editor.selection.active.line + 1,
                column: editor.selection.active.character + 1
            };
        }

        return context;
    }

    async checkConnection(): Promise<boolean> {
        return await this.apiClient.checkHealth();
    }
}
