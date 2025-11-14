import * as vscode from 'vscode';
import { MarkdownEditorProvider } from './markdownEditorProvider';
import { ExportService } from './exportService';

// Track recently auto-opened files to prevent infinite loops
const recentlyAutoOpened = new Set<string>();

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

    // Auto-open markdown files with MDOffice if setting is enabled
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(async (editor) => {
            if (!editor) {
                return;
            }

            const config = vscode.workspace.getConfiguration('mdOfficeEditor');
            const openAsDefault = config.get<boolean>('openAsDefault', false);

            if (!openAsDefault) {
                return;
            }

            // Check if it's a markdown file in the default text editor
            const uri = editor.document.uri;
            const uriString = uri.toString();
            
            if (editor.document.languageId === 'markdown' && 
                uri.scheme === 'file' &&
                !recentlyAutoOpened.has(uriString)) {
                
                // Mark as recently opened to prevent loops
                recentlyAutoOpened.add(uriString);
                
                // Small delay to ensure the editor is fully loaded
                setTimeout(async () => {
                    try {
                        await vscode.commands.executeCommand('vscode.openWith', uri, 'mdOfficeEditor.markdownEditor');
                        // Clear the tracking after a short delay
                        setTimeout(() => {
                            recentlyAutoOpened.delete(uriString);
                        }, 2000);
                    } catch (error) {
                        console.error('[MDOffice] Failed to auto-open with MDOffice:', error);
                        recentlyAutoOpened.delete(uriString);
                    }
                }, 100);
            }
        })
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
            // Try to get document from custom editor first, then fall back to active text editor
            let document = (provider as any).constructor.getCurrentDocument();
            if (!document) {
                const editor = vscode.window.activeTextEditor;
                if (editor && editor.document.languageId === 'markdown') {
                    document = editor.document;
                }
            }
            
            if (document) {
                await ExportService.exportToPDF(document);
            } else {
                vscode.window.showWarningMessage('Please open a markdown file to export.');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('mdOfficeEditor.exportToHTML', async () => {
            // Try to get document from custom editor first, then fall back to active text editor
            let document = (provider as any).constructor.getCurrentDocument();
            if (!document) {
                const editor = vscode.window.activeTextEditor;
                if (editor && editor.document.languageId === 'markdown') {
                    document = editor.document;
                }
            }
            
            if (document) {
                await ExportService.exportToHTML(document);
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

    context.subscriptions.push(
        vscode.commands.registerCommand('mdOfficeEditor.openSettings', async () => {
            // Open VS Code settings UI and focus on MDOffice extension settings
            await vscode.commands.executeCommand('workbench.action.openSettings', '@ext:06401f15-a30d-6a97-82a3-8ca0e379c4eb.md-office-editor');
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('mdOfficeEditor.toggleDefaultEditor', async () => {
            const config = vscode.workspace.getConfiguration('mdOfficeEditor');
            const currentValue = config.get<boolean>('openAsDefault', false);
            const newValue = !currentValue;
            
            await config.update('openAsDefault', newValue, vscode.ConfigurationTarget.Global);
            
            const message = newValue 
                ? 'MDOffice is now the default editor for markdown files'
                : 'MDOffice is no longer the default editor for markdown files';
            
            vscode.window.showInformationMessage(message);
        })
    );
}

export function deactivate() {
    console.log('MDOffice - Markdown Office Editor is now deactivated');
}

