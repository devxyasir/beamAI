import * as vscode from 'vscode';
import { MessageHandler } from '../services/messageHandler';
import { BeamMessage } from '../types/beam';

export class BeamChatPanel implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private messageHandler: MessageHandler;
    private messageHistory: BeamMessage[] = [];

    constructor(private readonly _extensionUri: vscode.Uri) {
        this.messageHandler = new MessageHandler();
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ): void | Thenable<void> {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'sendMessage':
                    await this.handleUserMessage(data.text);
                    break;
                case 'applyChanges':
                    await this.messageHandler.handleApplyChanges(
                        data.changeId,
                        webviewView.webview
                    );
                    break;
                case 'viewDiff':
                    await this.messageHandler.handleViewDiff(data.changeId, data.file);
                    break;
                case 'openFile':
                    await this.messageHandler.handleOpenFile(data.file, data.line);
                    break;
                case 'clearHistory':
                    this.clearChat();
                    break;
            }
        });

        // Restore message history
        if (this.messageHistory.length > 0) {
            webviewView.webview.postMessage({
                type: 'restoreHistory',
                data: this.messageHistory
            });
        }
    }

    private async handleUserMessage(text: string): Promise<void> {
        if (!this._view) {
            return;
        }

        // Add user message to history
        const userMessage: BeamMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date().toISOString()
        };

        this.messageHistory.push(userMessage);
        this._view.webview.postMessage({
            type: 'userMessage',
            data: userMessage
        });

        // Handle with message handler
        await this.messageHandler.handleUserMessage(text, this._view.webview);
    }

    public sendMessage(message: string): void {
        if (!this._view) {
            return;
        }

        this.handleUserMessage(message);
    }

    public clearChat(): void {
        this.messageHistory = [];
        if (this._view) {
            this._view.webview.postMessage({ type: 'clearChat' });
        }
    }

    private _getHtmlForWebview(webview: vscode.Webview): string {
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'webview', 'dist', 'assets', 'index.js')
        );
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, 'webview', 'dist', 'assets', 'index.css')
        );

        const codiconsUri = webview.asWebviewUri(
            vscode.Uri.joinPath(
                this._extensionUri,
                'node_modules',
                '@vscode/codicons',
                'dist',
                'codicon.css'
            )
        );

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; font-src ${webview.cspSource}; script-src ${webview.cspSource};">
    <link href="${codiconsUri}" rel="stylesheet" />
    <link href="${styleUri}" rel="stylesheet">
    <title>Beam Chat</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="${scriptUri}"></script>
</body>
</html>`;
    }
}
