import * as vscode from 'vscode';
import { BeamChatPanel } from '../panels/BeamChatPanel';

export function explainCode(chatPanel: BeamChatPanel): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active editor');
        return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
        vscode.window.showWarningMessage('No code selected');
        return;
    }

    const selectedText = editor.document.getText(selection);
    const message = `Explain this code:\n\`\`\`\n${selectedText}\n\`\`\``;
    
    chatPanel.sendMessage(message);
    vscode.commands.executeCommand('workbench.view.extension.beam-sidebar');
}

export function refactorCode(chatPanel: BeamChatPanel): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active editor');
        return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
        vscode.window.showWarningMessage('No code selected');
        return;
    }

    const selectedText = editor.document.getText(selection);
    const message = `Refactor this code to improve readability and performance:\n\`\`\`\n${selectedText}\n\`\`\``;
    
    chatPanel.sendMessage(message);
    vscode.commands.executeCommand('workbench.view.extension.beam-sidebar');
}

export function fixError(chatPanel: BeamChatPanel): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active editor');
        return;
    }

    // Get diagnostics at cursor position
    const position = editor.selection.active;
    const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
    
    const errorAtCursor = diagnostics.find(d => 
        d.range.contains(position) && d.severity === vscode.DiagnosticSeverity.Error
    );

    if (!errorAtCursor) {
        vscode.window.showInformationMessage('No error found at cursor position');
        return;
    }

    const line = editor.document.lineAt(position.line);
    const message = `Fix this error:\nError: ${errorAtCursor.message}\nLine ${position.line + 1}: ${line.text}`;
    
    chatPanel.sendMessage(message);
    vscode.commands.executeCommand('workbench.view.extension.beam-sidebar');
}
