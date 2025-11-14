import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getNonce } from './util';
import { getWebviewContent } from './webviewContent';

export class MarkdownEditorProvider implements vscode.CustomTextEditorProvider {
    private static currentPanel: vscode.WebviewPanel | undefined;
    private static currentDocument: vscode.TextDocument | undefined;

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

    public static getCurrentDocument(): vscode.TextDocument | undefined {
        return MarkdownEditorProvider.currentDocument;
    }

    constructor(private readonly context: vscode.ExtensionContext) {}

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        // Track the current panel and document
        MarkdownEditorProvider.currentPanel = webviewPanel;
        MarkdownEditorProvider.currentDocument = document;

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
        const documentDir = vscode.Uri.joinPath(document.uri, '..');
        webviewPanel.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this.context.extensionUri, 'assets'),
                vscode.Uri.joinPath(this.context.extensionUri, 'media'),
                vscode.Uri.joinPath(this.context.extensionUri, 'node_modules'),
                documentDir // Allow access to images in the document's directory
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
                MarkdownEditorProvider.currentDocument = undefined;
            }
        });

        // Receive message from the webview
        webviewPanel.webview.onDidReceiveMessage(async e => {
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
                case 'command':
                    // Execute VS Code command
                    console.log(`[MD Office] Executing command: ${e.command}`);
                    vscode.commands.executeCommand(e.command).then(() => {
                        console.log(`[MD Office] Command executed successfully: ${e.command}`);
                    }, (error: any) => {
                        console.error(`[MD Office] Command failed: ${e.command}`, error);
                        vscode.window.showErrorMessage(`Failed to execute command: ${error.message}`);
                    });
                    return;
                case 'selectImage':
                    await this.handleImageSelection(webviewPanel, document);
                    return;
                case 'saveImageFromClipboard':
                    await this.handleImageFromClipboard(webviewPanel, document, e.imageData, e.altText);
                    return;
                case 'openLinkedFile':
                    await this.handleOpenLinkedFile(document, e.filePath, e.anchor);
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
            showReadingTime: config.get<boolean>('showReadingTime', true),
            documentUri: webview.asWebviewUri(document.uri).toString(),
            documentDir: webview.asWebviewUri(vscode.Uri.joinPath(document.uri, '..')).toString()
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

    private async handleImageSelection(webviewPanel: vscode.WebviewPanel, document: vscode.TextDocument) {
        // Open file picker dialog
        const options: vscode.OpenDialogOptions = {
            canSelectMany: false,
            openLabel: 'Select Image',
            filters: {
                'Images': ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp', 'webp']
            }
        };

        const fileUri = await vscode.window.showOpenDialog(options);
        if (fileUri && fileUri[0]) {
            const imagePath = fileUri[0].fsPath;
            const documentPath = path.dirname(document.uri.fsPath);
            
            // Show quick pick for how to insert the image
            const choice = await vscode.window.showQuickPick([
                { label: 'Relative Path', description: 'Reference image with relative path (recommended)', value: 'relative' },
                { label: 'Absolute Path', description: 'Reference image with absolute path', value: 'absolute' },
                { label: 'Embed as Base64', description: 'Embed image directly in markdown (increases file size)', value: 'base64' }
            ], {
                placeHolder: 'Choose how to insert the image'
            });

            if (!choice) return;

            let imageMarkdown = '';
            const altText = await vscode.window.showInputBox({
                prompt: 'Enter alt text for the image',
                value: path.basename(imagePath, path.extname(imagePath))
            }) || 'Image';

            switch (choice.value) {
                case 'relative':
                    const relativePath = path.relative(documentPath, imagePath).replace(/\\/g, '/');
                    imageMarkdown = `![${altText}](${relativePath})`;
                    break;
                case 'absolute':
                    imageMarkdown = `![${altText}](${imagePath.replace(/\\/g, '/')})`;
                    break;
                case 'base64':
                    try {
                        const imageBuffer = fs.readFileSync(imagePath);
                        const base64Image = imageBuffer.toString('base64');
                        const ext = path.extname(imagePath).toLowerCase().substring(1);
                        const mimeType = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
                        imageMarkdown = `![${altText}](data:${mimeType};base64,${base64Image})`;
                    } catch (error) {
                        vscode.window.showErrorMessage(`Failed to read image: ${error}`);
                        return;
                    }
                    break;
            }

            // Send the markdown back to webview
            webviewPanel.webview.postMessage({
                type: 'insertImage',
                markdown: imageMarkdown
            });
        }
    }

    private async handleImageFromClipboard(webviewPanel: vscode.WebviewPanel, document: vscode.TextDocument, imageData: string, altText: string) {
        // Create a folder for images if it doesn't exist
        const documentPath = path.dirname(document.uri.fsPath);
        const imagesFolder = path.join(documentPath, 'images');
        
        if (!fs.existsSync(imagesFolder)) {
            fs.mkdirSync(imagesFolder, { recursive: true });
        }

        // Generate filename based on timestamp
        const timestamp = Date.now();
        const filename = `pasted-image-${timestamp}.png`;
        const imagePath = path.join(imagesFolder, filename);

        try {
            // Remove data URI prefix and save image
            const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            fs.writeFileSync(imagePath, buffer);

            // Create relative path markdown
            const relativePath = path.relative(documentPath, imagePath).replace(/\\/g, '/');
            const imageMarkdown = `![${altText || 'Pasted image'}](${relativePath})`;

            // Send the markdown back to webview
            webviewPanel.webview.postMessage({
                type: 'insertImage',
                markdown: imageMarkdown
            });

            vscode.window.showInformationMessage(`Image saved to ${relativePath}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to save image: ${error}`);
        }
    }

    private async handleOpenLinkedFile(currentDocument: vscode.TextDocument, filePath: string, anchor: string) {
        try {
            console.log('[MDOffice] Opening linked file:', {
                filePath: filePath,
                anchor: anchor,
                currentDoc: currentDocument.uri.fsPath
            });
            
            // Resolve the file path relative to the current document
            const currentDocDir = path.dirname(currentDocument.uri.fsPath);
            let resolvedPath = filePath;
            
            // Handle relative paths
            if (!path.isAbsolute(filePath)) {
                // Remove leading ./ if present
                const cleanPath = filePath.startsWith('./') ? filePath.substring(2) : filePath;
                resolvedPath = path.join(currentDocDir, cleanPath);
            }
            
            // Normalize path separators for the current OS
            resolvedPath = path.normalize(resolvedPath);
            
            console.log('[MDOffice] Path resolution:', {
                original: filePath,
                currentDocDir: currentDocDir,
                resolved: resolvedPath,
                exists: fs.existsSync(resolvedPath)
            });
            
            // Check if file exists
            if (!fs.existsSync(resolvedPath)) {
                const errorMsg = `File not found: ${filePath}\nResolved to: ${resolvedPath}`;
                console.error('[MDOffice]', errorMsg);
                vscode.window.showErrorMessage(errorMsg);
                return;
            }
            
            // Create URI for the file
            const fileUri = vscode.Uri.file(resolvedPath);
            
            console.log('[MDOffice] Opening file with URI:', fileUri.toString());
            
            // Open the file with MDOffice editor
            await vscode.commands.executeCommand('vscode.openWith', fileUri, 'mdOfficeEditor.markdownEditor');
            
            // If there's an anchor, scroll to it after a short delay
            if (anchor) {
                setTimeout(() => {
                    // Send message to scroll to the anchor
                    if (MarkdownEditorProvider.currentPanel) {
                        console.log('[MDOffice] Scrolling to anchor:', anchor);
                        MarkdownEditorProvider.currentPanel.webview.postMessage({
                            type: 'scrollToAnchor',
                            anchor: anchor
                        });
                    }
                }, 500); // Wait for the file to load
            }
            
            console.log('[MDOffice] Opened linked file successfully');
        } catch (error) {
            const errorMsg = `Failed to open file: ${filePath}`;
            console.error('[MDOffice]', errorMsg, error);
            vscode.window.showErrorMessage(`${errorMsg}\nError: ${error}`);
        }
    }
}


