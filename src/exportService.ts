import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ExportService {
    static async exportToHTML(document: vscode.TextDocument): Promise<void> {
        const markdown = document.getText();
        const html = this.generateHTML(markdown, document.fileName);
        
        const defaultPath = document.uri.fsPath.replace(/\.md$/, '.html');
        const saveUri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(defaultPath),
            filters: {
                'HTML': ['html', 'htm']
            }
        });

        if (saveUri) {
            fs.writeFileSync(saveUri.fsPath, html, 'utf8');
            const action = await vscode.window.showInformationMessage(
                'HTML file exported successfully!',
                'Open File'
            );
            
            if (action === 'Open File') {
                await vscode.env.openExternal(saveUri);
            }
        }
    }

    static async exportToPDF(document: vscode.TextDocument): Promise<void> {
        // Note: PDF export requires additional dependencies or external tools
        // For now, we'll export to HTML and suggest using browser print-to-PDF
        const markdown = document.getText();
        const html = this.generateHTML(markdown, document.fileName, true);
        
        const defaultPath = document.uri.fsPath.replace(/\.md$/, '_for_pdf.html');
        const saveUri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(defaultPath),
            filters: {
                'HTML': ['html']
            }
        });

        if (saveUri) {
            fs.writeFileSync(saveUri.fsPath, html, 'utf8');
            const action = await vscode.window.showInformationMessage(
                'HTML file created for PDF export! Open it in a browser and use Print > Save as PDF.',
                'Open File'
            );
            
            if (action === 'Open File') {
                await vscode.env.openExternal(saveUri);
            }
        }
    }

    private static generateHTML(markdown: string, fileName: string, forPDF: boolean = false): string {
        const title = path.basename(fileName, '.md');
        const bodyContent = this.parseMarkdown(markdown);
        
        // Get export settings
        const config = vscode.workspace.getConfiguration('mdOfficeEditor.export');
        const paperSize = config.get<string>('paperSize', 'Letter');
        const margins = config.get<number>('margins', 48);
        
        // Paper size dimensions
        const paperSizes: { [key: string]: string } = {
            'Letter': '216mm', // 8.5 inches
            'A4': '210mm',
            'Legal': '216mm' // 8.5 inches
        };
        
        const maxWidth = forPDF ? paperSizes[paperSize] : '900px';
        const padding = forPDF ? `${margins / 3.78}mm` : `${margins}px`; // Convert px to mm for PDF
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHtml(title)}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: ${maxWidth};
            margin: 0 auto;
            padding: ${padding};
            background: white;
        }

        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
        }

        h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        h3 { font-size: 1.25em; }
        h4 { font-size: 1em; }
        h5 { font-size: 0.875em; }
        h6 { font-size: 0.85em; color: #6a737d; }

        p {
            margin-top: 0;
            margin-bottom: 16px;
        }

        a {
            color: #0366d6;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        ul, ol {
            padding-left: 2em;
            margin-top: 0;
            margin-bottom: 16px;
        }

        li {
            margin-bottom: 4px;
        }

        code {
            background: #f6f8fa;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 0.9em;
        }

        pre {
            background: #f6f8fa;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            margin-bottom: 16px;
        }

        pre code {
            background: none;
            padding: 0;
        }

        blockquote {
            margin: 0 0 16px 0;
            padding: 0 1em;
            color: #6a737d;
            border-left: 4px solid #dfe2e5;
        }

        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 16px;
        }

        table th,
        table td {
            padding: 6px 13px;
            border: 1px solid #dfe2e5;
        }

        table th {
            font-weight: 600;
            background: #f6f8fa;
        }

        table tr:nth-child(2n) {
            background: #f6f8fa;
        }

        img {
            max-width: 100%;
            height: auto;
        }

        hr {
            border: 0;
            border-top: 1px solid #dfe2e5;
            margin: 24px 0;
        }

        ${forPDF ? `
        @media print {
            body {
                max-width: 100%;
                padding: 0;
            }
        }
        ` : ''}
    </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
    }

    private static parseMarkdown(text: string): string {
        let html = text;

        // Escape HTML
        html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Code blocks
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Headers
        html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
        html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
        html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
        html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
        html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
        html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
        html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

        // Strikethrough
        html = html.replace(/~~([^~]+)~~/g, '<s>$1</s>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');

        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1">');

        // Unordered lists
        html = html.replace(/^\*\s+(.*)$/gm, '<li>$1</li>');
        html = html.replace(/^-\s+(.*)$/gm, '<li>$1</li>');
        
        // Task lists
        html = html.replace(/^-\s+\[( |x)\]\s+(.*)$/gm, (match, checked, text) => {
            return `<li><input type="checkbox" ${checked === 'x' ? 'checked' : ''} disabled> ${text}</li>`;
        });

        // Wrap consecutive list items
        html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
            return '<ul>' + match + '</ul>';
        });

        // Blockquotes
        html = html.replace(/^&gt;\s+(.*)$/gm, '<blockquote>$1</blockquote>');

        // Horizontal rules
        html = html.replace(/^---$/gm, '<hr>');
        html = html.replace(/^\*\*\*$/gm, '<hr>');

        // Paragraphs
        html = html.split('\n\n').map(para => {
            para = para.trim();
            if (para && !para.match(/^<[^>]+>/)) {
                return '<p>' + para + '</p>';
            }
            return para;
        }).join('\n');

        return html;
    }

    private static escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}


