import * as vscode from 'vscode';

interface WebviewSettings {
    pageMargins: number;
    fontSize: number;
    fontFamily: string;
    lineHeight: number;
    defaultViewMode: string;
    syncScroll: boolean;
    documentTheme: string;
    wordCountGoal: number;
    showReadingTime: boolean;
}

export function getWebviewContent(
    webview: vscode.Webview,
    extensionUri: vscode.Uri,
    nonce: string,
    initialContent: string,
    settings: WebviewSettings
): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <title>Markdown Office Editor</title>
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .toolbar {
            background: linear-gradient(180deg, 
                var(--vscode-editor-background) 0%, 
                var(--vscode-sideBar-background) 100%);
            border-bottom: 2px solid var(--vscode-panel-border);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 4px 0;
            padding-left: 8px;
            display: flex;
            flex-wrap: wrap;
            gap: 3px;
            align-items: center;
            min-height: 38px;
            backdrop-filter: blur(10px);
        }

        .toolbar-group {
            display: flex;
            gap: 2px;
            padding: 0 8px;
            padding-left: 0;
            border-right: 1px solid var(--vscode-panel-border);
            align-items: center;
            margin-right: 8px;
        }

        .toolbar-group:last-child {
            border-right: none;
            margin-right: 8px;
        }

        .toolbar-button {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: 1px solid transparent;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
            white-space: nowrap;
        }

        .toolbar-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 0%;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            transition: width 0.3s ease;
            z-index: 0;
        }

        .toolbar-button:hover::before {
            width: 100%;
        }

        .toolbar-button:hover {
            background: var(--vscode-button-secondaryHoverBackground);
            border-color: var(--vscode-focusBorder);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .toolbar-button:active {
            background: var(--vscode-button-background);
            transform: translateY(0);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .toolbar-button.active {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border-color: var(--vscode-focusBorder);
            box-shadow: 0 0 0 2px var(--vscode-focusBorder);
        }

        .toolbar-button span {
            position: relative;
            z-index: 1;
            font-size: 13px;
            line-height: 1;
        }

        .view-selector {
            margin-left: auto;
            display: flex;
            align-items: center;
        }

        .view-selector select {
            background: var(--vscode-dropdown-background);
            color: var(--vscode-dropdown-foreground);
            border: 1px solid var(--vscode-dropdown-border);
            padding: 4px 8px;
            padding-right: 28px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
            appearance: none;
            background-image: url('data:image/svg+xml;utf8,<svg fill="%23ffffff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
            background-repeat: no-repeat;
            background-position: right 6px center;
            background-size: 14px;
        }

        .view-selector select:hover {
            border-color: var(--vscode-focusBorder);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .view-selector select:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
            box-shadow: 0 0 0 2px var(--vscode-focusBorder);
        }

        .container {
            display: flex;
            flex: 1;
            overflow: hidden;
            background: #f0f0f0; /* Lighter gray background like Word */
            position: relative;
        }

        .editor-pane {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            min-width: 200px;
        }

        .preview-pane {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border-left: 1px solid #999;
            min-width: 200px;
        }

        /* Resizer between editor and preview */
        .resizer {
            width: 5px;
            background: #999;
            cursor: col-resize;
            flex-shrink: 0;
            transition: background 0.2s;
            display: none;
        }

        .resizer:hover {
            background: #666;
        }

        .resizer.active {
            background: var(--vscode-focusBorder, #007acc);
        }

        /* Show resizer only in split view */
        .container:not(.editor-only):not(.preview-only) .resizer {
            display: block;
        }

        /* Full width when only one pane is visible */
        .editor-pane:not(.hidden) ~ .preview-pane.hidden {
            display: none;
        }

        .editor-pane.hidden ~ .preview-pane:not(.hidden) {
            border-left: none;
        }

        /* Wider document in single-pane view */
        body.single-pane-view .editor-document,
        body.single-pane-view .preview-document {
            max-width: 1400px; /* Much wider when only one pane visible */
        }

        .editor-wrapper {
            flex: 1;
            overflow: hidden;
            padding: 0;
            background: #f0f0f0; /* Lighter gray background around document */
            display: flex;
            flex-direction: column;
        }

        .editor-document {
            max-width: 100%;
            width: 100%;
            margin: 0;
            background: white;
            box-shadow: none;
            flex: 1;
            position: relative;
            border: none;
            display: flex;
            flex-direction: column;
            min-height: 0;
        }

        #editor {
            width: 100%;
            flex: 1;
            background: white;
            color: #1f1f1f; /* Slightly softer than pure black */
            border: none;
            outline: none;
            font-family: '${settings.fontFamily}', 'Calibri', 'Cambria', 'Georgia', 'Segoe UI', 'Arial', sans-serif;
            font-size: ${settings.fontSize}pt;
            line-height: ${settings.lineHeight};
            resize: none;
            padding: 12px;
            tab-size: 4;
            box-sizing: border-box;
        }

        #editor::placeholder {
            color: #999;
            font-style: italic;
        }

        #editor:focus {
            outline: none; /* Clean focus, no blue border */
        }

        .preview-wrapper {
            flex: 1;
            overflow: auto;
            padding: 0;
            background: #f0f0f0; /* Lighter gray background around document */
        }

        .preview-document {
            max-width: 816px; /* 8.5 inches at 96 DPI (Letter paper width) */
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Softer shadow like modern Word */
            min-height: 1056px; /* 11 inches at 96 DPI (Letter paper height) */
            padding: ${settings.pageMargins}px;
            border: none; /* Clean edges like Word */
        }

        #preview {
            color: #1f1f1f; /* Slightly softer than pure black */
            font-family: '${settings.fontFamily}', 'Calibri', 'Cambria', 'Georgia', 'Segoe UI', 'Arial', sans-serif;
            font-size: ${settings.fontSize}pt;
            line-height: ${settings.lineHeight};
        }

        /* Editable preview styles */
        #preview[contenteditable="true"] {
            outline: none;
            cursor: text;
        }

        #preview[contenteditable="true"]:focus {
            outline: 2px solid var(--vscode-focusBorder, #007acc);
            outline-offset: -2px;
        }

        #preview h1, #preview h2, #preview h3, #preview h4, #preview h5, #preview h6 {
            margin-top: 12pt;
            margin-bottom: 8pt;
            font-weight: 600;
            line-height: 1.15;
            color: #1f1f1f;
        }

        #preview h1 { 
            font-size: 20pt; 
            font-weight: 700; 
            color: #2f5496; /* Word blue for Heading 1 */
            margin-top: 18pt;
            margin-bottom: 10pt;
        }
        #preview h2 { 
            font-size: 16pt; 
            font-weight: 600; 
            color: #2f5496; /* Word blue for Heading 2 */
            margin-top: 14pt;
        }
        #preview h3 { 
            font-size: 14pt; 
            font-weight: 600; 
            color: #1f3864; /* Darker blue */
            margin-top: 12pt;
        }
        #preview h4 { font-size: 12pt; font-weight: 600; }
        #preview h5 { font-size: 11pt; font-weight: 600; font-style: italic; }
        #preview h6 { font-size: 11pt; font-weight: 400; font-style: italic; color: #666; }

        #preview p {
            margin-top: 0;
            margin-bottom: 8pt;
            line-height: 1.08; /* Word's single spacing */
        }

        #preview ul, #preview ol {
            padding-left: 2em;
            margin-top: 0;
            margin-bottom: 16px;
        }

        #preview li {
            margin-bottom: 4px;
        }

        /* Nested lists */
        #preview li > ul,
        #preview li > ol {
            margin-top: 4px;
            margin-bottom: 4px;
        }

        #preview ul ul,
        #preview ol ul,
        #preview ul ol,
        #preview ol ol {
            margin-bottom: 0;
        }

        /* Task lists (checklists) */
        #preview .task-list {
            list-style-type: none;
            padding-left: 0;
        }

        #preview .task-list-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }

        #preview .task-list-item input[type="checkbox"] {
            margin-top: 4px;
            cursor: pointer;
            width: 16px;
            height: 16px;
            flex-shrink: 0;
        }
        
        #preview .task-list-item input[type="checkbox"]:hover {
            opacity: 0.8;
        }

        /* Nested task lists */
        #preview li > .task-list {
            padding-left: 24px;
        }

        #preview code {
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 2px;
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 10pt;
            color: #000000;
            border: 1px solid #e0e0e0;
        }

        #preview pre {
            background: #f8f8f8;
            padding: 16px;
            border: 1px solid #d0d0d0;
            border-radius: 2px;
            overflow-x: auto;
            margin-bottom: 16px;
        }

        #preview pre code {
            background: none;
            padding: 0;
            border: none;
        }

        #preview blockquote {
            margin: 0 0 16px 0;
            padding: 8px 16px;
            background: #f9f9f9;
            border-left: 4px solid #b0b0b0;
            color: #333;
            font-style: italic;
        }
        
        /* Nested blockquotes */
        #preview blockquote blockquote {
            margin: 8px 0;
            background: #f0f0f0;
            border-left-color: #909090;
        }
        
        #preview blockquote blockquote blockquote {
            background: #e8e8e8;
            border-left-color: #707070;
        }

        /* Table wrapper for horizontal scrolling */
        #preview .table-wrapper {
            display: block;
            overflow-x: auto;
            margin-bottom: 16px;
        }

        #preview table {
            border-collapse: collapse;
            width: 100%;
            border: 1px solid #a0a0a0;
            table-layout: auto;
        }

        #preview table th,
        #preview table td {
            padding: 8px 12px;
            border: 1px solid #a0a0a0;
            text-align: left;
            white-space: nowrap;
        }

        #preview table th {
            font-weight: 600;
            background: #e8e8e8;
            color: #000000;
        }

        #preview table tr:nth-child(even) {
            background: #f5f5f5;
        }

        #preview table tr:nth-child(odd) {
            background: white;
        }

        #preview a {
            color: #0563c1; /* Word hyperlink blue */
            text-decoration: underline;
        }

        #preview a:hover {
            color: #0b5394;
            text-decoration: underline;
        }

        #preview img {
            max-width: 100%;
            height: auto;
            border: 1px solid #d0d0d0;
        }

        #preview hr {
            border: 0;
            border-top: 1px solid #b0b0b0;
            margin: 24px 0;
        }

        .hidden {
            display: none !important;
        }

        /* Dark theme styles */
        body.dark-theme .editor-wrapper,
        body.dark-theme .preview-wrapper {
            background: #1e1e1e;
        }

        body.dark-theme .editor-document,
        body.dark-theme .preview-document {
            background: #2d2d2d;
            color: #d4d4d4;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        body.dark-theme #editor {
            background: #2d2d2d;
            color: #d4d4d4;
        }

        body.dark-theme #preview {
            color: #d4d4d4;
        }

        body.dark-theme #preview h1,
        body.dark-theme #preview h2,
        body.dark-theme #preview h3,
        body.dark-theme #preview h4,
        body.dark-theme #preview h5,
        body.dark-theme #preview h6 {
            color: #569cd6;
        }

        body.dark-theme #preview code {
            background: #1e1e1e;
            color: #ce9178;
            border-color: #404040;
        }

        body.dark-theme #preview pre {
            background: #1e1e1e;
            border-color: #404040;
        }

        body.dark-theme #preview blockquote {
            background: #252525;
            border-left-color: #505050;
            color: #b0b0b0;
        }
        
        body.dark-theme #preview blockquote blockquote {
            background: #1e1e1e;
            border-left-color: #606060;
        }
        
        body.dark-theme #preview blockquote blockquote blockquote {
            background: #181818;
            border-left-color: #707070;
        }

        body.dark-theme #preview table {
            border-color: #505050;
        }

        body.dark-theme #preview table th,
        body.dark-theme #preview table td {
            border-color: #505050;
        }

        body.dark-theme #preview table th {
            background: #252525;
            color: #d4d4d4;
        }

        body.dark-theme #preview table tr:nth-child(even) {
            background: #2a2a2a;
        }

        body.dark-theme #preview table tr:nth-child(odd) {
            background: #2d2d2d;
        }

        body.dark-theme #preview hr {
            border-top-color: #505050;
        }

        body.dark-theme #preview img {
            border-color: #505050;
        }

        /* Focus mode styles */
        body.focus-mode .toolbar {
            display: none;
        }

        body.focus-mode .status-bar {
            display: none;
        }

        /* Focus mode exit hint */
        .focus-mode-hint {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            z-index: 10000;
        }

        body.focus-mode .focus-mode-hint {
            opacity: 1;
            animation: fadeInOut 4s ease-in-out;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
        }

        /* Sync scroll button */
        .toolbar-button.sync-scroll-active {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
        }

        /* Word count progress */
        .word-count-progress {
            display: inline-block;
            margin-left: 8px;
            color: var(--vscode-statusBar-foreground);
        }

        .word-count-progress.goal-reached {
            color: #4caf50;
            font-weight: bold;
        }

        /* Autosave indicator */
        .autosave-indicator {
            display: inline-block;
            margin-left: 12px;
            font-size: 11px;
            opacity: 0.7;
        }

        .autosave-indicator.saving {
            color: #ffa500;
        }

        .autosave-indicator.saved {
            color: #4caf50;
        }

        /* TOC Sidebar */
        .toc-sidebar {
            position: absolute;
            right: 0;
            top: 0;
            width: 250px;
            height: 100%;
            background: var(--vscode-sideBar-background);
            border-left: 1px solid var(--vscode-panel-border);
            overflow-y: auto;
            padding: 12px;
            display: none;
            z-index: 1000;
        }

        .toc-sidebar.visible {
            display: block;
        }

        .toc-item {
            padding: 4px 0;
            cursor: pointer;
            color: var(--vscode-foreground);
            font-size: 13px;
        }

        .toc-item:hover {
            color: var(--vscode-textLink-foreground);
        }

        .toc-item.active {
            color: var(--vscode-textLink-activeForeground);
            font-weight: bold;
        }

        .toc-item.level-1 { padding-left: 0; }
        .toc-item.level-2 { padding-left: 12px; font-size: 12px; }
        .toc-item.level-3 { padding-left: 24px; font-size: 11px; }
        .toc-item.level-4 { padding-left: 36px; font-size: 11px; }
        .toc-item.level-5 { padding-left: 48px; font-size: 10px; }
        .toc-item.level-6 { padding-left: 60px; font-size: 10px; }

        /* Search dialog */
        .search-dialog {
            position: fixed;
            top: 60px;
            right: 20px;
            background: var(--vscode-editorWidget-background);
            border: 1px solid var(--vscode-editorWidget-border);
            border-radius: 4px;
            padding: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            display: none;
            min-width: 300px;
        }

        .search-dialog.visible {
            display: block;
        }

        .search-dialog input {
            width: 100%;
            padding: 6px 8px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 2px;
            font-size: 13px;
            margin-bottom: 8px;
        }

        .search-dialog input:focus {
            outline: 1px solid var(--vscode-focusBorder);
        }

        .search-dialog-buttons {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
        }

        .search-dialog button {
            padding: 4px 12px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 2px;
            cursor: pointer;
            font-size: 12px;
        }

        .search-dialog button:hover {
            background: var(--vscode-button-hoverBackground);
        }

        .search-dialog .search-info {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
        }

        /* Search highlighting */
        .search-highlight {
            background-color: rgba(255, 255, 0, 0.3);
            border-radius: 2px;
        }

        .search-highlight-current {
            background-color: rgba(255, 165, 0, 0.5);
            border-radius: 2px;
            outline: 2px solid rgba(255, 165, 0, 0.8);
        }

        body.dark-theme .search-highlight {
            background-color: rgba(255, 255, 0, 0.25);
        }

        body.dark-theme .search-highlight-current {
            background-color: rgba(255, 165, 0, 0.4);
            outline-color: rgba(255, 165, 0, 0.7);
        }

        .status-bar {
            background: var(--vscode-statusBar-background);
            color: var(--vscode-statusBar-foreground);
            padding: 4px 12px;
            font-size: 12px;
            border-top: 1px solid var(--vscode-panel-border);
            display: flex;
            justify-content: space-between;
        }
    </style>
</head>
<body>
    <div class="toolbar">
        <!-- File Operations -->
        <div class="toolbar-group">
            <button class="toolbar-button" id="btn-save" title="Save (Ctrl+S)">
                <span>💾</span> Save
            </button>
            <button class="toolbar-button" id="btn-export-html" title="Export to HTML">
                <span>📄</span> Export HTML
            </button>
            <button class="toolbar-button" id="btn-export-pdf" title="Export to PDF">
                <span>📑</span> Export PDF
            </button>
        </div>

        <!-- Text Formatting -->
        <div class="toolbar-group">
            <button class="toolbar-button" id="btn-bold" title="Bold (Ctrl+B)">
                <span><b>B</b></span>
            </button>
            <button class="toolbar-button" id="btn-italic" title="Italic (Ctrl+I)">
                <span><i>I</i></span>
            </button>
            <button class="toolbar-button" id="btn-strikethrough" title="Strikethrough">
                <span><s>S</s></span>
            </button>
            <button class="toolbar-button" id="btn-code" title="Inline Code">
                <span>&lt;/&gt;</span>
            </button>
        </div>

        <!-- Headings -->
        <div class="toolbar-group">
            <button class="toolbar-button" id="btn-h1" title="Heading 1">H1</button>
            <button class="toolbar-button" id="btn-h2" title="Heading 2">H2</button>
            <button class="toolbar-button" id="btn-h3" title="Heading 3">H3</button>
            <button class="toolbar-button" id="btn-normal" title="Normal Text (Remove Formatting)">P</button>
        </div>

        <!-- Lists -->
        <div class="toolbar-group">
            <button class="toolbar-button" id="btn-ul" title="Bullet List">
                <span>•</span> List
            </button>
            <button class="toolbar-button" id="btn-ol" title="Numbered List">
                <span>1.</span> List
            </button>
            <button class="toolbar-button" id="btn-task" title="Task List">
                <span>☑</span> Task
            </button>
        </div>

        <!-- Insert -->
        <div class="toolbar-group">
            <button class="toolbar-button" id="btn-link" title="Insert Link (Ctrl+K)">
                <span>🔗</span> Link
            </button>
            <button class="toolbar-button" id="btn-image" title="Insert Image">
                <span>🖼️</span> Image
            </button>
            <button class="toolbar-button" id="btn-table" title="Insert Table">
                <span>📊</span> Table
            </button>
            <button class="toolbar-button" id="btn-code-block" title="Code Block">
                <span>{ }</span> Code
            </button>
        </div>

        <!-- View Controls -->
        <div class="toolbar-group">
            <button class="toolbar-button" id="btn-sync-scroll" title="Toggle Sync Scroll">
                <span>🔄</span> Sync
            </button>
            <button class="toolbar-button" id="btn-toc" title="Toggle Table of Contents">
                <span>📑</span> TOC
            </button>
            <button class="toolbar-button" id="btn-focus-mode" title="Toggle Focus Mode (F11)">
                <span>🎯</span> Focus
            </button>
        </div>

        <!-- Theme Toggle -->
        <div class="toolbar-group">
            <button class="toolbar-button" id="btn-theme-toggle" title="Toggle Theme: Light/Dark/System">
                <span id="theme-icon">🌓</span> <span id="theme-label">Auto</span>
            </button>
        </div>

        <!-- View -->
        <div class="toolbar-group view-selector">
            <select id="view-mode">
                <option value="split">Split View</option>
                <option value="editor">Editor Only</option>
                <option value="preview">Preview Only</option>
            </select>
        </div>
    </div>

    <!-- TOC Sidebar -->
    <div class="toc-sidebar" id="toc-sidebar">
        <h3 style="margin-top: 0; font-size: 14px; margin-bottom: 12px;">Table of Contents</h3>
        <div id="toc-content"></div>
    </div>

    <!-- Focus Mode Exit Hint -->
    <div class="focus-mode-hint" id="focus-mode-hint">
        Press F11 or Esc to exit focus mode
    </div>

    <!-- Search Dialog -->
    <div class="search-dialog" id="search-dialog">
        <div class="search-info" id="search-info">Find in document</div>
        <input type="text" id="search-input" placeholder="Search...">
        <input type="text" id="replace-input" placeholder="Replace with..." style="display: none;">
        <div class="search-dialog-buttons">
            <button id="toggle-replace" title="Toggle Replace">⇅</button>
            <button id="search-prev">Previous</button>
            <button id="search-next">Next</button>
            <button id="replace-btn" style="display: none;">Replace</button>
            <button id="replace-all-btn" style="display: none;">Replace All</button>
            <button id="search-close">Close</button>
        </div>
    </div>

    <div class="container" id="container">
        <div class="editor-pane" id="editor-pane">
            <div class="editor-wrapper">
                <div class="editor-document">
                    <textarea id="editor" placeholder="Start typing your markdown here...">${escapeHtml(initialContent)}</textarea>
                </div>
            </div>
        </div>
        <div class="resizer" id="resizer"></div>
        <div class="preview-pane" id="preview-pane">
            <div class="preview-wrapper">
                <div class="preview-document">
                    <div id="preview"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="status-bar">
        <div id="status-left">
            Lines: <span id="line-count">0</span> | 
            Words: <span id="word-count">0</span><span class="word-count-progress" id="word-count-progress"></span> | 
            Characters: <span id="char-count">0</span>
            <span id="reading-time" style="margin-left: 12px;"></span>
            <span class="autosave-indicator" id="autosave-indicator"></span>
        </div>
        <div id="status-right">Markdown Office Editor</div>
    </div>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        const editor = document.getElementById('editor');
        const preview = document.getElementById('preview');
        const viewMode = document.getElementById('view-mode');
        const editorPane = document.getElementById('editor-pane');
        const previewPane = document.getElementById('preview-pane');
        const editorWrapper = document.querySelector('.editor-wrapper');
        const previewWrapper = document.querySelector('.preview-wrapper');
        const tocSidebar = document.getElementById('toc-sidebar');
        const tocContent = document.getElementById('toc-content');
        const autosaveIndicator = document.getElementById('autosave-indicator');
        const resizer = document.getElementById('resizer');
        const container = document.getElementById('container');
        const searchDialog = document.getElementById('search-dialog');
        const searchInput = document.getElementById('search-input');
        const replaceInput = document.getElementById('replace-input');
        const searchInfo = document.getElementById('search-info');
        const toggleReplaceBtn = document.getElementById('toggle-replace');
        const replaceBtn = document.getElementById('replace-btn');
        const replaceAllBtn = document.getElementById('replace-all-btn');
        let isReplaceMode = false;

        let currentContent = ${JSON.stringify(initialContent)};
        let syncScrollEnabled = ${settings.syncScroll};
        let isScrollingFromSync = false;
        let focusModeEnabled = false;
        let wordCountGoal = ${settings.wordCountGoal};
        let showReadingTime = ${settings.showReadingTime};
        
        // Theme management
        let currentThemeMode = '${settings.documentTheme}'; // 'auto', 'light', 'dark'
        const themeIcon = document.getElementById('theme-icon');
        const themeLabel = document.getElementById('theme-label');
        
        function applyTheme(mode) {
            currentThemeMode = mode;
            
            if (mode === 'dark') {
                document.body.classList.add('dark-theme');
                themeIcon.textContent = '🌙';
                themeLabel.textContent = 'Dark';
            } else if (mode === 'light') {
                document.body.classList.remove('dark-theme');
                themeIcon.textContent = '☀️';
                themeLabel.textContent = 'Light';
            } else { // auto
                // Detect VS Code theme
                const isDark = document.body.getAttribute('data-vscode-theme-kind') === 'vscode-dark';
                if (isDark) {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.remove('dark-theme');
                }
                themeIcon.textContent = '🌓';
                themeLabel.textContent = 'Auto';
            }
            
            // Save preference
            vscode.postMessage({
                type: 'saveThemeMode',
                themeMode: mode
            });
        }
        
        // Apply initial theme
        applyTheme(currentThemeMode);
        
        // Set initial view mode
        viewMode.value = '${settings.defaultViewMode}';
        if (viewMode.value === 'editor') {
            previewPane.classList.add('hidden');
            editorPane.classList.remove('hidden');
            editorPane.style.borderRight = 'none';
            document.body.classList.add('single-pane-view');
        } else if (viewMode.value === 'preview') {
            editorPane.classList.add('hidden');
            previewPane.classList.remove('hidden');
            document.body.classList.add('single-pane-view');
        } else {
            // Split view - ensure both are visible
            editorPane.classList.remove('hidden');
            previewPane.classList.remove('hidden');
            document.body.classList.remove('single-pane-view');
        }
        
        // Update sync scroll button state
        const syncScrollBtn = document.getElementById('btn-sync-scroll');
        if (syncScrollEnabled) {
            syncScrollBtn.classList.add('sync-scroll-active');
        }

        // Simple markdown parser
        function parseMarkdown(text) {
            let html = text;

            // Escape HTML
            html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            // Code blocks
            html = html.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>');

            // Inline code
            html = html.replace(/\`([^\`]+)\`/g, '<code>$1</code>');

            // Tables - Parse markdown tables
            const lines = html.split('\\n');
            let processedLines = [];
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const trimmedLine = line.trim();
                
                // Check if this looks like a table row (starts and ends with |)
                if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|') && trimmedLine.length > 2) {
                    // Check if next line is a separator
                    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
                    const isSeparator = /^\\|\\s*:?-+:?\\s*(\\|\\s*:?-+:?\\s*)*\\|$/.test(nextLine);
                    
                    if (isSeparator) {
                        // This is a table header
                        const tableLines = [trimmedLine];
                        let j = i + 2; // Skip header and separator
                        
                        // Collect all table rows
                        while (j < lines.length) {
                            const rowLine = lines[j].trim();
                            if (rowLine.startsWith('|') && rowLine.endsWith('|') && rowLine.length > 2) {
                                tableLines.push(rowLine);
                                j++;
                            } else {
                                break;
                            }
                        }
                        
                        // Parse the table
                        const headerCells = tableLines[0].split('|').filter(c => c.trim()).map(c => c.trim());
                        const dataRows = tableLines.slice(1); // Skip header (separator already skipped)
                        
                        let tableHtml = '<div class="table-wrapper"><table><thead><tr>';
                        headerCells.forEach(cell => {
                            tableHtml += \`<th>\${cell}</th>\`;
                        });
                        tableHtml += '</tr></thead><tbody>';
                        
                        dataRows.forEach(row => {
                            const cells = row.split('|').filter(c => c.trim()).map(c => c.trim());
                            tableHtml += '<tr>';
                            cells.forEach(cell => {
                                tableHtml += \`<td>\${cell}</td>\`;
                            });
                            tableHtml += '</tr>';
                        });
                        
                        tableHtml += '</tbody></table></div>';
                        processedLines.push(tableHtml);
                        
                        // Skip the lines we processed (header + separator + data rows)
                        i = j - 1;
                    } else {
                        // Not a table, keep original line
                        processedLines.push(line);
                    }
                } else {
                    // Not a table row, keep original line
                    processedLines.push(line);
                }
            }

            html = processedLines.join('\\n');

            // Headers
            html = html.replace(/^######\\s+(.*)$/gm, '<h6>$1</h6>');
            html = html.replace(/^#####\\s+(.*)$/gm, '<h5>$1</h5>');
            html = html.replace(/^####\\s+(.*)$/gm, '<h4>$1</h4>');
            html = html.replace(/^###\\s+(.*)$/gm, '<h3>$1</h3>');
            html = html.replace(/^##\\s+(.*)$/gm, '<h2>$1</h2>');
            html = html.replace(/^#\\s+(.*)$/gm, '<h1>$1</h1>');

            // Bold
            html = html.replace(/\\*\\*([^\\*]+)\\*\\*/g, '<strong>$1</strong>');
            html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

            // Italic
            html = html.replace(/\\*([^\\*]+)\\*/g, '<em>$1</em>');
            html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

            // Strikethrough
            html = html.replace(/~~([^~]+)~~/g, '<s>$1</s>');

            // Links
            html = html.replace(/\\[([^\\]]+)\\]\\(([^\\)]+)\\)/g, '<a href="$2">$1</a>');

            // Images
            html = html.replace(/!\\[([^\\]]*)\\]\\(([^\\)]+)\\)/g, '<img src="$2" alt="$1">');

            // Process lists (unordered, ordered, and task lists) with nesting support
            const listLines = html.split('\\n');
            let processedListLines = [];
            let listStack = []; // Stack to track nested lists: {type: 'ul'|'ol'|'task', level: number}
            
            for (let i = 0; i < listLines.length; i++) {
                const line = listLines[i];
                const indent = line.match(/^(\\s*)/)[0].length;
                const level = Math.floor(indent / 2);
                
                // Check for task list (checklist)
                const taskMatch = line.match(/^(\\s*)[-*]\\s+\\[([ xX])\\]\\s+(.*)$/);
                if (taskMatch) {
                    const checked = taskMatch[2].toLowerCase() === 'x';
                    const text = taskMatch[3];
                    
                    // Handle nesting
                    while (listStack.length > 0 && listStack[listStack.length - 1].level >= level) {
                        const list = listStack.pop();
                        processedListLines.push(\`</\${list.type === 'task' ? 'ul' : list.type}>\`);
                    }
                    
                    if (listStack.length === 0 || listStack[listStack.length - 1].level < level) {
                        processedListLines.push('<ul class="task-list">');
                        listStack.push({type: 'task', level: level});
                    }
                    
                    // Add data attributes to track line number and indentation for editing
                    processedListLines.push(\`<li class="task-list-item" data-line="\${i}" data-indent="\${indent}"><input type="checkbox" \${checked ? 'checked' : ''}> \${text}</li>\`);
                    continue;
                }
                
                // Check for unordered list
                const ulMatch = line.match(/^(\\s*)[-*]\\s+(.*)$/);
                if (ulMatch) {
                    const text = ulMatch[2];
                    
                    // Handle nesting
                    while (listStack.length > 0 && listStack[listStack.length - 1].level >= level) {
                        const list = listStack.pop();
                        processedListLines.push(\`</\${list.type === 'task' ? 'ul' : list.type}>\`);
                    }
                    
                    if (listStack.length === 0 || listStack[listStack.length - 1].level < level) {
                        processedListLines.push('<ul>');
                        listStack.push({type: 'ul', level: level});
                    }
                    
                    processedListLines.push(\`<li>\${text}</li>\`);
                    continue;
                }
                
                // Check for ordered list
                const olMatch = line.match(/^(\\s*)\\d+\\.\\s+(.*)$/);
                if (olMatch) {
                    const text = olMatch[2];
                    
                    // Handle nesting
                    while (listStack.length > 0 && listStack[listStack.length - 1].level >= level) {
                        const list = listStack.pop();
                        processedListLines.push(\`</\${list.type === 'task' ? 'ul' : list.type}>\`);
                    }
                    
                    if (listStack.length === 0 || listStack[listStack.length - 1].level < level) {
                        processedListLines.push('<ol>');
                        listStack.push({type: 'ol', level: level});
                    }
                    
                    processedListLines.push(\`<li>\${text}</li>\`);
                    continue;
                }
                
                // Not a list item - close all open lists
                while (listStack.length > 0) {
                    const list = listStack.pop();
                    processedListLines.push(\`</\${list.type === 'task' ? 'ul' : list.type}>\`);
                }
                
                processedListLines.push(line);
            }
            
            // Close any remaining open lists
            while (listStack.length > 0) {
                const list = listStack.pop();
                processedListLines.push(\`</\${list.type === 'task' ? 'ul' : list.type}>\`);
            }
            
            html = processedListLines.join('\\n');

            // Blockquotes (with nesting support)
            const quoteLines = html.split('\\n');
            let processedQuoteLines = [];
            let quoteDepth = 0;
            
            for (let i = 0; i < quoteLines.length; i++) {
                const line = quoteLines[i];
                
                // Count the number of '>' at the start
                const quoteMatch = line.match(/^(&gt;\\s*)+/);
                
                if (quoteMatch) {
                    const newDepth = (quoteMatch[0].match(/&gt;/g) || []).length;
                    const content = line.replace(/^(&gt;\\s*)+/, '');
                    
                    // Open or close blockquotes as needed
                    while (quoteDepth < newDepth) {
                        processedQuoteLines.push('<blockquote>');
                        quoteDepth++;
                    }
                    while (quoteDepth > newDepth) {
                        processedQuoteLines.push('</blockquote>');
                        quoteDepth--;
                    }
                    
                    processedQuoteLines.push(content);
                } else {
                    // Not a blockquote line - close all open blockquotes
                    while (quoteDepth > 0) {
                        processedQuoteLines.push('</blockquote>');
                        quoteDepth--;
                    }
                    processedQuoteLines.push(line);
                }
            }
            
            // Close any remaining blockquotes
            while (quoteDepth > 0) {
                processedQuoteLines.push('</blockquote>');
                quoteDepth--;
            }
            
            html = processedQuoteLines.join('\\n');

            // Horizontal rules
            html = html.replace(/^---$/gm, '<hr>');
            html = html.replace(/^\\*\\*\\*$/gm, '<hr>');

            // Paragraphs
            html = html.split('\\n\\n').map(para => {
                if (!para.match(/^<[^>]+>/)) {
                    return '<p>' + para + '</p>';
                }
                return para;
            }).join('\\n');

            return html;
        }

        function htmlToMarkdown(html) {
            // Create a temporary element to parse HTML
            const temp = document.createElement('div');
            temp.innerHTML = html;
            
            // Convert HTML elements to markdown recursively
            function nodeToMarkdown(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    return node.textContent || '';
                }
                
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    return '';
                }
                
                // Skip table control elements
                if (node.classList && node.classList.contains('table-controls')) {
                    return '';
                }
                
                // For table-wrapper, just process the table inside
                if (node.classList && node.classList.contains('table-wrapper')) {
                    const table = node.querySelector('table');
                    return table ? nodeToMarkdown(table) : '';
                }
                
                const tag = node.tagName.toLowerCase();
                const children = Array.from(node.childNodes).map(nodeToMarkdown).join('');
                
                switch (tag) {
                    case 'h1': return '# ' + children + '\\n\\n';
                    case 'h2': return '## ' + children + '\\n\\n';
                    case 'h3': return '### ' + children + '\\n\\n';
                    case 'h4': return '#### ' + children + '\\n\\n';
                    case 'h5': return '##### ' + children + '\\n\\n';
                    case 'h6': return '###### ' + children + '\\n\\n';
                    case 'p': return children + '\\n\\n';
                    case 'br': return '\\n';
                    case 'strong': case 'b': return '**' + children + '**';
                    case 'em': case 'i': return '*' + children + '*';
                    case 'del': case 's': return '~~' + children + '~~';
                    case 'code': 
                        // Check if it's inside a pre (code block)
                        if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'pre') {
                            return children;
                        }
                        return '\`' + children + '\`';
                    case 'pre': 
                        return '\\n\`\`\`\\n' + children + '\\n\`\`\`\\n\\n';
                    case 'a': 
                        const href = node.getAttribute('href') || '';
                        return '[' + children + '](' + href + ')';
                    case 'img':
                        const src = node.getAttribute('src') || '';
                        const alt = node.getAttribute('alt') || '';
                        return '![' + alt + '](' + src + ')';
                    case 'ul':
                        return Array.from(node.children).map((li, idx) => {
                            const content = nodeToMarkdown(li).trim();
                            // Check for task list
                            if (li.classList && li.classList.contains('task-list-item')) {
                                const checkbox = li.querySelector('input[type="checkbox"]');
                                const checked = checkbox && checkbox.checked ? 'x' : ' ';
                                const text = Array.from(li.childNodes)
                                    .filter(n => n.nodeType === Node.TEXT_NODE || (n.nodeType === Node.ELEMENT_NODE && n.tagName.toLowerCase() !== 'input'))
                                    .map(nodeToMarkdown).join('');
                                return '- [' + checked + '] ' + text.trim();
                            }
                            return '- ' + content;
                        }).join('\\n') + '\\n\\n';
                    case 'ol':
                        return Array.from(node.children).map((li, idx) => {
                            const content = nodeToMarkdown(li).trim();
                            return (idx + 1) + '. ' + content;
                        }).join('\\n') + '\\n\\n';
                    case 'li':
                        return children;
                    case 'blockquote':
                        return children.split('\\n').map(line => line ? '> ' + line : '').join('\\n') + '\\n\\n';
                    case 'hr':
                        return '---\\n\\n';
                    case 'table':
                        const rows = Array.from(node.querySelectorAll('tr'));
                        if (rows.length === 0) return '';
                        
                        const headerRow = rows[0];
                        const headers = Array.from(headerRow.querySelectorAll('th, td')).map(cell => nodeToMarkdown(cell).trim());
                        const separator = headers.map(() => '---');
                        
                        let markdown = '| ' + headers.join(' | ') + ' |\\n';
                        markdown += '| ' + separator.join(' | ') + ' |\\n';
                        
                        for (let i = 1; i < rows.length; i++) {
                            const cells = Array.from(rows[i].querySelectorAll('td')).map(cell => nodeToMarkdown(cell).trim());
                            markdown += '| ' + cells.join(' | ') + ' |\\n';
                        }
                        return markdown + '\\n';
                    case 'div':
                        return children;
                    default:
                        return children;
                }
            }
            
            let markdown = nodeToMarkdown(temp);
            // Clean up extra newlines
            markdown = markdown.replace(/\\n{3,}/g, '\\n\\n').trim();
            return markdown;
        }

        function updatePreview() {
            const markdown = editor.value;
            preview.innerHTML = parseMarkdown(markdown);
            updateStatus();
            
            // Enhance existing tables with controls if in preview mode
            // Use requestAnimationFrame to ensure DOM is fully rendered
            if (viewMode.value === 'preview') {
                requestAnimationFrame(() => {
                    enhanceExistingTables();
                    // Double-check after a short delay to catch any race conditions
                    setTimeout(() => {
                        enhanceExistingTables();
                    }, 50);
                });
            }
        }
        
        function enhanceExistingTables() {
            // Only enhance tables in preview mode
            if (viewMode.value !== 'preview') {
                return;
            }
            
            // Find all tables that don't already have controls
            const tables = preview.querySelectorAll('table');
            tables.forEach(table => {
                // Check if this table already has controls by looking for a sibling control div
                const wrapper = table.parentElement;
                if (wrapper?.classList.contains('table-wrapper')) {
                    const existingControls = wrapper.querySelector('.table-controls');
                    if (existingControls) {
                        return; // Already enhanced
                    }
                }
                
                // Wrap table in a container if not already wrapped
                let tableWrapper;
                if (table.parentElement?.classList.contains('table-wrapper')) {
                    tableWrapper = table.parentElement;
                } else {
                    tableWrapper = document.createElement('div');
                    tableWrapper.className = 'table-wrapper';
                    if (table.parentNode) {
                        table.parentNode.insertBefore(tableWrapper, table);
                        tableWrapper.appendChild(table);
                    } else {
                        // Edge case: table has no parent yet
                        return;
                    }
                }
                
                // Create controls
                const controls = document.createElement('div');
                controls.className = 'table-controls';
                controls.style.cssText = 'display: none; margin: 5px 0; padding: 5px; background: #f0f0f0; border-radius: 3px;';
                
                // Add Row button
                const addRowBtn = document.createElement('button');
                addRowBtn.textContent = '+ Row';
                addRowBtn.style.cssText = 'margin: 2px; padding: 4px 8px; cursor: pointer; border: 1px solid #999; border-radius: 2px; background: white;';
                addRowBtn.onclick = function(e) {
                    e.stopPropagation();
                    saveUndoState(); // Save state before modification
                    const tbody = table.querySelector('tbody') || table;
                    const columnCount = table.querySelector('tr').children.length;
                    const newRow = document.createElement('tr');
                    for (let i = 0; i < columnCount; i++) {
                        const td = document.createElement('td');
                        td.textContent = 'New cell';
                        td.contentEditable = 'true';
                        newRow.appendChild(td);
                    }
                    tbody.appendChild(newRow);
                    setTimeout(() => syncPreviewToEditor(), 100);
                };
                
                // Remove Row button
                const removeRowBtn = document.createElement('button');
                removeRowBtn.textContent = '- Row';
                removeRowBtn.style.cssText = 'margin: 2px; padding: 4px 8px; cursor: pointer; border: 1px solid #999; border-radius: 2px; background: white;';
                removeRowBtn.onclick = function(e) {
                    e.stopPropagation();
                    const tbody = table.querySelector('tbody') || table;
                    const rows = tbody.querySelectorAll('tr');
                    if (rows.length > 1) {
                        saveUndoState(); // Save state before modification
                        tbody.removeChild(rows[rows.length - 1]);
                        setTimeout(() => syncPreviewToEditor(), 100);
                    }
                };
                
                // Add Column button
                const addColBtn = document.createElement('button');
                addColBtn.textContent = '+ Column';
                addColBtn.style.cssText = 'margin: 2px; padding: 4px 8px; cursor: pointer; border: 1px solid #999; border-radius: 2px; background: white;';
                addColBtn.onclick = function(e) {
                    e.stopPropagation();
                    saveUndoState(); // Save state before modification
                    const allRows = table.querySelectorAll('tr');
                    allRows.forEach((row, index) => {
                        const newCell = index === 0 && table.querySelector('thead') ? 
                            document.createElement('th') : document.createElement('td');
                        newCell.textContent = index === 0 ? 'Header' : 'Cell';
                        newCell.contentEditable = 'true';
                        row.appendChild(newCell);
                    });
                    setTimeout(() => syncPreviewToEditor(), 100);
                };
                
                // Remove Column button
                const removeColBtn = document.createElement('button');
                removeColBtn.textContent = '- Column';
                removeColBtn.style.cssText = 'margin: 2px; padding: 4px 8px; cursor: pointer; border: 1px solid #999; border-radius: 2px; background: white;';
                removeColBtn.onclick = function(e) {
                    e.stopPropagation();
                    const allRows = table.querySelectorAll('tr');
                    const columnCount = table.querySelector('tr').children.length;
                    if (columnCount > 1) {
                        saveUndoState(); // Save state before modification
                        allRows.forEach(row => {
                            if (row.lastChild) {
                                row.removeChild(row.lastChild);
                            }
                        });
                        setTimeout(() => syncPreviewToEditor(), 100);
                    }
                };
                
                controls.appendChild(addRowBtn);
                controls.appendChild(removeRowBtn);
                controls.appendChild(addColBtn);
                controls.appendChild(removeColBtn);
                
                // Add click handler to show controls
                table.addEventListener('click', function(e) {
                    e.stopPropagation();
                    // Hide all other table controls
                    document.querySelectorAll('.table-controls').forEach(ctrl => {
                        if (ctrl !== controls) {
                            ctrl.style.display = 'none';
                        }
                    });
                    // Show this table's controls
                    controls.style.display = 'block';
                });
                
                // Make all cells editable
                const cells = table.querySelectorAll('td, th');
                cells.forEach(cell => {
                    cell.contentEditable = 'true';
                });
                
                // Insert controls before the table
                tableWrapper.insertBefore(controls, table);
            });
        }

        function updateStatus() {
            const text = editor.value;
            const lines = text.split('\\n').length;
            const words = text.trim() ? text.trim().split(/\\s+/).length : 0;
            const chars = text.length;

            document.getElementById('line-count').textContent = lines;
            document.getElementById('word-count').textContent = words;
            document.getElementById('char-count').textContent = chars;
            
            // Update word count goal progress
            const progressElem = document.getElementById('word-count-progress');
            if (wordCountGoal > 0) {
                const percentage = Math.min(100, Math.round((words / wordCountGoal) * 100));
                progressElem.textContent = \` (\${percentage}% of \${wordCountGoal})\`;
                if (words >= wordCountGoal) {
                    progressElem.classList.add('goal-reached');
                } else {
                    progressElem.classList.remove('goal-reached');
                }
            } else {
                progressElem.textContent = '';
            }
            
            // Update reading time
            if (showReadingTime && words > 0) {
                const readingTimeMinutes = Math.ceil(words / 225); // 225 words per minute average
                const timeText = readingTimeMinutes === 1 ? '~1 min read' : \`~\${readingTimeMinutes} min read\`;
                document.getElementById('reading-time').textContent = timeText;
            } else {
                document.getElementById('reading-time').textContent = '';
            }
        }

        function insertAtCursor(before, after = '') {
            // Check if we're in preview-only mode (contenteditable preview)
            if (preview.contentEditable === 'true' && viewMode.value === 'preview') {
                insertIntoContentEditable(before, after);
            } else {
                // Normal textarea editing
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                const text = editor.value;
                const selectedText = text.substring(start, end);

                const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
                editor.value = newText;

                // Set cursor position
                const newCursorPos = start + before.length + selectedText.length + after.length;
                editor.selectionStart = newCursorPos;
                editor.selectionEnd = newCursorPos;
                editor.focus();

                updatePreview();
                notifyChange();
            }
        }

        function insertIntoContentEditable(before, after = '') {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) {
                preview.focus();
                return;
            }

            const range = selection.getRangeAt(0);
            const selectedText = range.toString() || 'text';

            // Delete current selection
            range.deleteContents();
            
            let elementToInsert;
            let newRange = document.createRange();
            
            // Convert markdown syntax to HTML elements
            if (before === '**' && after === '**') {
                // Bold
                elementToInsert = document.createElement('strong');
                elementToInsert.textContent = selectedText;
            } else if (before === '*' && after === '*') {
                // Italic
                elementToInsert = document.createElement('em');
                elementToInsert.textContent = selectedText;
            } else if (before === '~~' && after === '~~') {
                // Strikethrough
                elementToInsert = document.createElement('del');
                elementToInsert.textContent = selectedText;
            } else if (before === '\`' && after === '\`') {
                // Inline code
                elementToInsert = document.createElement('code');
                elementToInsert.textContent = selectedText;
            } else if (before === '# ') {
                // H1
                elementToInsert = document.createElement('h1');
                elementToInsert.textContent = selectedText || 'Heading 1';
            } else if (before === '## ') {
                // H2
                elementToInsert = document.createElement('h2');
                elementToInsert.textContent = selectedText || 'Heading 2';
            } else if (before === '### ') {
                // H3
                elementToInsert = document.createElement('h3');
                elementToInsert.textContent = selectedText || 'Heading 3';
            } else if (before === '\\n- ') {
                // Bullet list item
                const li = document.createElement('li');
                li.textContent = selectedText || 'List item';
                const ul = document.createElement('ul');
                ul.appendChild(li);
                elementToInsert = ul;
            } else if (before === '\\n1. ') {
                // Numbered list item
                const li = document.createElement('li');
                li.textContent = selectedText || 'List item';
                const ol = document.createElement('ol');
                ol.appendChild(li);
                elementToInsert = ol;
            } else if (before === '\\n- [ ] ') {
                // Task list item
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                const li = document.createElement('li');
                li.className = 'task-list-item';
                li.appendChild(checkbox);
                li.appendChild(document.createTextNode(' ' + (selectedText || 'Task item')));
                const ul = document.createElement('ul');
                ul.className = 'task-list';
                ul.appendChild(li);
                elementToInsert = ul;
            } else if (before.startsWith('[') && after.includes('](')) {
                // Link - extract URL and text
                const urlMatch = after.match(/\\]\\(([^)]+)\\)/);
                if (urlMatch) {
                    const url = urlMatch[1];
                    const linkText = before.substring(1);
                    elementToInsert = document.createElement('a');
                    elementToInsert.href = url;
                    elementToInsert.textContent = linkText || selectedText || 'Link';
                }
            } else if (before.startsWith('![') && after.includes('](')) {
                // Image - extract URL and alt text
                const urlMatch = after.match(/\\]\\(([^)]+)\\)/);
                if (urlMatch) {
                    const url = urlMatch[1];
                    const altText = before.substring(2);
                    elementToInsert = document.createElement('img');
                    elementToInsert.src = url;
                    elementToInsert.alt = altText || selectedText || 'Image';
                }
            } else if (before.startsWith('\\n\\\`\\\`\\\`')) {
                // Code block with language
                const lang = before.match(/\\\`\\\`\\\`(\\w+)/)?.[1] || '';
                const code = document.createElement('code');
                code.textContent = selectedText || 'code here';
                if (lang) {
                    code.className = 'language-' + lang;
                }
                const pre = document.createElement('pre');
                pre.appendChild(code);
                elementToInsert = pre;
            } else if (before.includes('| Header')) {
                // Table - parse the markdown table format
                const tableHTML = document.createElement('div');
                tableHTML.className = 'table-wrapper';
                const table = document.createElement('table');
                
                // Create header row
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                const th1 = document.createElement('th');
                th1.textContent = 'Header 1';
                th1.contentEditable = 'true';
                const th2 = document.createElement('th');
                th2.textContent = 'Header 2';
                th2.contentEditable = 'true';
                const th3 = document.createElement('th');
                th3.textContent = 'Header 3';
                th3.contentEditable = 'true';
                headerRow.appendChild(th1);
                headerRow.appendChild(th2);
                headerRow.appendChild(th3);
                thead.appendChild(headerRow);
                table.appendChild(thead);
                
                // Create body rows
                const tbody = document.createElement('tbody');
                for (let i = 0; i < 2; i++) {
                    const row = document.createElement('tr');
                    for (let j = 0; j < 3; j++) {
                        const td = document.createElement('td');
                        td.textContent = 'Cell ' + (i * 3 + j + 1);
                        td.contentEditable = 'true';
                        row.appendChild(td);
                    }
                    tbody.appendChild(row);
                }
                table.appendChild(tbody);
                
                // Add table controls (will be shown on click)
                const controls = document.createElement('div');
                controls.className = 'table-controls';
                controls.style.cssText = 'display: none; margin: 5px 0; padding: 5px; background: #f0f0f0; border-radius: 3px;';
                
                // Create buttons with proper event listeners
                const addRowBtn = document.createElement('button');
                addRowBtn.textContent = '+ Row';
                addRowBtn.style.cssText = 'margin: 2px; padding: 4px 8px; cursor: pointer; border: 1px solid #999; border-radius: 2px; background: white;';
                addRowBtn.onclick = function() {
                    saveUndoState(); // Save state before modification
                    const tbody = this.parentElement.nextElementSibling.querySelector('tbody');
                    const columnCount = this.parentElement.nextElementSibling.querySelector('tr').children.length;
                    const newRow = document.createElement('tr');
                    for (let i = 0; i < columnCount; i++) {
                        const td = document.createElement('td');
                        td.textContent = 'New cell';
                        td.contentEditable = 'true';
                        newRow.appendChild(td);
                    }
                    tbody.appendChild(newRow);
                    setTimeout(() => syncPreviewToEditor(), 100);
                };
                
                const removeRowBtn = document.createElement('button');
                removeRowBtn.textContent = '- Row';
                removeRowBtn.style.cssText = 'margin: 2px; padding: 4px 8px; cursor: pointer; border: 1px solid #999; border-radius: 2px; background: white;';
                removeRowBtn.onclick = function() {
                    const tbody = this.parentElement.nextElementSibling.querySelector('tbody');
                    if (tbody.children.length > 1) {
                        saveUndoState(); // Save state before modification
                        tbody.removeChild(tbody.lastChild);
                        setTimeout(() => syncPreviewToEditor(), 100);
                    }
                };
                
                const addColBtn = document.createElement('button');
                addColBtn.textContent = '+ Column';
                addColBtn.style.cssText = 'margin: 2px; padding: 4px 8px; cursor: pointer; border: 1px solid #999; border-radius: 2px; background: white;';
                addColBtn.onclick = function() {
                    saveUndoState(); // Save state before modification
                    const table = this.parentElement.nextElementSibling;
                    const headerRow = table.querySelector('thead tr');
                    const newTh = document.createElement('th');
                    newTh.textContent = 'Header';
                    newTh.contentEditable = 'true';
                    headerRow.appendChild(newTh);
                    
                    const bodyRows = table.querySelectorAll('tbody tr');
                    bodyRows.forEach(row => {
                        const newTd = document.createElement('td');
                        newTd.textContent = 'Cell';
                        newTd.contentEditable = 'true';
                        row.appendChild(newTd);
                    });
                    setTimeout(() => syncPreviewToEditor(), 100);
                };
                
                const removeColBtn = document.createElement('button');
                removeColBtn.textContent = '- Column';
                removeColBtn.style.cssText = 'margin: 2px; padding: 4px 8px; cursor: pointer; border: 1px solid #999; border-radius: 2px; background: white;';
                removeColBtn.onclick = function() {
                    const table = this.parentElement.nextElementSibling;
                    const headerRow = table.querySelector('thead tr');
                    if (headerRow.children.length > 1) {
                        saveUndoState(); // Save state before modification
                        headerRow.removeChild(headerRow.lastChild);
                        const bodyRows = table.querySelectorAll('tbody tr');
                        bodyRows.forEach(row => {
                            row.removeChild(row.lastChild);
                        });
                        setTimeout(() => syncPreviewToEditor(), 100);
                    }
                };
                
                controls.appendChild(addRowBtn);
                controls.appendChild(removeRowBtn);
                controls.appendChild(addColBtn);
                controls.appendChild(removeColBtn);
                
                // Add click handler to show/hide controls
                table.addEventListener('click', function() {
                    // Hide all other table controls
                    document.querySelectorAll('.table-controls').forEach(ctrl => {
                        if (ctrl !== controls) {
                            ctrl.style.display = 'none';
                        }
                    });
                    // Show this table's controls
                    controls.style.display = 'block';
                });
                
                tableHTML.appendChild(controls);
                tableHTML.appendChild(table);
                elementToInsert = tableHTML;
            } else {
                // Default: insert as text (for complex markdown)
                elementToInsert = document.createTextNode(before + selectedText + after);
            }

            // Insert the element
            range.insertNode(elementToInsert);

            // Move cursor after inserted element
            if (elementToInsert.nodeType === Node.ELEMENT_NODE) {
                newRange.setStartAfter(elementToInsert);
                newRange.setEndAfter(elementToInsert);
            } else {
                newRange.setStartAfter(elementToInsert);
                newRange.setEndAfter(elementToInsert);
            }
            
            selection.removeAllRanges();
            selection.addRange(newRange);

            // Sync back to markdown editor
            syncPreviewToEditor();
        }

        // Undo/Redo system for formatting and text editing
        let undoStack = [];
        let redoStack = [];
        const MAX_UNDO_STACK = 50;
        
        function saveUndoState() {
            // Save current state (preview HTML or editor text depending on mode)
            let currentState;
            if (preview.contentEditable === 'true' && viewMode.value === 'preview') {
                currentState = preview.innerHTML;
            } else {
                currentState = editor.value;
            }
            
            undoStack.push(currentState);
            if (undoStack.length > MAX_UNDO_STACK) {
                undoStack.shift();
            }
            // Clear redo stack when new action is performed
            redoStack = [];
        }

        function insertText(text) {
            insertAtCursor(text);
        }

        function wrapSelection(before, after) {
            // Check if we're in preview mode with contenteditable
            if (preview.contentEditable === 'true' && viewMode.value === 'preview') {
                saveUndoState(); // Save state for undo/redo
                toggleContentEditableFormatting(before, after);
            } else {
                // Textarea mode - check if we can unwrap
                saveUndoState(); // Save state for undo/redo
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                const text = editor.value;
                const selectedText = text.substring(start, end);
                
                // Check if the selection is already wrapped with this formatting
                const beforeLength = before.length;
                const afterLength = after.length;
                const textBefore = text.substring(start - beforeLength, start);
                const textAfter = text.substring(end, end + afterLength);
                
                if (textBefore === before && textAfter === after) {
                    // Remove the formatting (unwrap)
                    const newText = text.substring(0, start - beforeLength) + selectedText + text.substring(end + afterLength);
                    editor.value = newText;
                    editor.selectionStart = start - beforeLength;
                    editor.selectionEnd = end - beforeLength;
                } else {
                    // Add the formatting (wrap)
                    insertAtCursor(before, after);
                    return; // insertAtCursor handles focus and update
                }
                
                editor.focus();
                updatePreview();
                notifyChange();
            }
        }
        
        function toggleContentEditableFormatting(before, after) {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) {
                preview.focus();
                return;
            }

            const range = selection.getRangeAt(0);
            let node = range.commonAncestorContainer;
            
            // If text node, get parent element
            if (node.nodeType === Node.TEXT_NODE) {
                node = node.parentElement;
            }
            
            // Determine which tag we're working with
            let tagName = null;
            if (before === '**' && after === '**') tagName = 'STRONG';
            else if (before === '*' && after === '*') tagName = 'EM';
            else if (before === '~~' && after === '~~') tagName = 'DEL';
            else if (before === '\`' && after === '\`') tagName = 'CODE';
            
            // Check if cursor is inside the formatting tag
            let formattedNode = node;
            while (formattedNode && formattedNode !== preview) {
                if (formattedNode.tagName === tagName) {
                    // Remove formatting - unwrap the content
                    const textContent = formattedNode.textContent;
                    const textNode = document.createTextNode(textContent);
                    formattedNode.parentNode.replaceChild(textNode, formattedNode);
                    
                    // Restore selection
                    const newRange = document.createRange();
                    newRange.selectNodeContents(textNode);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                    
                    syncPreviewToEditor();
                    return;
                }
                formattedNode = formattedNode.parentElement;
            }
            
            // Not currently formatted - add formatting
            insertIntoContentEditable(before, after);
        }

        function syncPreviewToEditor() {
            // Convert preview HTML back to markdown
            const html = preview.innerHTML;
            const markdown = htmlToMarkdown(html);
            
            // Only update editor if content actually changed
            if (editor.value !== markdown) {
                // Set flag to prevent editor input handler from updating preview
                isSyncingFromPreview = true;
                
                editor.value = markdown;
                updateStatus();
                notifyChange();
                
                // Reset flag after a short delay
                setTimeout(() => {
                    isSyncingFromPreview = false;
                }, 10);
            }
            // DON'T call updatePreview() here - that would destroy the cursor position!
            // The preview already has the correct content since user is editing it directly
        }

        function notifyChange() {
            vscode.postMessage({
                type: 'edit',
                content: editor.value
            });
        }

        // Toolbar button handlers
        document.getElementById('btn-bold').addEventListener('click', () => wrapSelection('**', '**'));
        document.getElementById('btn-italic').addEventListener('click', () => wrapSelection('*', '*'));
        document.getElementById('btn-strikethrough').addEventListener('click', () => wrapSelection('~~', '~~'));
        document.getElementById('btn-code').addEventListener('click', () => wrapSelection('\`', '\`'));

        document.getElementById('btn-h1').addEventListener('click', () => insertText('# '));
        document.getElementById('btn-h2').addEventListener('click', () => insertText('## '));
        document.getElementById('btn-h3').addEventListener('click', () => insertText('### '));
        
        document.getElementById('btn-normal').addEventListener('click', () => {
            // Convert current block to normal paragraph
            if (preview.contentEditable === 'true' && viewMode.value === 'preview') {
                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) return;
                
                const range = selection.getRangeAt(0);
                let node = range.commonAncestorContainer;
                if (node.nodeType === Node.TEXT_NODE) {
                    node = node.parentElement;
                }
                
                // Find the closest block element
                while (node && node !== preview && 
                       !['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'STRONG', 'EM', 'DEL', 'CODE'].includes(node.tagName)) {
                    node = node.parentElement;
                }
                
                if (node && node !== preview) {
                    // Replace with paragraph
                    const p = document.createElement('p');
                    p.textContent = node.textContent;
                    node.parentNode.replaceChild(p, node);
                    
                    // Place cursor in new paragraph
                    const newRange = document.createRange();
                    newRange.selectNodeContents(p);
                    newRange.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                    
                    syncPreviewToEditor();
                }
            } else {
                // In editor mode, just ensure we're on a new line
                insertText('\\n');
            }
        });

        document.getElementById('btn-ul').addEventListener('click', () => insertText('\\n- '));
        document.getElementById('btn-ol').addEventListener('click', () => insertText('\\n1. '));
        document.getElementById('btn-task').addEventListener('click', () => insertText('\\n- [ ] '));

        document.getElementById('btn-link').addEventListener('click', () => {
            const url = prompt('Enter URL:');
            if (url) {
                const text = prompt('Enter link text:', 'Link');
                insertText(\`[\${text}](\${url})\`);
            }
        });

        document.getElementById('btn-image').addEventListener('click', () => {
            const url = prompt('Enter image URL:');
            if (url) {
                const alt = prompt('Enter alt text:', 'Image');
                insertText(\`![\${alt}](\${url})\`);
            }
        });

        document.getElementById('btn-table').addEventListener('click', () => {
            const table = '\\n| Header 1 | Header 2 | Header 3 |\\n|----------|----------|----------|\\n| Cell 1   | Cell 2   | Cell 3   |\\n| Cell 4   | Cell 5   | Cell 6   |\\n';
            insertText(table);
        });

        document.getElementById('btn-code-block').addEventListener('click', () => {
            const lang = prompt('Enter language (optional):', 'javascript');
            insertText(\`\\n\\\`\\\`\\\`\${lang}\\n\\n\\\`\\\`\\\`\\n\`);
        });

        document.getElementById('btn-save').addEventListener('click', () => {
            notifyChange();
        });

        // View mode switching
        viewMode.addEventListener('change', (e) => {
            const mode = e.target.value;
            
            // Reset flex styles when changing modes
            editorPane.style.flex = '';
            previewPane.style.flex = '';
            
            if (mode === 'editor') {
                previewPane.classList.add('hidden');
                editorPane.classList.remove('hidden');
                editorPane.style.borderRight = 'none';
                container.classList.add('editor-only');
                container.classList.remove('preview-only');
                // Disable preview editing
                preview.contentEditable = 'false';
                // Enable wider view for single pane
                document.body.classList.add('single-pane-view');
            } else if (mode === 'preview') {
                editorPane.classList.add('hidden');
                previewPane.classList.remove('hidden');
                container.classList.add('preview-only');
                container.classList.remove('editor-only');
                // Force preview update when switching to preview-only
                updatePreview();
                // Enable preview editing in preview-only mode
                preview.contentEditable = 'true';
                preview.focus();
                // Enhance existing tables with controls (multiple attempts to ensure reliability)
                // Note: updatePreview() also calls this, but we call it again
                // to ensure it runs after contentEditable is set
                requestAnimationFrame(() => {
                    enhanceExistingTables();
                    // Additional delayed check to catch any race conditions
                    setTimeout(() => {
                        enhanceExistingTables();
                    }, 100);
                    setTimeout(() => {
                        enhanceExistingTables();
                    }, 300);
                });
                // Enable wider view for single pane
                document.body.classList.add('single-pane-view');
            } else {
                editorPane.classList.remove('hidden');
                previewPane.classList.remove('hidden');
                editorPane.style.borderRight = '';
                container.classList.remove('editor-only');
                container.classList.remove('preview-only');
                // Update preview when switching to split view
                updatePreview();
                // Disable preview editing in split view
                preview.contentEditable = 'false';
                // Remove wider view for split pane
                document.body.classList.remove('single-pane-view');
            }
            // Save view mode preference
            vscode.postMessage({
                type: 'saveViewMode',
                viewMode: mode
            });
        });
        
        // Sync scroll functionality
        let scrollTimeout;
        editorWrapper.addEventListener('scroll', () => {
            if (!syncScrollEnabled || isScrollingFromSync) return;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercentage = editorWrapper.scrollTop / (editorWrapper.scrollHeight - editorWrapper.clientHeight);
                isScrollingFromSync = true;
                previewWrapper.scrollTop = scrollPercentage * (previewWrapper.scrollHeight - previewWrapper.clientHeight);
                setTimeout(() => { isScrollingFromSync = false; }, 100);
            }, 50);
        });
        
        previewWrapper.addEventListener('scroll', () => {
            if (!syncScrollEnabled || isScrollingFromSync) return;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercentage = previewWrapper.scrollTop / (previewWrapper.scrollHeight - previewWrapper.clientHeight);
                isScrollingFromSync = true;
                editorWrapper.scrollTop = scrollPercentage * (editorWrapper.scrollHeight - editorWrapper.clientHeight);
                setTimeout(() => { isScrollingFromSync = false; }, 100);
            }, 50);
        });
        
        // Sync scroll button
        syncScrollBtn.addEventListener('click', () => {
            syncScrollEnabled = !syncScrollEnabled;
            if (syncScrollEnabled) {
                syncScrollBtn.classList.add('sync-scroll-active');
            } else {
                syncScrollBtn.classList.remove('sync-scroll-active');
            }
        });
        
        // Focus mode button
        document.getElementById('btn-focus-mode').addEventListener('click', () => {
            focusModeEnabled = !focusModeEnabled;
            if (focusModeEnabled) {
                document.body.classList.add('focus-mode');
            } else {
                document.body.classList.remove('focus-mode');
            }
        });
        
        // Theme toggle button
        document.getElementById('btn-theme-toggle').addEventListener('click', () => {
            // Cycle through: auto → light → dark → auto
            if (currentThemeMode === 'auto') {
                applyTheme('light');
            } else if (currentThemeMode === 'light') {
                applyTheme('dark');
            } else {
                applyTheme('auto');
            }
        });
        
        // TOC functionality
        function updateTOC() {
            const markdown = editor.value;
            const headings = [];
            const lines = markdown.split('\\n');
            
            lines.forEach((line, index) => {
                const match = line.match(/^(#{1,6})\\s+(.+)$/);
                if (match) {
                    const level = match[1].length;
                    const text = match[2];
                    headings.push({ level, text, line: index });
                }
            });
            
            if (headings.length === 0) {
                tocContent.innerHTML = '<p style="color: #888; font-size: 12px;">No headings found</p>';
            } else {
                tocContent.innerHTML = headings.map(h => 
                    \`<div class="toc-item level-\${h.level}" data-line="\${h.line}">\${h.text}</div>\`
                ).join('');
                
                // Add click handlers
                tocContent.querySelectorAll('.toc-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const line = parseInt(item.getAttribute('data-line'));
                        const lineHeight = parseInt(getComputedStyle(editor).lineHeight);
                        const scrollTo = line * lineHeight;
                        editorWrapper.scrollTop = scrollTo;
                    });
                });
            }
        }
        
        document.getElementById('btn-toc').addEventListener('click', () => {
            tocSidebar.classList.toggle('visible');
            if (tocSidebar.classList.contains('visible')) {
                updateTOC();
            }
        });
        
        // Resizer functionality
        let isResizing = false;
        let startX = 0;
        let startWidthEditor = 0;
        let startWidthPreview = 0;
        
        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            const containerWidth = container.offsetWidth;
            startWidthEditor = editorPane.offsetWidth;
            startWidthPreview = previewPane.offsetWidth;
            resizer.classList.add('active');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const deltaX = e.clientX - startX;
            const containerWidth = container.offsetWidth - resizer.offsetWidth;
            const newWidthEditor = startWidthEditor + deltaX;
            const newWidthPreview = startWidthPreview - deltaX;
            
            // Min width check
            if (newWidthEditor >= 200 && newWidthPreview >= 200) {
                // Use flex-grow with ratios instead of fixed widths
                const editorRatio = newWidthEditor / containerWidth;
                const previewRatio = newWidthPreview / containerWidth;
                editorPane.style.flex = \`\${editorRatio} 1 0\`;
                previewPane.style.flex = \`\${previewRatio} 1 0\`;
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                resizer.classList.remove('active');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
        
        // Search functionality
        let searchMatches = [];
        let currentMatchIndex = -1;
        
        function openSearch() {
            searchDialog.classList.add('visible');
            searchInput.focus();
            searchInput.select();
        }
        
        function closeSearch() {
            searchDialog.classList.remove('visible');
            clearSearchHighlights();
            searchMatches = [];
            currentMatchIndex = -1;
            searchInfo.textContent = '';
        }
        
        function clearSearchHighlights() {
            // Clear highlights in preview
            const highlights = preview.querySelectorAll('.search-highlight, .search-highlight-current');
            highlights.forEach(highlight => {
                const parent = highlight.parentNode;
                const text = highlight.textContent;
                const textNode = document.createTextNode(text);
                parent.replaceChild(textNode, highlight);
                parent.normalize(); // Merge adjacent text nodes
            });
        }
        
        function highlightSearchInPreview(searchTerm) {
            if (!searchTerm) return;
            
            // Clear existing highlights
            clearSearchHighlights();
            
            // Get all text nodes in preview
            const walker = document.createTreeWalker(
                preview,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        // Skip script, style, and empty nodes
                        if (node.parentElement.tagName === 'SCRIPT' || 
                            node.parentElement.tagName === 'STYLE' ||
                            !node.textContent.trim()) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );
            
            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }
            
            // Highlight matches in each text node
            const searchLower = searchTerm.toLowerCase();
            let matchIndex = 0;
            
            textNodes.forEach(textNode => {
                const text = textNode.textContent;
                const textLower = text.toLowerCase();
                let lastIndex = 0;
                const fragments = [];
                
                let index = textLower.indexOf(searchLower);
                while (index !== -1) {
                    // Add text before match
                    if (index > lastIndex) {
                        fragments.push(document.createTextNode(text.substring(lastIndex, index)));
                    }
                    
                    // Add highlighted match
                    const span = document.createElement('span');
                    const isCurrent = matchIndex === currentMatchIndex;
                    span.className = isCurrent ? 'search-highlight-current' : 'search-highlight';
                    span.textContent = text.substring(index, index + searchTerm.length);
                    span.dataset.matchIndex = matchIndex;
                    fragments.push(span);
                    
                    matchIndex++;
                    lastIndex = index + searchTerm.length;
                    index = textLower.indexOf(searchLower, lastIndex);
                }
                
                // Add remaining text
                if (lastIndex < text.length) {
                    fragments.push(document.createTextNode(text.substring(lastIndex)));
                }
                
                // Replace the text node with fragments if we found matches
                if (fragments.length > 0) {
                    const parent = textNode.parentNode;
                    fragments.forEach(fragment => {
                        parent.insertBefore(fragment, textNode);
                    });
                    parent.removeChild(textNode);
                }
            });
        }
        
        function performSearch(direction = 'next') {
            const searchTerm = searchInput.value;
            if (!searchTerm) {
                clearSearchHighlights();
                searchInfo.textContent = '';
                return;
            }
            
            const text = editor.value.toLowerCase();
            const search = searchTerm.toLowerCase();
            searchMatches = [];
            
            let index = text.indexOf(search);
            while (index !== -1) {
                searchMatches.push(index);
                index = text.indexOf(search, index + 1);
            }
            
            if (searchMatches.length === 0) {
                searchInfo.textContent = 'No matches found';
                clearSearchHighlights();
                return;
            }
            
            if (direction === 'next') {
                currentMatchIndex = (currentMatchIndex + 1) % searchMatches.length;
            } else {
                currentMatchIndex = currentMatchIndex <= 0 ? searchMatches.length - 1 : currentMatchIndex - 1;
            }
            
            // Highlight in editor
            const matchPos = searchMatches[currentMatchIndex];
            editor.focus();
            editor.setSelectionRange(matchPos, matchPos + searchTerm.length);
            
            // Scroll editor to match
            const lines = editor.value.substring(0, matchPos).split('\\n').length;
            const lineHeight = parseInt(getComputedStyle(editor).lineHeight);
            editor.scrollTop = (lines - 5) * lineHeight;
            
            // Highlight in preview
            highlightSearchInPreview(searchTerm);
            
            // Scroll preview to current match
            const currentHighlight = preview.querySelector('.search-highlight-current');
            if (currentHighlight) {
                currentHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            searchInfo.textContent = \`Match \${currentMatchIndex + 1} of \${searchMatches.length}\`;
        }
        
        function replaceInEditor(searchTerm, replaceTerm, replaceAll) {
            if (!searchTerm) return;
            
            const currentText = editor.value;
            let newText;
            
            if (replaceAll) {
                // Replace all occurrences using case-insensitive split and join
                // This avoids regex escaping issues
                const parts = currentText.split(new RegExp(searchTerm, 'gi'));
                newText = parts.join(replaceTerm);
                
                // Clear search and update
                clearSearchHighlights();
                searchMatches = [];
                currentMatchIndex = -1;
                
                editor.value = newText;
                updatePreview();
                updateStatus();
                notifyChange();
                
                searchInfo.textContent = \`Replaced all occurrences\`;
            } else {
                // Replace only current match
                if (currentMatchIndex >= 0 && searchMatches.length > 0) {
                    const match = searchMatches[currentMatchIndex];
                    newText = currentText.substring(0, match.start) + 
                              replaceTerm + 
                              currentText.substring(match.end);
                    
                    editor.value = newText;
                    updatePreview();
                    updateStatus();
                    notifyChange();
                    
                    // Clear and re-search to update match positions
                    clearSearchHighlights();
                    searchMatches = [];
                    currentMatchIndex = -1;
                }
            }
        }
        
        function replaceInPreview(searchTerm, replaceTerm, replaceAll) {
            if (!searchTerm) return;
            
            if (replaceAll) {
                // Save undo state before replacing all
                saveUndoState();
                
                // Replace all highlighted spans
                const highlights = preview.querySelectorAll('.search-highlight, .search-highlight-current');
                highlights.forEach(highlight => {
                    const parent = highlight.parentNode;
                    const textNode = document.createTextNode(replaceTerm);
                    parent.replaceChild(textNode, highlight);
                    parent.normalize();
                });
                
                // Clear search state
                searchMatches = [];
                currentMatchIndex = -1;
                searchInfo.textContent = \`Replaced all occurrences\`;
                
                // Sync back to editor
                syncPreviewToEditor();
            } else {
                // Replace only current match
                if (currentMatchIndex >= 0 && searchMatches.length > 0) {
                    saveUndoState();
                    
                    const currentHighlight = preview.querySelector('.search-highlight-current');
                    if (currentHighlight) {
                        const parent = currentHighlight.parentNode;
                        const textNode = document.createTextNode(replaceTerm);
                        parent.replaceChild(textNode, currentHighlight);
                        parent.normalize();
                        
                        // Sync back to editor
                        syncPreviewToEditor();
                        
                        // Clear and refresh search
                        searchMatches = [];
                        currentMatchIndex = -1;
                    }
                }
            }
        }
        
        document.getElementById('search-next').addEventListener('click', () => performSearch('next'));
        document.getElementById('search-prev').addEventListener('click', () => performSearch('prev'));
        document.getElementById('search-close').addEventListener('click', closeSearch);
        
        // Toggle replace mode
        toggleReplaceBtn.addEventListener('click', () => {
            isReplaceMode = !isReplaceMode;
            if (isReplaceMode) {
                replaceInput.style.display = 'block';
                replaceBtn.style.display = 'inline-block';
                replaceAllBtn.style.display = 'inline-block';
                searchInfo.textContent = 'Find and replace';
                replaceInput.focus();
            } else {
                replaceInput.style.display = 'none';
                replaceBtn.style.display = 'none';
                replaceAllBtn.style.display = 'none';
                searchInfo.textContent = 'Find in document';
            }
        });
        
        // Replace current match
        replaceBtn.addEventListener('click', () => {
            if (currentMatchIndex >= 0 && searchMatches.length > 0) {
                const searchTerm = searchInput.value;
                const replaceTerm = replaceInput.value;
                
                if (viewMode.value === 'preview' && preview.contentEditable === 'true') {
                    // Replace in preview (contenteditable)
                    replaceInPreview(searchTerm, replaceTerm, false);
                } else {
                    // Replace in editor
                    replaceInEditor(searchTerm, replaceTerm, false);
                }
                
                // Move to next match after replacing
                setTimeout(() => performSearch('next'), 100);
            }
        });
        
        // Replace all matches
        replaceAllBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value;
            const replaceTerm = replaceInput.value;
            
            if (!searchTerm) return;
            
            if (confirm(\`Replace all \${searchMatches.length} occurrences of "\${searchTerm}" with "\${replaceTerm}"?\`)) {
                if (viewMode.value === 'preview' && preview.contentEditable === 'true') {
                    // Replace in preview
                    replaceInPreview(searchTerm, replaceTerm, true);
                } else {
                    // Replace in editor
                    replaceInEditor(searchTerm, replaceTerm, true);
                }
            }
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(e.shiftKey ? 'prev' : 'next');
            } else if (e.key === 'Escape') {
                closeSearch();
            }
        });
        
        replaceInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (e.ctrlKey || e.metaKey) {
                    // Ctrl+Enter = Replace All
                    replaceAllBtn.click();
                } else {
                    // Enter = Replace current and move to next
                    replaceBtn.click();
                }
            } else if (e.key === 'Escape') {
                closeSearch();
            }
        });
        
        searchInput.addEventListener('input', () => {
            currentMatchIndex = -1;
            searchMatches = [];
            clearSearchHighlights();
            
            // Auto-search as user types (with debouncing would be better, but this works)
            const searchTerm = searchInput.value;
            if (searchTerm && searchTerm.length >= 2) {
                // Perform search after a short delay
                setTimeout(() => {
                    if (searchInput.value === searchTerm) {
                        performSearch('next');
                    }
                }, 300);
            }
        });

        // Task list checkbox handler
        preview.addEventListener('change', (e) => {
            const target = e.target;
            if (target.type === 'checkbox' && target.closest('.task-list-item')) {
                const listItem = target.closest('.task-list-item');
                const checked = target.checked;
                
                // Get the current document text
                const lines = editor.value.split('\\n');
                
                // Find the matching task list line in the markdown
                // We need to search for the line that matches this checkbox
                const taskText = listItem.textContent.trim();
                
                // Search through lines to find the matching task
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    const taskMatch = line.match(/^(\\s*)[-*]\\s+\\[([ xX])\\]\\s+(.*)$/);
                    
                    if (taskMatch) {
                        const text = taskMatch[3].trim();
                        // Match the text content (strip HTML for comparison)
                        if (text === taskText || listItem.textContent.includes(text)) {
                            // Update the checkbox state in markdown
                            const indent = taskMatch[1];
                            const marker = taskMatch[0].match(/[-*]/)[0];
                            const newCheckState = checked ? 'x' : ' ';
                            lines[i] = \`\${indent}\${marker} [\${newCheckState}] \${taskMatch[3]}\`;
                            
                            // Update the editor content
                            editor.value = lines.join('\\n');
                            
                            // Notify VS Code of the change
                            notifyChange();
                            
                            // Update preview to reflect change
                            updatePreview();
                            break;
                        }
                    }
                }
            }
        });

        // Preview input handler for contenteditable mode
        preview.addEventListener('input', () => {
            // Only sync if preview is editable (preview-only mode)
            if (preview.contentEditable === 'true' && viewMode.value === 'preview') {
                // Debounce the sync to avoid performance issues and cursor jumping
                clearTimeout(previewSyncTimeout);
                previewSyncTimeout = setTimeout(() => {
                    syncPreviewToEditor();
                }, 1000); // Increased to 1 second for smoother editing
                
                // Debounced undo state saving (save every 2 seconds of inactivity)
                clearTimeout(undoSaveTimeout);
                undoSaveTimeout = setTimeout(() => {
                    const currentState = preview.innerHTML;
                    // Only save if state has changed
                    if (currentState !== lastSavedState) {
                        saveUndoState();
                        lastSavedState = currentState;
                    }
                }, 2000);
            }
        });

        let previewSyncTimeout;
        let isSyncingFromPreview = false; // Flag to prevent circular updates
        let undoSaveTimeout;
        let lastSavedState = '';
        
        function restoreUndoState() {
            if (undoStack.length > 0) {
                // Save current state to redo before undoing
                redoStack.push(preview.innerHTML);
                
                // Restore previous state
                const previousState = undoStack.pop();
                preview.innerHTML = previousState;
                
                // Re-enhance tables after DOM is ready
                requestAnimationFrame(() => {
                    enhanceExistingTables();
                });
                
                // Sync to markdown
                setTimeout(() => syncPreviewToEditor(), 100);
            }
        }
        
        function restoreRedoState() {
            if (redoStack.length > 0) {
                // Save current state to undo before redoing
                undoStack.push(preview.innerHTML);
                
                // Restore redo state
                const redoState = redoStack.pop();
                preview.innerHTML = redoState;
                
                // Re-enhance tables after DOM is ready
                requestAnimationFrame(() => {
                    enhanceExistingTables();
                });
                
                // Sync to markdown
                setTimeout(() => syncPreviewToEditor(), 100);
            }
        }

        // Editor change handler
        editor.addEventListener('input', () => {
            // Skip if this change came from preview sync
            if (isSyncingFromPreview) {
                return;
            }
            
            // Only update preview if we're NOT in preview-only mode
            // (In preview-only mode, user is editing preview directly)
            if (viewMode.value !== 'preview') {
                updatePreview();
                // Re-apply search highlights if search is active
                if (searchDialog.classList.contains('visible') && searchInput.value) {
                    highlightSearchInPreview(searchInput.value);
                }
            }
        });

        // Keyboard shortcuts for editor
        editor.addEventListener('keydown', (e) => {
            // Escape key exits focus mode
            if (e.key === 'Escape' && focusModeEnabled) {
                e.preventDefault();
                document.getElementById('btn-focus-mode').click();
                return;
            }
            
            if (e.ctrlKey || e.metaKey) {
                // Note: Ctrl+Z and Ctrl+Shift+Z work natively in textarea, so we don't override them
                if (e.key === 'f') {
                    e.preventDefault();
                    openSearch();
                } else if (e.key === 'b') {
                    e.preventDefault();
                    wrapSelection('**', '**');
                } else if (e.key === 'i') {
                    e.preventDefault();
                    wrapSelection('*', '*');
                } else if (e.key === 'k') {
                    e.preventDefault();
                    document.getElementById('btn-link').click();
                } else if (e.key === 's') {
                    e.preventDefault();
                    notifyChange();
                }
            }
        });

        // Keyboard shortcuts for preview (when contenteditable)
        preview.addEventListener('keydown', (e) => {
            // Only handle if preview is editable
            if (preview.contentEditable !== 'true') return;
            
            // Escape key exits focus mode
            if (e.key === 'Escape' && focusModeEnabled) {
                e.preventDefault();
                document.getElementById('btn-focus-mode').click();
                return;
            }
            
            // Handle Enter key - use browser's default but trigger sync after
            if (e.key === 'Enter') {
                // Let browser handle Enter naturally, then sync
                setTimeout(() => {
                    clearTimeout(previewSyncTimeout);
                    previewSyncTimeout = setTimeout(() => {
                        syncPreviewToEditor();
                    }, 1000); // Match the input debounce time
                }, 0);
                return; // Let default behavior happen
            }
            
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z' && !e.shiftKey) {
                    // Undo - use custom undo for table operations
                    e.preventDefault();
                    restoreUndoState();
                } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
                    // Redo - use custom redo for table operations
                    e.preventDefault();
                    restoreRedoState();
                } else if (e.key === 'f') {
                    e.preventDefault();
                    openSearch();
                } else if (e.key === 'h') {
                    e.preventDefault();
                    openSearch();
                    // Auto-enable replace mode
                    if (!isReplaceMode) {
                        toggleReplaceBtn.click();
                    }
                } else if (e.key === 'b') {
                    e.preventDefault();
                    wrapSelection('**', '**');
                } else if (e.key === 'i') {
                    e.preventDefault();
                    wrapSelection('*', '*');
                } else if (e.key === 'k') {
                    e.preventDefault();
                    document.getElementById('btn-link').click();
                } else if (e.key === 's') {
                    e.preventDefault();
                    notifyChange();
                }
            }
        });
        
        // Global keyboard handler for Escape in focus mode and Ctrl+F for search
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && focusModeEnabled) {
                e.preventDefault();
                document.getElementById('btn-focus-mode').click();
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                openSearch();
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
                e.preventDefault();
                openSearch();
                // Auto-enable replace mode
                if (!isReplaceMode) {
                    toggleReplaceBtn.click();
                }
            }
        });

        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'update':
                    if (editor.value !== message.text) {
                        // Set flag to prevent editor input handler from running
                        isSyncingFromPreview = true;
                        editor.value = message.text;
                        
                        // Only update preview if NOT in preview-only mode
                        // (In preview-only mode, we want to preserve the user's edits)
                        if (viewMode.value !== 'preview') {
                            updatePreview();
                        }
                        
                        // Reset flag
                        setTimeout(() => {
                            isSyncingFromPreview = false;
                        }, 10);
                    }
                    break;
                case 'toggleView':
                    // Cycle through view modes
                    const modes = ['split', 'editor', 'preview'];
                    const currentIndex = modes.indexOf(viewMode.value);
                    const nextIndex = (currentIndex + 1) % modes.length;
                    viewMode.value = modes[nextIndex];
                    viewMode.dispatchEvent(new Event('change'));
                    break;
                case 'toggleFocusMode':
                    document.getElementById('btn-focus-mode').click();
                    break;
                case 'restoreViewMode':
                    if (message.viewMode) {
                        viewMode.value = message.viewMode;
                        // Manually trigger the view mode change logic
                        const mode = message.viewMode;
                        if (mode === 'editor') {
                            previewPane.classList.add('hidden');
                            editorPane.classList.remove('hidden');
                            editorPane.style.borderRight = 'none';
                            preview.contentEditable = 'false';
                            document.body.classList.add('single-pane-view');
                        } else if (mode === 'preview') {
                            editorPane.classList.add('hidden');
                            previewPane.classList.remove('hidden');
                            updatePreview();
                            preview.contentEditable = 'true';
                            preview.focus();
                            document.body.classList.add('single-pane-view');
                        } else {
                            editorPane.classList.remove('hidden');
                            previewPane.classList.remove('hidden');
                            editorPane.style.borderRight = '';
                            updatePreview();
                            preview.contentEditable = 'false';
                            document.body.classList.remove('single-pane-view');
                        }
                        // Save view mode preference
                        vscode.postMessage({
                            type: 'saveViewMode',
                            viewMode: mode
                        });
                    }
                    break;
                case 'restoreThemeMode':
                    if (message.themeMode) {
                        applyTheme(message.themeMode);
                    }
                    break;
            }
        });

        // Auto-save with indicator
        let saveTimeout;
        editor.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            autosaveIndicator.textContent = 'Unsaved';
            autosaveIndicator.className = 'autosave-indicator';
            
            saveTimeout = setTimeout(() => {
                autosaveIndicator.textContent = 'Saving...';
                autosaveIndicator.classList.add('saving');
                notifyChange();
                
                setTimeout(() => {
                    autosaveIndicator.textContent = 'Saved';
                    autosaveIndicator.className = 'autosave-indicator saved';
                    setTimeout(() => {
                        autosaveIndicator.textContent = '';
                    }, 2000);
                }, 300);
            }, 1000);
        });

        // Initial render
        updatePreview();

        // Hide table controls when clicking outside
        preview.addEventListener('click', function(e) {
            // If click is not on a table or table controls, hide all controls
            if (!e.target.closest('table') && !e.target.closest('.table-controls')) {
                document.querySelectorAll('.table-controls').forEach(ctrl => {
                    ctrl.style.display = 'none';
                });
            }
        });

        function escapeHtml(text) {
            return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    </script>
</body>
</html>`;

    function escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}


