import * as vscode from 'vscode';
import { MarkdownEditorProvider } from './markdownEditorProvider';
import { ExportService } from './exportService';

export function activate(context: vscode.ExtensionContext) {
    console.log('MDOffice - Markdown Office Editor is now active');

    // Register the custom editor provider
    const provider = new MarkdownEditorProvider(context);
    context.subscriptions.push(
        vscode.window.registerCustomEditorProvider(
            'mdOfficeEditor.markdownEditor',
            provider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true,
                },
                supportsMultipleEditorsPerDocument: false,
            }
        )
    );

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('mdOfficeEditor.openEditor', async (uri?: vscode.Uri) => {
            if (!uri) {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    uri = editor.document.uri;
                }
            }
            if (uri) {
                await vscode.commands.executeCommand('vscode.openWith', uri, 'mdOfficeEditor.markdownEditor');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('mdOfficeEditor.exportToPDF', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'markdown') {
                await ExportService.exportToPDF(editor.document);
            } else {
                vscode.window.showWarningMessage('Please open a markdown file to export.');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('mdOfficeEditor.exportToHTML', async () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'markdown') {
                await ExportService.exportToHTML(editor.document);
            } else {
                vscode.window.showWarningMessage('Please open a markdown file to export.');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('mdOfficeEditor.toggleView', async () => {
            // Send message to active webview to toggle view mode
            const panel = (provider as any).constructor.getCurrentPanel();
            if (panel) {
                panel.webview.postMessage({
                    type: 'toggleView'
                });
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('mdOfficeEditor.toggleFocusMode', async () => {
            // Send message to active webview to toggle focus mode
            const panel = (provider as any).constructor.getCurrentPanel();
            if (panel) {
                panel.webview.postMessage({
                    type: 'toggleFocusMode'
                });
            }
        })
    );
}

export function deactivate() {
    console.log('MDOffice - Markdown Office Editor is now deactivated');
}

