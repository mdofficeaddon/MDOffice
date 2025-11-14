import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore - markdown-it doesn't have types in this project
import MarkdownIt from 'markdown-it';

export class ExportService {
    static async exportToHTML(document: vscode.TextDocument): Promise<void> {
        try {
            console.log('[MDOffice] Starting HTML export...');
            const markdown = document.getText();
            console.log('[MDOffice] Document text length:', markdown.length);
            
            const html = this.generateHTML(markdown, document.fileName);
            console.log('[MDOffice] HTML generated, length:', html.length);
            
            const defaultPath = document.uri.fsPath.replace(/\.md$/, '.html');
            console.log('[MDOffice] Default path:', defaultPath);
            
            const saveUri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file(defaultPath),
                filters: {
                    'HTML': ['html', 'htm']
                }
            });

            if (saveUri) {
                console.log('[MDOffice] Saving to:', saveUri.fsPath);
                fs.writeFileSync(saveUri.fsPath, html, 'utf8');
                console.log('[MDOffice] File saved successfully');
                
                const action = await vscode.window.showInformationMessage(
                    'HTML file exported successfully!',
                    'Open File'
                );
                
                if (action === 'Open File') {
                    await vscode.env.openExternal(saveUri);
                }
            } else {
                console.log('[MDOffice] Export cancelled by user');
            }
        } catch (error) {
            console.error('[MDOffice] Export error:', error);
            vscode.window.showErrorMessage(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    static async exportToPDF(document: vscode.TextDocument): Promise<void> {
        try {
            console.log('[MDOffice] Starting PDF export...');
            // Note: PDF export requires additional dependencies or external tools
            // For now, we'll export to HTML and suggest using browser print-to-PDF
            const markdown = document.getText();
            const html = this.generateHTML(markdown, document.fileName, true);
            
            const defaultPath = document.uri.fsPath.replace(/\.md$/, '_for_pdf.html');
            console.log('[MDOffice] PDF export - Default path:', defaultPath);
            
            const saveUri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file(defaultPath),
                filters: {
                    'HTML': ['html']
                }
            });

            if (saveUri) {
                console.log('[MDOffice] Saving PDF export to:', saveUri.fsPath);
                fs.writeFileSync(saveUri.fsPath, html, 'utf8');
                console.log('[MDOffice] PDF export file saved successfully');
                
                const action = await vscode.window.showInformationMessage(
                    'HTML file created for PDF export! Open it in a browser and use Print > Save as PDF.',
                    'Open File'
                );
                
                if (action === 'Open File') {
                    await vscode.env.openExternal(saveUri);
                }
            } else {
                console.log('[MDOffice] PDF export cancelled by user');
            }
        } catch (error) {
            console.error('[MDOffice] PDF export error:', error);
            vscode.window.showErrorMessage(`PDF export failed: ${error instanceof Error ? error.message : String(error)}`);
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

        /* Regular lists - Enhanced for deep nesting */
        ul, ol {
            padding-left: 2em;
            margin-top: 0;
            margin-bottom: 16px;
        }

        /* First level lists */
        body > ul, body > ol,
        body > div > ul, body > div > ol {
            margin-bottom: 16px;
        }

        /* Nested lists - progressive spacing reduction */
        li > ul, li > ol {
            margin-top: 6px;
            margin-bottom: 6px;
            padding-left: 2em;
        }

        /* Deep nested lists get tighter */
        li li > ul, li li > ol {
            margin-top: 4px;
            margin-bottom: 4px;
        }

        li li li > ul, li li li > ol {
            margin-top: 2px;
            margin-bottom: 2px;
        }

        /* List items - progressive spacing */
        li {
            margin-bottom: 8px;
            line-height: 1.6;
            position: relative;
        }

        /* Nested list items have progressively tighter spacing */
        li li {
            margin-bottom: 6px;
        }

        li li li {
            margin-bottom: 4px;
        }

        li li li li {
            margin-bottom: 3px;
        }

        li li li li li {
            margin-bottom: 2px;
        }

        /* Ordered lists - better number styling */
        ol {
            counter-reset: item;
        }

        ol > li {
            position: relative;
        }

        /* Bullet style progression for unordered lists */
        ul {
            list-style-type: disc;
        }

        ul ul {
            list-style-type: circle;
        }

        ul ul ul {
            list-style-type: square;
        }

        ul ul ul ul {
            list-style-type: disc;
        }

        ul ul ul ul ul {
            list-style-type: circle;
        }

        ul ul ul ul ul ul {
            list-style-type: square;
        }

        /* Ordered nested lists - progressive style changes */
        ol {
            list-style-type: decimal;
        }

        ol ol {
            list-style-type: lower-alpha;
        }

        ol ol ol {
            list-style-type: lower-roman;
        }

        ol ol ol ol {
            list-style-type: decimal;
        }

        ol ol ol ol ol {
            list-style-type: lower-alpha;
        }

        ol ol ol ol ol ol {
            list-style-type: lower-roman;
        }

        /* Visual depth indicators - subtle left border for deep nesting */
        li li li {
            padding-left: 4px;
            border-left: 1px solid rgba(0, 0, 0, 0.05);
        }

        li li li li {
            border-left: 1px solid rgba(0, 0, 0, 0.08);
        }

        li li li li li {
            border-left: 1px solid rgba(0, 0, 0, 0.10);
        }

        li li li li li li {
            border-left: 1px solid rgba(0, 0, 0, 0.12);
        }

        /* Slight background shading for very deep nesting (level 4+) */
        li li li li {
            background-color: rgba(240, 240, 240, 0.3);
            border-radius: 2px;
        }

        li li li li li {
            background-color: rgba(240, 240, 240, 0.5);
        }

        li li li li li li {
            background-color: rgba(240, 240, 240, 0.7);
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

        /* Task lists (checklists) - Matching office view styling */
        ul.task-list {
            list-style-type: none;
            padding-left: 0;
            margin-bottom: 12px;
        }

        .task-list-item {
            padding: 6px 10px;
            margin-bottom: 4px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
            position: relative;
        }

        .task-list-item:hover {
            background-color: rgba(0, 0, 0, 0.03);
        }

        /* Container for checkbox and text */
        .task-list-item .task-content {
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .task-list-item input[type="checkbox"] {
            margin-top: 3px;
            cursor: pointer;
            width: 18px;
            height: 18px;
            flex-shrink: 0;
            border-radius: 3px;
            border: 2px solid #999;
            transition: all 0.2s ease;
            appearance: none;
            -webkit-appearance: none;
            background-color: white;
            position: relative;
        }

        .task-list-item input[type="checkbox"]:checked {
            background-color: #4CAF50;
            border-color: #4CAF50;
        }

        .task-list-item input[type="checkbox"]:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 14px;
            font-weight: bold;
        }

        .task-list-item input[type="checkbox"]:hover {
            border-color: #666;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }

        .task-list-item input[type="checkbox"]:checked:hover {
            border-color: #45a049;
            background-color: #45a049;
        }

        /* Completed task text styling */
        .task-list-item:has(input[type="checkbox"]:checked) .task-text {
            color: #888;
            text-decoration: line-through;
        }

        /* Wrapper for task text */
        .task-list-item .task-text {
            flex: 1;
            line-height: 1.5;q2
        }

        /* NESTED TASK LISTS - Clear visual hierarchy matching office view */
        .task-list-item > .task-list {
            margin: 8px 0 0 0;
            padding-left: 32px;
            position: relative;
        }

        /* Vertical connecting line for nested items */
        .task-list-item > .task-list::before {
            content: '';
            position: absolute;
            left: 14px;
            top: 0;
            bottom: 4px;
            width: 2px;
            background: linear-gradient(to bottom, #d0d0d0 0%, #d0d0d0 90%, transparent 100%);
            border-radius: 1px;
        }

        /* Horizontal connector from vertical line to each item */
        .task-list-item > .task-list > .task-list-item::before {
            content: '';
            position: absolute;
            left: -18px;
            top: 18px;
            width: 14px;
            height: 2px;
            background: #d0d0d0;
            border-radius: 1px;
        }

        /* Progressive background shading with blue tint for depth perception */
        .task-list .task-list-item {
            background-color: rgba(100, 100, 255, 0.02);
        }

        .task-list .task-list .task-list-item {
            background-color: rgba(100, 100, 255, 0.04);
        }

        .task-list .task-list .task-list .task-list-item {
            background-color: rgba(100, 100, 255, 0.06);
        }

        .task-list .task-list .task-list .task-list .task-list-item {
            background-color: rgba(100, 100, 255, 0.08);
        }

        /* Progressive hover states */
        .task-list .task-list-item:hover {
            background-color: rgba(100, 100, 255, 0.08);
        }

        .task-list .task-list .task-list-item:hover {
            background-color: rgba(100, 100, 255, 0.10);
        }

        .task-list .task-list .task-list .task-list-item:hover {
            background-color: rgba(100, 100, 255, 0.12);
        }

        /* Nested task lists inside regular list items */
        li > .task-list {
            padding-left: 32px;
            margin-top: 8px;
            margin-bottom: 8px;
            position: relative;
        }

        li > .task-list::before {
            content: '';
            position: absolute;
            left: 14px;
            top: 0;
            bottom: 4px;
            width: 2px;
            background: linear-gradient(to bottom, #d0d0d0 0%, #d0d0d0 90%, transparent 100%);
            border-radius: 1px;
        }

        /* Mixed lists with task lists - proper spacing */
        ul:not(.task-list) > li > .task-list,
        ol > li > .task-list {
            margin-top: 8px;
            padding-left: 24px;
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
        try {
            // Use markdown-it library for proper markdown parsing
            const md = new MarkdownIt({
                html: true,
                linkify: true,
                typographer: true,
                breaks: false
            });

            // Enable tables support
            md.enable('table');

            // Render markdown to HTML
            let html = md.render(text);
            
            // Post-process to convert task list items - Multiple passes for complex cases
            // We need to be careful about order - start with most specific patterns first
            
            // Pass 1: Handle <li><p> with checkbox and potential nested content after </p>
            html = html.replace(/<li>\s*<p>\[([ xX])\]\s*(.*?)<\/p>([\s\S]*?)<\/li>/gi, (_match: string, checked: string, content: string, nested: string) => {
                const isChecked = checked.toLowerCase() === 'x';
                // If there's nested content after the paragraph, preserve it
                if (nested.trim()) {
                    return `<li class="task-list-item"><div class="task-content"><input type="checkbox" ${isChecked ? 'checked ' : ''}disabled><span class="task-text">${content.trim()}</span></div>${nested}</li>`;
                }
                return `<li class="task-list-item"><div class="task-content"><input type="checkbox" ${isChecked ? 'checked ' : ''}disabled><span class="task-text">${content.trim()}</span></div></li>`;
            });

            // Pass 2: Handle checkboxes in paragraph tags without content
            html = html.replace(/<li>\s*<p>\[([ xX])\]\s*<\/p>\s*<\/li>/gi, (_match: string, checked: string) => {
                const isChecked = checked.toLowerCase() === 'x';
                return `<li class="task-list-item"><div class="task-content"><input type="checkbox" ${isChecked ? 'checked ' : ''}disabled><span class="task-text"></span></div></li>`;
            });

            // Pass 3: Handle bare checkboxes (empty task items) like "- [ ]"
            html = html.replace(/<li>\s*\[([ xX])\]\s*<\/li>/gi, (_match: string, checked: string) => {
                const isChecked = checked.toLowerCase() === 'x';
                return `<li class="task-list-item"><div class="task-content"><input type="checkbox" ${isChecked ? 'checked ' : ''}disabled><span class="task-text"></span></div></li>`;
            });

            // Pass 4: Handle <li> with inline checkbox and nested content
            // This needs to match the full closing tag to avoid cutting off nested lists
            html = html.replace(/<li>(\s*)\[([ xX])\]\s*([\s\S]*?)<\/li>/gi, (_match: string, _spaces: string, checked: string, content: string) => {
                const isChecked = checked.toLowerCase() === 'x';
                // Keep the content as-is (may contain nested lists)
                return `<li class="task-list-item"><div class="task-content"><input type="checkbox" ${isChecked ? 'checked ' : ''}disabled><span class="task-text">${content.trim()}</span></div></li>`;
            });

            // Pass 5: Final pass - handle any remaining plain text checkboxes
            // This uses a simpler split approach to handle complex nesting
            html = html.split('\n').map((line: string) => {
                // Skip if already transformed or doesn't contain checkbox pattern
                if (line.includes('task-list-item') || !line.match(/<li>.*?\[[ xX]\]/)) {
                    return line;
                }
                
                // Match lines like: <li>[ ] Some text
                const match = line.match(/^(\s*<li>)\s*\[([ xX])\]\s*(.*)$/);
                if (match) {
                    const prefix = match[1];
                    const checkChar = match[2].toLowerCase() === 'x';
                    const rest = match[3];
                    const checkedAttr = checkChar ? 'checked ' : '';
                    
                    // Check if this line has a closing tag or not
                    if (rest.includes('</li>')) {
                        // Complete line with closing tag
                        const textContent = rest.replace(/<\/li>.*$/, '');
                        const suffix = rest.substring(rest.indexOf('</li>'));
                        const newPrefix = '<li class="task-list-item"><div class="task-content"><input type="checkbox" ' + checkedAttr + 'disabled><span class="task-text">';
                        return prefix.replace('<li>', newPrefix) + textContent + '</span></div>' + suffix;
                    } else {
                        // Line without closing tag (multiline list item)
                        const newPrefix = '<li class="task-list-item"><div class="task-content"><input type="checkbox" ' + checkedAttr + 'disabled><span class="task-text">';
                        return prefix.replace('<li>', newPrefix) + rest;
                    }
                }
                
                return line;
            }).join('\n');

            // Pass 6: Close any unclosed task-text spans before closing list items
            html = html.replace(/<span class="task-text">([^<]*?)(<ul|<ol)/gi, '<span class="task-text">$1</span></div>$2');

            // Mark lists containing task items - need to do this recursively for nested lists
            let previousHtml = '';
            let iterations = 0;
            const maxIterations = 10;
            
            // Keep replacing until no more changes (handles nested task lists)
            while (previousHtml !== html && iterations < maxIterations) {
                previousHtml = html;
                html = html.replace(/<ul>([\s\S]*?)<\/ul>/g, (match: string, content: string) => {
                    if (content.includes('task-list-item') && !match.startsWith('<ul class="task-list">')) {
                        return '<ul class="task-list">' + content + '</ul>';
                    }
                    return match;
                });
                iterations++;
            }

            return html;
        } catch (error) {
            console.error('[MDOffice] Error parsing markdown:', error);
            // Fallback: return escaped HTML if markdown-it fails
            return '<p>' + this.escapeHtml(text).replace(/\n/g, '</p>\n<p>') + '</p>';
        }
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


