import * as vscode from 'vscode';
import * as path from 'path';
import { getNonce } from './util';
import { getWebviewContent } from './webviewContent';

export class MarkdownEditorProvider implements vscode.CustomTextEditorProvider {
    private static currentPanel: vscode.WebviewPanel | undefined;

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new MarkdownEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(
            'mdOfficeEditor.markdownEditor',
            provider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true,
                },
            }
        );
        return providerRegistration;
    }

    public static getCurrentPanel(): vscode.WebviewPanel | undefined {
        return MarkdownEditorProvider.currentPanel;
    }

    constructor(private readonly context: vscode.ExtensionContext) {}

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        // Track the current panel
        MarkdownEditorProvider.currentPanel = webviewPanel;

        // Set the icon for the tab
        try {
            const iconPath = vscode.Uri.joinPath(this.context.extensionUri, 'assets', 'media', 'icon-tab-32.png');
            console.log('[MD Office] Extension URI:', this.context.extensionUri.toString());
            console.log('[MD Office] Icon path:', iconPath.toString());
            
            // Set iconPath - for CustomTextEditorProvider, this may not work but we try
            (webviewPanel as any).iconPath = iconPath;
            console.log('[MD Office] Icon path set');
        } catch (error) {
            console.error('[MD Office] Error setting icon:', error);
        }

        // Setup initial content for the webview
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.context.extensionUri, 'assets'),
                vscode.Uri.joinPath(this.context.extensionUri, 'media'),
                vscode.Uri.joinPath(this.context.extensionUri, 'node_modules')
            ]
        };

        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, document);

        function updateWebview() {
            webviewPanel.webview.postMessage({
                type: 'update',
                text: document.getText(),
            });
        }

        // Hook up event handlers so that we can synchronize the webview with the text document
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                updateWebview();
            }
        });

        // Make sure we get rid of the listener when our editor is closed
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
            if (MarkdownEditorProvider.currentPanel === webviewPanel) {
                MarkdownEditorProvider.currentPanel = undefined;
            }
        });

        // Receive message from the webview
        webviewPanel.webview.onDidReceiveMessage(e => {
            switch (e.type) {
                case 'edit':
                    this.updateTextDocument(document, e.content);
                    return;
                case 'insert':
                    this.insertAtCursor(document, e.text);
                    return;
                case 'format':
                    this.applyFormatting(document, e.format, e.selection);
                    return;
                case 'saveViewMode':
                    // Save view mode preference
                    const config = vscode.workspace.getConfiguration('mdOfficeEditor');
                    if (config.get<boolean>('rememberViewMode', true)) {
                        this.context.workspaceState.update('lastViewMode', e.viewMode);
                    }
                    return;
                case 'saveThemeMode':
                    // Save theme mode preference
                    this.context.workspaceState.update('lastThemeMode', e.themeMode);
                    return;
            }
        });

        // Send initial content
        updateWebview();
        
        // Restore last view mode if enabled
        const config = vscode.workspace.getConfiguration('mdOfficeEditor');
        if (config.get<boolean>('rememberViewMode', true)) {
            const lastViewMode = this.context.workspaceState.get<string>('lastViewMode');
            if (lastViewMode) {
                setTimeout(() => {
                    webviewPanel.webview.postMessage({
                        type: 'restoreViewMode',
                        viewMode: lastViewMode
                    });
                }, 100);
            }
        }
        
        // Restore last theme mode
        const lastThemeMode = this.context.workspaceState.get<string>('lastThemeMode');
        if (lastThemeMode) {
            setTimeout(() => {
                webviewPanel.webview.postMessage({
                    type: 'restoreThemeMode',
                    themeMode: lastThemeMode
                });
            }, 100);
        }
    }

    private getHtmlForWebview(webview: vscode.Webview, document: vscode.TextDocument): string {
        const nonce = getNonce();
        const config = vscode.workspace.getConfiguration('mdOfficeEditor');
        
        // Read all settings
        const settings = {
            pageMargins: config.get<number>('pageMargins', 48),
            fontSize: config.get<number>('fontSize', 11),
            fontFamily: config.get<string>('fontFamily', 'Calibri'),
            lineHeight: config.get<number>('lineHeight', 1.08),
            defaultViewMode: config.get<string>('defaultViewMode', 'split'),
            syncScroll: config.get<boolean>('syncScroll', true),
            documentTheme: config.get<string>('documentTheme', 'auto'),
            wordCountGoal: config.get<number>('wordCountGoal', 0),
            showReadingTime: config.get<boolean>('showReadingTime', true)
        };
        
        return getWebviewContent(webview, this.context.extensionUri, nonce, document.getText(), settings);
    }

    private updateTextDocument(document: vscode.TextDocument, content: string) {
        const edit = new vscode.WorkspaceEdit();
        
        // Replace the entire document
        edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            content
        );

        return vscode.workspace.applyEdit(edit);
    }

    private insertAtCursor(document: vscode.TextDocument, text: string) {
        const edit = new vscode.WorkspaceEdit();
        
        // Insert at the end of the document for now
        const lastLine = document.lineAt(document.lineCount - 1);
        edit.insert(
            document.uri,
            new vscode.Position(document.lineCount - 1, lastLine.text.length),
            '\n' + text
        );

        return vscode.workspace.applyEdit(edit);
    }

    private applyFormatting(document: vscode.TextDocument, format: string, selection: any) {
        // This will be enhanced with actual cursor position tracking
        // For now, we'll handle it through the webview editor
    }
}


