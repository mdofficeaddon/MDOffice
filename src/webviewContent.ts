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
    documentUri?: string;
    documentDir?: string;
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
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} data: https: http: file:;">
    <title>MDOffice - Markdown Office Editor</title>
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
            box-shadow: none;
        }

        #editor::placeholder {
            color: #999;
            font-style: italic;
        }

        #editor:focus {
            outline: none; /* Clean focus, no blue border */
            box-shadow: none;
            border: none;
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
            outline: none;
            box-shadow: none;
            border: none;
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
            margin-bottom: 12px;
        }

        #preview .task-list-item {
            padding: 6px 10px;
            margin-bottom: 4px;
            border-radius: 4px;
            transition: background-color 0.2s ease;
            position: relative;
        }

        #preview .task-list-item:hover {
            background-color: rgba(0, 0, 0, 0.03);
        }

        /* Container for checkbox and text (not nested lists) */
        #preview .task-list-item .task-content {
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        #preview .task-list-item input[type="checkbox"] {
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

        #preview .task-list-item input[type="checkbox"]:checked {
            background-color: #4CAF50;
            border-color: #4CAF50;
        }

        #preview .task-list-item input[type="checkbox"]:checked::after {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 14px;
            font-weight: bold;
        }
        
        #preview .task-list-item input[type="checkbox"]:hover {
            border-color: #666;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }

        #preview .task-list-item input[type="checkbox"]:checked:hover {
            border-color: #45a049;
            background-color: #45a049;
        }

        /* Completed task text styling */
        #preview .task-list-item:has(input[type="checkbox"]:checked) .task-text {
            color: #888;
            text-decoration: line-through;
        }

        /* Wrapper for task text */
        #preview .task-list-item .task-text {
            flex: 1;
            line-height: 1.5;
        }

        /* NESTED TASK LISTS - Clear visual hierarchy */
        /* Each nested level adds cumulative indentation */
        #preview .task-list-item > .task-list {
            margin: 8px 0 0 0;
            padding-left: 32px;
            position: relative;
        }

        /* Vertical connecting line for nested items */
        #preview .task-list-item > .task-list::before {
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
        #preview .task-list-item > .task-list > .task-list-item::before {
            content: '';
            position: absolute;
            left: -18px;
            top: 18px;
            width: 14px;
            height: 2px;
            background: #d0d0d0;
            border-radius: 1px;
        }

        /* Progressive background shading for depth perception */
        #preview .task-list .task-list-item {
            background-color: rgba(100, 100, 255, 0.02);
        }

        #preview .task-list .task-list .task-list-item {
            background-color: rgba(100, 100, 255, 0.04);
        }

        #preview .task-list .task-list .task-list .task-list-item {
            background-color: rgba(100, 100, 255, 0.06);
        }

        #preview .task-list .task-list .task-list .task-list .task-list-item {
            background-color: rgba(100, 100, 255, 0.08);
        }

        /* Progressive hover states */
        #preview .task-list .task-list-item:hover {
            background-color: rgba(100, 100, 255, 0.08);
        }

        #preview .task-list .task-list .task-list-item:hover {
            background-color: rgba(100, 100, 255, 0.10);
        }

        #preview .task-list .task-list .task-list .task-list-item:hover {
            background-color: rgba(100, 100, 255, 0.12);
        }

        #preview .task-list .task-list .task-list .task-list .task-list-item:hover {
            background-color: rgba(100, 100, 255, 0.14);
        }

        /* Visual aid: slightly smaller font for very deep nesting */
        #preview .task-list .task-list .task-list .task-list-item {
            font-size: 0.98em;
        }

        #preview .task-list .task-list .task-list .task-list .task-list-item {
            font-size: 0.96em;
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

        /* Markdown file links - special styling */
        #preview a.md-file-link {
            color: #067d17; /* Green for internal file links */
            text-decoration: underline;
            cursor: pointer;
        }

        #preview a.md-file-link:hover {
            color: #05a01f;
            background: rgba(6, 125, 23, 0.1);
            text-decoration: underline;
        }

        #preview a.md-file-link::before {
            content: "📄 ";
            opacity: 0.7;
        }

        /* Anchor links within document */
        #preview a.anchor-link {
            color: #7c3aed; /* Purple for anchor links */
            cursor: pointer;
        }

        #preview a.anchor-link:hover {
            color: #9333ea;
            background: rgba(124, 58, 237, 0.1);
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

        /* Dark theme link styles */
        body.dark-theme #preview a {
            color: #4fc3f7;
        }

        body.dark-theme #preview a:hover {
            color: #81d4fa;
        }

        body.dark-theme #preview a.md-file-link {
            color: #66bb6a;
        }

        body.dark-theme #preview a.md-file-link:hover {
            color: #81c784;
            background: rgba(102, 187, 106, 0.2);
        }

        body.dark-theme #preview a.anchor-link {
            color: #ba68c8;
        }

        body.dark-theme #preview a.anchor-link:hover {
            color: #ce93d8;
            background: rgba(186, 104, 200, 0.2);
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

        /* Dark theme - Task lists (checklists) */
        body.dark-theme #preview .task-list-item:hover {
            background-color: rgba(255, 255, 255, 0.05);
        }

        body.dark-theme #preview .task-list-item input[type="checkbox"] {
            background-color: #2d2d2d;
            border-color: #666;
        }

        body.dark-theme #preview .task-list-item input[type="checkbox"]:checked {
            background-color: #4CAF50;
            border-color: #4CAF50;
        }

        body.dark-theme #preview .task-list-item input[type="checkbox"]:hover {
            border-color: #999;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }

        body.dark-theme #preview .task-list-item:has(input[type="checkbox"]:checked) .task-text {
            color: #888;
        }

        /* Dark theme - nested task lists with proportional indentation */
        body.dark-theme #preview li > .task-list {
            padding-left: 32px;
        }

        body.dark-theme #preview .task-list .task-list li > .task-list {
            padding-left: 32px;
        }

        body.dark-theme #preview .task-list .task-list .task-list li > .task-list {
            padding-left: 32px;
        }

        body.dark-theme #preview li > .task-list::before {
            background: linear-gradient(to bottom, #404040 0%, #404040 100%);
            left: 12px;
            bottom: 6px;
        }

        body.dark-theme #preview .task-list .task-list .task-list-item {
            background-color: rgba(255, 255, 255, 0.02);
        }

        body.dark-theme #preview .task-list .task-list .task-list .task-list-item {
            background-color: rgba(255, 255, 255, 0.03);
        }

        body.dark-theme #preview .task-list .task-list .task-list-item:hover {
            background-color: rgba(255, 255, 255, 0.07);
        }

        body.dark-theme #preview .task-list .task-list .task-list .task-list-item:hover {
            background-color: rgba(255, 255, 255, 0.08);
        }

        body.dark-theme #preview .task-list .task-list .task-list .task-list-item {
            font-size: 0.98em;
        }

        body.dark-theme #preview .task-list .task-list .task-list .task-list .task-list-item {
            font-size: 0.96em;
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
                <option value="editor">Editor View</option>
                <option value="preview">Office View</option>
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
        <div id="status-right">MDOffice - Markdown Office Editor</div>
    </div>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        
        // Document configuration for image path resolution
        const documentDir = ${settings.documentDir ? `'${settings.documentDir}'` : 'null'};
        
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

            // Headers with automatic ID generation for anchor links
            // Function to generate slug from heading text
            const generateSlug = (text) => {
                return text.toLowerCase()
                    .replace(/<[^>]*>/g, '') // Remove HTML tags
                    .replace(/[^a-z0-9\\s-]/g, '') // Remove special chars
                    .replace(/\\s+/g, '-') // Replace spaces with hyphens
                    .replace(/-+/g, '-') // Replace multiple hyphens with single
                    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
            };
            
            html = html.replace(/^######\\s+(.*)$/gm, (match, text) => \`<h6 id="\${generateSlug(text)}">\${text}</h6>\`);
            html = html.replace(/^#####\\s+(.*)$/gm, (match, text) => \`<h5 id="\${generateSlug(text)}">\${text}</h5>\`);
            html = html.replace(/^####\\s+(.*)$/gm, (match, text) => \`<h4 id="\${generateSlug(text)}">\${text}</h4>\`);
            html = html.replace(/^###\\s+(.*)$/gm, (match, text) => \`<h3 id="\${generateSlug(text)}">\${text}</h3>\`);
            html = html.replace(/^##\\s+(.*)$/gm, (match, text) => \`<h2 id="\${generateSlug(text)}">\${text}</h2>\`);
            html = html.replace(/^#\\s+(.*)$/gm, (match, text) => \`<h1 id="\${generateSlug(text)}">\${text}</h1>\`);

            // Images - with relative path resolution (MUST be BEFORE links!)
            html = html.replace(/!\\[([^\\]]*)\\]\\(([^\\)]+)\\)/g, (match, alt, src) => {
                let resolvedSrc = src;
                
                // Check if it's a relative path (not http://, https://, data:, or file://)
                if (documentDir && 
                    !src.startsWith('http://') && 
                    !src.startsWith('https://') && 
                    !src.startsWith('data:') && 
                    !src.startsWith('file://') &&
                    !src.startsWith('vscode-resource:') &&
                    !src.startsWith('vscode-webview-resource:')) {
                    
                    // Convert relative path to webview URI
                    // Remove leading ./ if present
                    let cleanSrc = src.startsWith('./') ? src.substring(2) : src;
                    
                    // Decode URL-encoded characters (like %20 for spaces)
                    try {
                        cleanSrc = decodeURIComponent(cleanSrc);
                    } catch (e) {
                        // If decoding fails, use original
                    }
                    
                    // Build the full path
                    // Note: documentDir already ends without trailing slash
                    resolvedSrc = documentDir + '/' + cleanSrc;
                    
                    console.log('[MDOffice] Image path resolution:', {
                        original: src,
                        cleaned: cleanSrc,
                        documentDir: documentDir,
                        resolved: resolvedSrc
                    });
                }
                
                return \`<img src="\${resolvedSrc}" alt="\${alt}" onerror="console.error('Failed to load image:', '\${resolvedSrc}'); this.style.border='2px solid red';">\`;
            });

            // Links (MUST be AFTER images and BEFORE bold/italic to preserve underscores in URLs!) - Enhanced with file link support
            html = html.replace(/\\[([^\\]]+)\\]\\(([^\\)]+)\\)/g, (match, text, href) => {
                // Check if it's a relative file link (markdown or other text files)
                const isRelativeFile = !href.startsWith('http://') && 
                                      !href.startsWith('https://') && 
                                      !href.startsWith('mailto:') && 
                                      !href.startsWith('#') &&
                                      !href.startsWith('data:');
                
                // Check if it's a markdown file link
                const isMarkdownLink = isRelativeFile && (
                    href.endsWith('.md') || 
                    href.includes('.md#') ||
                    href.endsWith('.markdown') ||
                    href.includes('.markdown#')
                );
                
                if (isMarkdownLink) {
                    // Handle markdown file links with optional anchor
                    const [filePath, anchor] = href.split('#');
                    const encodedPath = encodeURIComponent(filePath);
                    const encodedAnchor = anchor ? encodeURIComponent(anchor) : '';
                    
                    return \`<a href="#" class="md-file-link" data-file-path="\${filePath}" data-anchor="\${anchor || ''}" title="Open \${filePath}\${anchor ? ' and jump to #' + anchor : ''}">\${text}</a>\`;
                } else if (isRelativeFile && href.startsWith('#')) {
                    // Anchor link within current document
                    return \`<a href="\${href}" class="anchor-link">\${text}</a>\`;
                } else {
                    // External link or other protocols
                    const target = (href.startsWith('http://') || href.startsWith('https://')) ? ' target="_blank" rel="noopener noreferrer"' : '';
                    return \`<a href="\${href}"\${target}>\${text}</a>\`;
                }
            });

            // Bold (MUST be AFTER links to avoid interfering with link URLs)
            // Use negative lookahead to avoid matching inside HTML tags/attributes
            html = html.replace(/\\*\\*([^\\*]+)\\*\\*/g, '<strong>$1</strong>');
            html = html.replace(/__([^_<]+)__/g, '<strong>$1</strong>');

            // Italic (MUST be AFTER links to avoid interfering with underscores in link URLs)
            // CRITICAL: Must not match underscores inside HTML tags or attributes!
            // Strategy: Split by HTML tags, process only the text parts, then rejoin
            html = html.replace(/\\*([^\\*]+)\\*/g, '<em>$1</em>');
            
            // For underscore-based italic, we need to be very careful
            // Split HTML into segments: text vs tags
            const segments = html.split(/(<[^>]+>)/g);
            html = segments.map((segment, index) => {
                // Only process text segments (odd indices), not HTML tags (even indices)
                if (segment.startsWith('<')) {
                    // This is an HTML tag, don't process it
                    return segment;
                } else {
                    // This is text content, apply italic formatting
                    return segment.replace(/_([^_]+)_/g, '<em>$1</em>');
                }
            }).join('');

            // Strikethrough
            html = html.replace(/~~([^~]+)~~/g, '<s>$1</s>');

            // Process lists (unordered, ordered, and task lists) with proper nesting support
            const listLines = html.split('\\n');
            let processedListLines = [];
            let listStack = []; // Stack to track nested lists: {type: 'ul'|'ol'|'task', level: number, hasContent: boolean}
            let lastItemIndices = []; // Track last <li> index for each level
            
            for (let i = 0; i < listLines.length; i++) {
                const line = listLines[i];
                const indent = line.match(/^(\\s*)/)[0].length;
                const level = Math.floor(indent / 2);
                
                // Check for task list (checklist)
                const taskMatch = line.match(/^(\\s*)[-*]\\s+\\[([ xX])\\]\\s+(.*)$/);
                if (taskMatch) {
                    const checked = taskMatch[2].toLowerCase() === 'x';
                    const text = taskMatch[3];
                    
                    // Close lists deeper than current level
                    while (listStack.length > 0 && listStack[listStack.length - 1].level >= level) {
                        const closingList = listStack.pop();
                        lastItemIndices.pop();
                        processedListLines.push(\`</\${closingList.type === 'task' ? 'ul' : closingList.type}>\`);
                        // If there was a parent list item, close it
                        if (listStack.length > 0 && closingList.hasContent) {
                            processedListLines.push('</li>');
                        }
                    }
                    
                    // Open new list if needed (going deeper)
                    if (listStack.length === 0 || listStack[listStack.length - 1].level < level) {
                        // If we have a parent, we need to nest inside the last <li>
                        if (lastItemIndices.length > 0) {
                            // Remove the closing </li> from the parent item
                            const lastIdx = lastItemIndices[lastItemIndices.length - 1];
                            if (processedListLines[lastIdx] && processedListLines[lastIdx].endsWith('</li>')) {
                                processedListLines[lastIdx] = processedListLines[lastIdx].replace(/<\\/li>$/, '');
                                listStack[listStack.length - 1].hasContent = true;
                            }
                        }
                        processedListLines.push('<ul class="task-list">');
                        listStack.push({type: 'task', level: level, hasContent: false});
                    }
                    
                    // Add list item - wrap checkbox and text in a div for better layout control
                    lastItemIndices[listStack.length - 1] = processedListLines.length;
                    processedListLines.push(\`<li class="task-list-item" data-line="\${i}" data-indent="\${indent}"><div class="task-content"><input type="checkbox" \${checked ? 'checked' : ''}><span class="task-text">\${text}</span></div></li>\`);
                    continue;
                }
                
                // Check for unordered list
                const ulMatch = line.match(/^(\\s*)[-*]\\s+(.*)$/);
                if (ulMatch) {
                    const text = ulMatch[2];
                    
                    // Close lists deeper than current level
                    while (listStack.length > 0 && listStack[listStack.length - 1].level >= level) {
                        const closingList = listStack.pop();
                        lastItemIndices.pop();
                        processedListLines.push(\`</\${closingList.type === 'task' ? 'ul' : closingList.type}>\`);
                        // If there was a parent list item, close it
                        if (listStack.length > 0 && closingList.hasContent) {
                            processedListLines.push('</li>');
                        }
                    }
                    
                    // Open new list if needed (going deeper)
                    if (listStack.length === 0 || listStack[listStack.length - 1].level < level) {
                        // If we have a parent, we need to nest inside the last <li>
                        if (lastItemIndices.length > 0) {
                            // Remove the closing </li> from the parent item
                            const lastIdx = lastItemIndices[lastItemIndices.length - 1];
                            if (processedListLines[lastIdx] && processedListLines[lastIdx].endsWith('</li>')) {
                                processedListLines[lastIdx] = processedListLines[lastIdx].replace(/<\\/li>$/, '');
                                listStack[listStack.length - 1].hasContent = true;
                            }
                        }
                        processedListLines.push('<ul>');
                        listStack.push({type: 'ul', level: level, hasContent: false});
                    }
                    
                    // Add list item
                    lastItemIndices[listStack.length - 1] = processedListLines.length;
                    processedListLines.push(\`<li>\${text}</li>\`);
                    continue;
                }
                
                // Check for ordered list
                const olMatch = line.match(/^(\\s*)\\d+\\.\\s+(.*)$/);
                if (olMatch) {
                    const text = olMatch[2];
                    
                    // Close lists deeper than current level
                    while (listStack.length > 0 && listStack[listStack.length - 1].level >= level) {
                        const closingList = listStack.pop();
                        lastItemIndices.pop();
                        processedListLines.push(\`</\${closingList.type === 'task' ? 'ul' : closingList.type}>\`);
                        // If there was a parent list item, close it
                        if (listStack.length > 0 && closingList.hasContent) {
                            processedListLines.push('</li>');
                        }
                    }
                    
                    // Open new list if needed (going deeper)
                    if (listStack.length === 0 || listStack[listStack.length - 1].level < level) {
                        // If we have a parent, we need to nest inside the last <li>
                        if (lastItemIndices.length > 0) {
                            // Remove the closing </li> from the parent item
                            const lastIdx = lastItemIndices[lastItemIndices.length - 1];
                            if (processedListLines[lastIdx] && processedListLines[lastIdx].endsWith('</li>')) {
                                processedListLines[lastIdx] = processedListLines[lastIdx].replace(/<\\/li>$/, '');
                                listStack[listStack.length - 1].hasContent = true;
                            }
                        }
                        processedListLines.push('<ol>');
                        listStack.push({type: 'ol', level: level, hasContent: false});
                    }
                    
                    // Add list item
                    lastItemIndices[listStack.length - 1] = processedListLines.length;
                    processedListLines.push(\`<li>\${text}</li>\`);
                    continue;
                }
                
                // Not a list item - close all open lists
                while (listStack.length > 0) {
                    const closingList = listStack.pop();
                    lastItemIndices.pop();
                    processedListLines.push(\`</\${closingList.type === 'task' ? 'ul' : closingList.type}>\`);
                    // If there was a parent list item, close it
                    if (listStack.length > 0 && closingList.hasContent) {
                        processedListLines.push('</li>');
                    }
                }
                
                processedListLines.push(line);
            }
            
            // Close any remaining open lists
            while (listStack.length > 0) {
                const closingList = listStack.pop();
                lastItemIndices.pop();
                processedListLines.push(\`</\${closingList.type === 'task' ? 'ul' : closingList.type}>\`);
                // If there was a parent list item, close it
                if (listStack.length > 0 && closingList.hasContent) {
                    processedListLines.push('</li>');
                }
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
            function nodeToMarkdown(node, indentLevel = 0) {
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
                    return table ? nodeToMarkdown(table, indentLevel) : '';
                }
                
                const tag = node.tagName.toLowerCase();
                const indent = '  '.repeat(indentLevel); // 2 spaces per level
                
                switch (tag) {
                    case 'h1': 
                        const h1Children = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return '# ' + h1Children + '\\n\\n';
                    case 'h2': 
                        const h2Children = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return '## ' + h2Children + '\\n\\n';
                    case 'h3': 
                        const h3Children = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return '### ' + h3Children + '\\n\\n';
                    case 'h4': 
                        const h4Children = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return '#### ' + h4Children + '\\n\\n';
                    case 'h5': 
                        const h5Children = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return '##### ' + h5Children + '\\n\\n';
                    case 'h6': 
                        const h6Children = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return '###### ' + h6Children + '\\n\\n';
                    case 'p': 
                        const pChildren = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return pChildren + '\\n\\n';
                    case 'br': return '\\n';
                    case 'strong': case 'b': 
                        const strongChildren = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return '**' + strongChildren + '**';
                    case 'em': case 'i': 
                        const emChildren = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return '*' + emChildren + '*';
                    case 'del': case 's': 
                        const delChildren = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return '~~' + delChildren + '~~';
                    case 'code': 
                        // Check if it's inside a pre (code block)
                        if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'pre') {
                            return Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        }
                        const codeChildren = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return '\`' + codeChildren + '\`';
                    case 'pre': 
                        const preChildren = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return '\\n\`\`\`\\n' + preChildren + '\\n\`\`\`\\n\\n';
                    case 'a': 
                        const href = node.getAttribute('href') || '';
                        const aChildren = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return '[' + aChildren + '](' + href + ')';
                    case 'img':
                        const src = node.getAttribute('src') || '';
                        const alt = node.getAttribute('alt') || '';
                        return '![' + alt + '](' + src + ')';
                    case 'ul':
                        const isTaskList = node.classList && node.classList.contains('task-list');
                        return Array.from(node.children).map((li, idx) => {
                            // Process list item content, but handle nested lists specially
                            let liContent = '';
                            let nestedList = '';
                            
                            // Separate direct content from nested lists
                            Array.from(li.childNodes).forEach(child => {
                                if (child.nodeType === Node.ELEMENT_NODE && 
                                    (child.tagName.toLowerCase() === 'ul' || child.tagName.toLowerCase() === 'ol')) {
                                    // This is a nested list - process it with increased indent
                                    nestedList += nodeToMarkdown(child, indentLevel + 1);
                                } else {
                                    liContent += nodeToMarkdown(child, indentLevel);
                                }
                            });
                            
                            liContent = liContent.trim();
                            
                            // Check for task list
                            if (li.classList && li.classList.contains('task-list-item')) {
                                const checkbox = li.querySelector('input[type="checkbox"]');
                                const checked = checkbox && checkbox.checked ? 'x' : ' ';
                                const text = Array.from(li.childNodes)
                                    .filter(n => n.nodeType === Node.TEXT_NODE || 
                                            (n.nodeType === Node.ELEMENT_NODE && 
                                             n.tagName.toLowerCase() !== 'input' &&
                                             n.tagName.toLowerCase() !== 'ul' &&
                                             n.tagName.toLowerCase() !== 'ol'))
                                    .map(n => nodeToMarkdown(n, indentLevel)).join('').trim();
                                const result = indent + '- [' + checked + '] ' + text;
                                return nestedList ? result + '\\n' + nestedList.trimEnd() : result;
                            }
                            const result = indent + '- ' + liContent;
                            return nestedList ? result + '\\n' + nestedList.trimEnd() : result;
                        }).join('\\n') + '\\n\\n';
                    case 'ol':
                        return Array.from(node.children).map((li, idx) => {
                            // Process list item content, but handle nested lists specially
                            let liContent = '';
                            let nestedList = '';
                            
                            // Separate direct content from nested lists
                            Array.from(li.childNodes).forEach(child => {
                                if (child.nodeType === Node.ELEMENT_NODE && 
                                    (child.tagName.toLowerCase() === 'ul' || child.tagName.toLowerCase() === 'ol')) {
                                    // This is a nested list - process it with increased indent
                                    nestedList += nodeToMarkdown(child, indentLevel + 1);
                                } else {
                                    liContent += nodeToMarkdown(child, indentLevel);
                                }
                            });
                            
                            liContent = liContent.trim();
                            const result = indent + (idx + 1) + '. ' + liContent;
                            return nestedList ? result + '\\n' + nestedList.trimEnd() : result;
                        }).join('\\n') + '\\n\\n';
                    case 'li':
                        // Li content is handled by ul/ol
                        return Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                    case 'blockquote':
                        const bqChildren = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return bqChildren.split('\\n').map(line => line ? '> ' + line : '').join('\\n') + '\\n\\n';
                    case 'hr':
                        return '---\\n\\n';
                    case 'table':
                        const rows = Array.from(node.querySelectorAll('tr'));
                        if (rows.length === 0) return '';
                        
                        const headerRow = rows[0];
                        const headers = Array.from(headerRow.querySelectorAll('th, td')).map(cell => nodeToMarkdown(cell, indentLevel).trim());
                        const separator = headers.map(() => '---');
                        
                        let markdown = '| ' + headers.join(' | ') + ' |\\n';
                        markdown += '| ' + separator.join(' | ') + ' |\\n';
                        
                        for (let i = 1; i < rows.length; i++) {
                            const cells = Array.from(rows[i].querySelectorAll('td')).map(cell => nodeToMarkdown(cell, indentLevel).trim());
                            markdown += '| ' + cells.join(' | ') + ' |\\n';
                        }
                        return markdown + '\\n';
                    case 'div':
                        const divChildren = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return divChildren;
                    default:
                        const defaultChildren = Array.from(node.childNodes).map(n => nodeToMarkdown(n, indentLevel)).join('');
                        return defaultChildren;
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
            // Check if preview is contenteditable and has focus
            if (preview.contentEditable === 'true' && document.activeElement === preview) {
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
            // Save current state (preview HTML or editor text depending on focus)
            let currentState;
            if (preview.contentEditable === 'true' && document.activeElement === preview) {
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
            // Check if preview has focus and is contenteditable
            if (preview.contentEditable === 'true' && document.activeElement === preview) {
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

        function convertToList(listType) {
            saveUndoState(); // Save state for undo
            
            if (preview.contentEditable === 'true' && document.activeElement === preview) {
                // Preview mode - convert selection or current line to list
                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) {
                    // No selection - insert new list at end
                    const listElement = document.createElement(listType === 'task' ? 'ul' : listType);
                    if (listType === 'task') {
                        listElement.className = 'task-list';
                    }
                    
                    const li = document.createElement('li');
                    if (listType === 'task') {
                        li.className = 'task-list-item';
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        li.appendChild(checkbox);
                        li.appendChild(document.createTextNode(' List item'));
                    } else {
                        li.textContent = 'List item';
                    }
                    listElement.appendChild(li);
                    preview.appendChild(listElement);
                    
                    // Place cursor in the list item
                    const newRange = document.createRange();
                    if (listType === 'task') {
                        // Place cursor after checkbox
                        const textNode = li.childNodes[1];
                        newRange.setStart(textNode, 1);
                        newRange.collapse(true);
                    } else {
                        newRange.selectNodeContents(li);
                        newRange.collapse(false);
                    }
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                    
                    syncPreviewToEditor();
                    preview.focus();
                    return;
                }
                
                const range = selection.getRangeAt(0);
                const selectedText = range.toString();
                
                if (selectedText) {
                    // Convert selected text lines to list
                    const lines = selectedText.split('\\n').filter(line => line.trim());
                    const listElement = document.createElement(listType === 'task' ? 'ul' : listType);
                    if (listType === 'task') {
                        listElement.className = 'task-list';
                    }
                    
                    lines.forEach((line, index) => {
                        const li = document.createElement('li');
                        if (listType === 'task') {
                            li.className = 'task-list-item';
                            const checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            li.appendChild(checkbox);
                            li.appendChild(document.createTextNode(' ' + line.trim()));
                        } else {
                            li.textContent = line.trim();
                        }
                        listElement.appendChild(li);
                    });
                    
                    range.deleteContents();
                    range.insertNode(listElement);
                    
                    // Move cursor after list
                    const newRange = document.createRange();
                    newRange.setStartAfter(listElement);
                    newRange.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                    
                    syncPreviewToEditor();
                } else {
                    // Insert new list item
                    const listMarkers = {
                        'ul': '\\n- ',
                        'ol': '\\n1. ',
                        'task': '\\n- [ ] '
                    };
                    insertText(listMarkers[listType]);
                }
            } else {
                // Editor mode - convert selected lines to list
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                const text = editor.value;
                
                if (start !== end) {
                    // Convert selected text to list
                    const selectedText = text.substring(start, end);
                    const lines = selectedText.split('\\n');
                    
                    let convertedText;
                    if (listType === 'ul') {
                        convertedText = lines.map(line => line.trim() ? '- ' + line.trim() : '').join('\\n');
                    } else if (listType === 'ol') {
                        let num = 1;
                        convertedText = lines.map(line => line.trim() ? (num++) + '. ' + line.trim() : '').join('\\n');
                    } else { // task
                        convertedText = lines.map(line => line.trim() ? '- [ ] ' + line.trim() : '').join('\\n');
                    }
                    
                    const newText = text.substring(0, start) + convertedText + text.substring(end);
                    editor.value = newText;
                    editor.selectionStart = start;
                    editor.selectionEnd = start + convertedText.length;
                    editor.focus();
                    
                    updatePreview();
                    notifyChange();
                } else {
                    // Insert new list item
                    const listMarkers = {
                        'ul': '\\n- ',
                        'ol': '\\n1. ',
                        'task': '\\n- [ ] '
                    };
                    insertText(listMarkers[listType]);
                }
            }
        }

        function applyHeadingStyle(headingLevel) {
            saveUndoState(); // Save state for undo
            
            if (preview.contentEditable === 'true' && document.activeElement === preview) {
                // Preview mode - convert current block to heading
                const selection = window.getSelection();
                if (!selection || selection.rangeCount === 0) {
                    // No selection - insert new heading at end
                    const newHeading = document.createElement(headingLevel);
                    newHeading.textContent = 'Heading';
                    preview.appendChild(newHeading);
                    
                    // Place cursor in the heading
                    const newRange = document.createRange();
                    newRange.selectNodeContents(newHeading);
                    newRange.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                    
                    syncPreviewToEditor();
                    preview.focus();
                    return;
                }
                
                const range = selection.getRangeAt(0);
                let node = range.commonAncestorContainer;
                if (node.nodeType === Node.TEXT_NODE) {
                    node = node.parentElement;
                }
                
                // Find the closest block element (p, h1-h6, div, etc.)
                while (node && node !== preview && 
                       !['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV', 'LI'].includes(node.tagName)) {
                    node = node.parentElement;
                }
                
                if (node && node !== preview && node.tagName !== 'LI') {
                    // Create new heading element
                    const newHeading = document.createElement(headingLevel);
                    newHeading.textContent = node.textContent;
                    node.parentNode.replaceChild(newHeading, node);
                    
                    // Place cursor at end of new heading
                    const newRange = document.createRange();
                    newRange.selectNodeContents(newHeading);
                    newRange.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                    
                    syncPreviewToEditor();
                }
            } else {
                // Editor mode - apply heading markdown to current line
                const start = editor.selectionStart;
                const text = editor.value;
                
                // Find start of current line
                let lineStart = start;
                while (lineStart > 0 && text[lineStart - 1] !== '\\n') {
                    lineStart--;
                }
                
                // Find end of current line
                let lineEnd = start;
                while (lineEnd < text.length && text[lineEnd] !== '\\n') {
                    lineEnd++;
                }
                
                const currentLine = text.substring(lineStart, lineEnd);
                
                // Remove existing heading markers if any
                const cleanLine = currentLine.replace(/^#{1,6}\\s*/, '');
                
                // Add new heading marker
                const headingMarkers = {'h1': '# ', 'h2': '## ', 'h3': '### '};
                const newLine = headingMarkers[headingLevel] + cleanLine;
                
                // Replace the line
                const newText = text.substring(0, lineStart) + newLine + text.substring(lineEnd);
                editor.value = newText;
                
                // Set cursor at end of line
                const newCursorPos = lineStart + newLine.length;
                editor.selectionStart = newCursorPos;
                editor.selectionEnd = newCursorPos;
                editor.focus();
                
                updatePreview();
                notifyChange();
            }
        }

        // Toolbar button handlers with proper error handling and focus management
        document.getElementById('btn-bold').addEventListener('click', () => {
            try {
                wrapSelection('**', '**');
                // Restore focus to appropriate editor
                if (preview.contentEditable === 'true' && viewMode.value !== 'editor') {
                    preview.focus();
                } else {
                    editor.focus();
                }
            } catch (e) {
                console.error('Bold button error:', e);
            }
        });
        
        document.getElementById('btn-italic').addEventListener('click', () => {
            try {
                wrapSelection('*', '*');
                if (preview.contentEditable === 'true' && viewMode.value !== 'editor') {
                    preview.focus();
                } else {
                    editor.focus();
                }
            } catch (e) {
                console.error('Italic button error:', e);
            }
        });
        
        document.getElementById('btn-strikethrough').addEventListener('click', () => {
            try {
                wrapSelection('~~', '~~');
                if (preview.contentEditable === 'true' && viewMode.value !== 'editor') {
                    preview.focus();
                } else {
                    editor.focus();
                }
            } catch (e) {
                console.error('Strikethrough button error:', e);
            }
        });
        
        document.getElementById('btn-code').addEventListener('click', () => {
            try {
                wrapSelection('\`', '\`');
                if (preview.contentEditable === 'true' && viewMode.value !== 'editor') {
                    preview.focus();
                } else {
                    editor.focus();
                }
            } catch (e) {
                console.error('Code button error:', e);
            }
        });

        document.getElementById('btn-h1').addEventListener('click', () => {
            try {
                applyHeadingStyle('h1');
                if (preview.contentEditable === 'true' && viewMode.value !== 'editor') {
                    preview.focus();
                } else {
                    editor.focus();
                }
            } catch (e) {
                console.error('H1 button error:', e);
            }
        });
        
        document.getElementById('btn-h2').addEventListener('click', () => {
            try {
                applyHeadingStyle('h2');
                if (preview.contentEditable === 'true' && viewMode.value !== 'editor') {
                    preview.focus();
                } else {
                    editor.focus();
                }
            } catch (e) {
                console.error('H2 button error:', e);
            }
        });
        
        document.getElementById('btn-h3').addEventListener('click', () => {
            try {
                applyHeadingStyle('h3');
                if (preview.contentEditable === 'true' && viewMode.value !== 'editor') {
                    preview.focus();
                } else {
                    editor.focus();
                }
            } catch (e) {
                console.error('H3 button error:', e);
            }
        });
        
        document.getElementById('btn-normal').addEventListener('click', () => {
            // Convert current block to normal paragraph
            if (preview.contentEditable === 'true' && document.activeElement === preview) {
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

        document.getElementById('btn-ul').addEventListener('click', () => {
            try {
                convertToList('ul');
                if (preview.contentEditable === 'true' && viewMode.value !== 'editor') {
                    preview.focus();
                } else {
                    editor.focus();
                }
            } catch (e) {
                console.error('Bullet list button error:', e);
            }
        });
        
        document.getElementById('btn-ol').addEventListener('click', () => {
            try {
                convertToList('ol');
                if (preview.contentEditable === 'true' && viewMode.value !== 'editor') {
                    preview.focus();
                } else {
                    editor.focus();
                }
            } catch (e) {
                console.error('Numbered list button error:', e);
            }
        });
        
        document.getElementById('btn-task').addEventListener('click', () => {
            try {
                convertToList('task');
                if (preview.contentEditable === 'true' && viewMode.value !== 'editor') {
                    preview.focus();
                } else {
                    editor.focus();
                }
            } catch (e) {
                console.error('Task list button error:', e);
            }
        });

        const btnLink = document.getElementById('btn-link');
        if (btnLink) {
            btnLink.addEventListener('click', (e) => {
                try {
                    console.log('[MDOffice] Link button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Create link options dialog
                    const dialog = document.createElement('div');
                    dialog.style.cssText = \`
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: var(--vscode-editor-background);
                        border: 2px solid var(--vscode-panel-border);
                        border-radius: 8px;
                        padding: 20px;
                        z-index: 10000;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                        min-width: 450px;
                        max-width: 600px;
                    \`;
                    
                    dialog.innerHTML = \`
                        <h3 style="margin: 0 0 15px 0; color: var(--vscode-foreground);">Insert Link</h3>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button id="link-markdown-file" style="padding: 12px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 5px; cursor: pointer; font-size: 14px; text-align: left;">
                                📄 <strong>Markdown File Link</strong><br>
                                <span style="font-size: 11px; opacity: 0.8;">Link to another .md file (opens in MDOffice)</span>
                            </button>
                            <button id="link-anchor" style="padding: 12px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 5px; cursor: pointer; font-size: 14px; text-align: left;">
                                🔗 <strong>Anchor Link</strong><br>
                                <span style="font-size: 11px; opacity: 0.8;">Link to heading in current document</span>
                            </button>
                            <button id="link-url" style="padding: 12px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 5px; cursor: pointer; font-size: 14px; text-align: left;">
                                🌐 <strong>External URL</strong><br>
                                <span style="font-size: 11px; opacity: 0.8;">Link to website or external resource</span>
                            </button>
                            <button id="link-file-anchor" style="padding: 12px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 5px; cursor: pointer; font-size: 14px; text-align: left;">
                                📄🔗 <strong>File + Anchor</strong><br>
                                <span style="font-size: 11px; opacity: 0.8;">Link to specific section in another markdown file</span>
                            </button>
                            <button id="link-cancel" style="padding: 12px; background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                                ❌ Cancel
                            </button>
                        </div>
                    \`;
                    
                    document.body.appendChild(dialog);
                    
                    // Add overlay
                    const overlay = document.createElement('div');
                    overlay.style.cssText = \`
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 9999;
                    \`;
                    document.body.appendChild(overlay);
                    
                    const closeDialog = () => {
                        document.body.removeChild(dialog);
                        document.body.removeChild(overlay);
                    };
                    
                    // Markdown file link
                    dialog.querySelector('#link-markdown-file').addEventListener('click', () => {
                        closeDialog();
                        const filePath = prompt('Enter markdown file path:\\n\\nExamples:\\n  ./filename.md (same folder)\\n  ./subfolder/file.md (subfolder)\\n  ../README.md (parent folder)', './');
                        if (filePath) {
                            const text = prompt('Enter link text:', filePath.split('/').pop().replace('.md', ''));
                            insertText(\`[\${text || 'Link'}](\${filePath})\`);
                        }
                    });
                    
                    // Anchor link
                    dialog.querySelector('#link-anchor').addEventListener('click', () => {
                        closeDialog();
                        const anchor = prompt('Enter heading anchor:\\n\\nExamples:\\n  #features\\n  #getting-started\\n  #api-documentation', '#');
                        if (anchor) {
                            const text = prompt('Enter link text:', anchor.replace('#', '').replace(/-/g, ' '));
                            insertText(\`[\${text || 'Link'}](\${anchor})\`);
                        }
                    });
                    
                    // External URL
                    dialog.querySelector('#link-url').addEventListener('click', () => {
                        closeDialog();
                        const url = prompt('Enter URL:\\n\\nExamples:\\n  https://example.com\\n  https://github.com/user/repo', 'https://');
                        if (url) {
                            const text = prompt('Enter link text:', 'Link');
                            insertText(\`[\${text}](\${url})\`);
                        }
                    });
                    
                    // File + Anchor
                    dialog.querySelector('#link-file-anchor').addEventListener('click', () => {
                        closeDialog();
                        const filePath = prompt('Enter markdown file path:', './README.md');
                        if (filePath) {
                            const anchor = prompt('Enter heading anchor (e.g., #installation):', '#');
                            if (anchor) {
                                const text = prompt('Enter link text:', filePath.split('/').pop().replace('.md', '') + ' - ' + anchor.replace('#', ''));
                                insertText(\`[\${text || 'Link'}](\${filePath}\${anchor})\`);
                            }
                        }
                    });
                    
                    dialog.querySelector('#link-cancel').addEventListener('click', closeDialog);
                    overlay.addEventListener('click', closeDialog);
                    
                } catch (e) {
                    console.error('[MDOffice] Link button error:', e);
                    alert('Error inserting link: ' + e.message);
                }
            });
        } else {
            console.error('[MDOffice] btn-link element not found');
        }

        const btnImage = document.getElementById('btn-image');
        if (btnImage) {
            console.log('[MDOffice] btn-image element found, attaching event listener');
            btnImage.addEventListener('click', (e) => {
                try {
                    console.log('[MDOffice] Image button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Create a better dialog using HTML
                    const dialog = document.createElement('div');
                    dialog.style.cssText = \`
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: var(--vscode-editor-background);
                        border: 2px solid var(--vscode-panel-border);
                        border-radius: 8px;
                        padding: 20px;
                        z-index: 10000;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                        min-width: 400px;
                    \`;
                    
                    dialog.innerHTML = \`
                        <h3 style="margin: 0 0 15px 0; color: var(--vscode-foreground);">Insert Image</h3>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button id="img-browse" style="padding: 12px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                                🖼️ Browse File
                            </button>
                            <button id="img-url" style="padding: 12px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                                🔗 Enter URL
                            </button>
                            <button id="img-clipboard" style="padding: 12px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                                📋 Paste from Clipboard (Ctrl+V)
                            </button>
                            <button id="img-cancel" style="padding: 12px; background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">
                                ❌ Cancel
                            </button>
                        </div>
                    \`;
                    
                    document.body.appendChild(dialog);
                    
                    // Add overlay
                    const overlay = document.createElement('div');
                    overlay.style.cssText = \`
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 9999;
                    \`;
                    document.body.appendChild(overlay);
                    
                    const closeDialog = () => {
                        document.body.removeChild(dialog);
                        document.body.removeChild(overlay);
                    };
                    
                    dialog.querySelector('#img-browse').addEventListener('click', () => {
                        console.log('[MDOffice] Browse file selected');
                        vscode.postMessage({ type: 'selectImage' });
                        closeDialog();
                    });
                    
                    dialog.querySelector('#img-url').addEventListener('click', () => {
                        closeDialog();
                        const url = prompt('Enter image URL:');
                        if (url) {
                            const alt = prompt('Enter alt text:', 'Image');
                            insertText(\`![\${alt || 'Image'}](\${url})\`);
                        }
                    });
                    
                    dialog.querySelector('#img-clipboard').addEventListener('click', () => {
                        closeDialog();
                        alert('To paste an image from clipboard:\\n\\n1. Copy an image (Ctrl+C or Cmd+C)\\n2. Click in the editor\\n3. Paste (Ctrl+V or Cmd+V)\\n\\nThe image will be automatically saved and inserted!');
                    });
                    
                    dialog.querySelector('#img-cancel').addEventListener('click', closeDialog);
                    overlay.addEventListener('click', closeDialog);
                    
                } catch (e) {
                    console.error('[MDOffice] Image button error:', e);
                    alert('Error inserting image: ' + e.message);
                }
            });
        } else {
            console.error('[MDOffice] btn-image element not found');
        }

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

        // Export buttons
        document.getElementById('btn-export-html').addEventListener('click', () => {
            vscode.postMessage({
                type: 'command',
                command: 'mdOfficeEditor.exportToHTML'
            });
        });

        document.getElementById('btn-export-pdf').addEventListener('click', () => {
            vscode.postMessage({
                type: 'command',
                command: 'mdOfficeEditor.exportToPDF'
            });
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
                // Enable preview editing in split view for better user experience
                preview.contentEditable = 'true';
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
            // Sync if preview is editable (in preview-only or split mode)
            if (preview.contentEditable === 'true') {
                // Debounce the sync to avoid performance issues and cursor jumping
                clearTimeout(previewSyncTimeout);
                previewSyncTimeout = setTimeout(() => {
                    syncPreviewToEditor();
                }, 300); // Reduced to 300ms for faster sync
                
                // Debounced undo state saving (save every 1 second of inactivity)
                clearTimeout(undoSaveTimeout);
                undoSaveTimeout = setTimeout(() => {
                    const currentState = preview.innerHTML;
                    // Only save if state has changed
                    if (currentState !== lastSavedState) {
                        saveUndoState();
                        lastSavedState = currentState;
                    }
                }, 1000);
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
            
            // Handle Tab key for indentation in editor
            if (e.key === 'Tab') {
                e.preventDefault(); // Always prevent default to keep focus in editor
                
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                const text = editor.value;
                
                // Find start of current line
                let lineStart = start;
                while (lineStart > 0 && text[lineStart - 1] !== '\\n') {
                    lineStart--;
                }
                
                if (e.shiftKey) {
                    // Shift+Tab: Remove indentation (outdent)
                    const lineBeforeCursor = text.substring(lineStart, start);
                    const match = lineBeforeCursor.match(/^(\\s+)/);
                    if (match) {
                        const indent = match[1];
                        // Remove up to 4 spaces or 1 tab
                        const removeLength = indent.startsWith('\\t') ? 1 : Math.min(4, indent.length);
                        const newText = text.substring(0, lineStart) + text.substring(lineStart + removeLength);
                        editor.value = newText;
                        const cursorAdjust = Math.min(removeLength, start - lineStart);
                        editor.selectionStart = start - cursorAdjust;
                        editor.selectionEnd = end - cursorAdjust;
                        updatePreview();
                        notifyChange();
                    }
                } else {
                    // Tab: Add indentation (indent)
                    // Check if we're in a list for special handling
                    const lineBeforeCursor = text.substring(lineStart, start);
                    const isInList = /^\\s*[-*+]\\s/.test(lineBeforeCursor) || 
                                    /^\\s*\\d+\\.\\s/.test(lineBeforeCursor) || 
                                    /^\\s*-\\s\\[[ x]\\]\\s/.test(lineBeforeCursor);
                    
                    // For lists, add 2 spaces; for regular text, add 4 spaces (or tab character)
                    const tabString = isInList ? '  ' : '    '; // Use 4 spaces for regular indentation
                    const newText = text.substring(0, lineStart) + tabString + text.substring(lineStart);
                    editor.value = newText;
                    editor.selectionStart = start + tabString.length;
                    editor.selectionEnd = end + tabString.length;
                    updatePreview();
                    notifyChange();
                }
                return;
            }
            
            // Handle Enter key for smart list continuation
            if (e.key === 'Enter') {
                const start = editor.selectionStart;
                const text = editor.value;
                
                // Find start of current line
                let lineStart = start;
                while (lineStart > 0 && text[lineStart - 1] !== '\\n') {
                    lineStart--;
                }
                
                // Get current line
                let lineEnd = start;
                while (lineEnd < text.length && text[lineEnd] !== '\\n') {
                    lineEnd++;
                }
                const currentLine = text.substring(lineStart, lineEnd);
                
                // Check if current line is a list item (bullet, numbered, or task)
                const bulletMatch = currentLine.match(/^(\\s*)[-*+]\\s(.*)$/);
                const numberedMatch = currentLine.match(/^(\\s*)(\\d+)\\.\\s(.*)$/);
                const taskMatch = currentLine.match(/^(\\s*)-\\s\\[([ x])\\]\\s(.*)$/);
                
                if (taskMatch) {
                    // Task list item
                    const indent = taskMatch[1];
                    const content = taskMatch[3];
                    
                    // If the task item is empty (no content after checkbox), end the list
                    if (content.trim() === '') {
                        e.preventDefault();
                        // Remove the empty list item and insert a blank line
                        const newText = text.substring(0, lineStart) + '\\n' + text.substring(lineEnd);
                        editor.value = newText;
                        editor.selectionStart = editor.selectionEnd = lineStart + 1;
                        updatePreview();
                        notifyChange();
                        return;
                    }
                    
                    // Continue with a new task item at the same indentation
                    e.preventDefault();
                    const newTask = '\\n' + indent + '- [ ] ';
                    const newText = text.substring(0, start) + newTask + text.substring(start);
                    editor.value = newText;
                    editor.selectionStart = editor.selectionEnd = start + newTask.length;
                    updatePreview();
                    notifyChange();
                    return;
                } else if (bulletMatch) {
                    // Regular bullet list
                    const indent = bulletMatch[1];
                    const content = bulletMatch[2];
                    
                    if (content.trim() === '') {
                        e.preventDefault();
                        const newText = text.substring(0, lineStart) + '\\n' + text.substring(lineEnd);
                        editor.value = newText;
                        editor.selectionStart = editor.selectionEnd = lineStart + 1;
                        updatePreview();
                        notifyChange();
                        return;
                    }
                    
                    e.preventDefault();
                    const newBullet = '\\n' + indent + '- ';
                    const newText = text.substring(0, start) + newBullet + text.substring(start);
                    editor.value = newText;
                    editor.selectionStart = editor.selectionEnd = start + newBullet.length;
                    updatePreview();
                    notifyChange();
                    return;
                } else if (numberedMatch) {
                    // Numbered list
                    const indent = numberedMatch[1];
                    const num = parseInt(numberedMatch[2]);
                    const content = numberedMatch[3];
                    
                    if (content.trim() === '') {
                        e.preventDefault();
                        const newText = text.substring(0, lineStart) + '\\n' + text.substring(lineEnd);
                        editor.value = newText;
                        editor.selectionStart = editor.selectionEnd = lineStart + 1;
                        updatePreview();
                        notifyChange();
                        return;
                    }
                    
                    e.preventDefault();
                    const newNumbered = '\\n' + indent + (num + 1) + '. ';
                    const newText = text.substring(0, start) + newNumbered + text.substring(start);
                    editor.value = newText;
                    editor.selectionStart = editor.selectionEnd = start + newNumbered.length;
                    updatePreview();
                    notifyChange();
                    return;
                }
                // If not a list item, let default Enter behavior happen
            }
            
            if (e.ctrlKey || e.metaKey) {
                // Note: Ctrl+Z and Ctrl+Shift+Z work natively in textarea, so we don't override them
                if (e.key === 'f') {
                    e.preventDefault();
                    openSearch();
                } else if (e.key === 'b') {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent VS Code sidebar toggle
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
            
            // Handle Tab key for indentation in preview
            if (e.key === 'Tab') {
                e.preventDefault(); // Always prevent default to keep focus in preview
                
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    let node = range.commonAncestorContainer;
                    if (node.nodeType === Node.TEXT_NODE) {
                        node = node.parentElement;
                    }
                    
                    // Find if we're in a list item
                    let listItem = node;
                    while (listItem && listItem !== preview && listItem.tagName !== 'LI') {
                        listItem = listItem.parentElement;
                    }
                    
                    if (listItem && listItem.tagName === 'LI') {
                        // We're in a list - handle list indentation
                        const parentList = listItem.parentElement;
                        
                        if (e.shiftKey) {
                            // Shift+Tab: Outdent (move up one level)
                            const grandParentList = parentList.parentElement?.closest('ul, ol');
                            if (grandParentList && grandParentList.tagName !== 'BODY') {
                                // Find the parent LI
                                const parentLI = parentList.closest('li');
                                if (parentLI) {
                                    // Insert after parent LI
                                    grandParentList.insertBefore(listItem, parentLI.nextSibling);
                                    
                                    // Remove empty parent list if needed
                                    if (parentList.children.length === 0) {
                                        parentList.remove();
                                    }
                                    
                                    setTimeout(() => syncPreviewToEditor(), 50);
                                }
                            }
                        } else {
                            // Tab: Indent (create nested list)
                            const prevItem = listItem.previousElementSibling;
                            if (prevItem && prevItem.tagName === 'LI') {
                                // Check if prev item already has a nested list
                                let nestedList = prevItem.querySelector(':scope > ul, :scope > ol');
                                
                                if (!nestedList) {
                                    // Create new nested list of same type as parent
                                    nestedList = document.createElement(parentList.tagName.toLowerCase());
                                    prevItem.appendChild(nestedList);
                                }
                                
                                // Move current item into nested list
                                nestedList.appendChild(listItem);
                                setTimeout(() => syncPreviewToEditor(), 50);
                            }
                        }
                    } else {
                        // Not in a list - insert tab/spaces for regular indentation
                        // Insert 4 spaces for regular text indentation
                        document.execCommand('insertText', false, '    ');
                        setTimeout(() => syncPreviewToEditor(), 50);
                    }
                }
                return;
            }
            
            // Handle Enter key - convert heading to normal paragraph on new line
            if (e.key === 'Enter') {
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    let node = range.commonAncestorContainer;
                    if (node.nodeType === Node.TEXT_NODE) {
                        node = node.parentElement;
                    }
                    
                    // Check if we're in a heading
                    let headingNode = node;
                    while (headingNode && headingNode !== preview) {
                        if (/^H[1-6]$/.test(headingNode.tagName)) {
                            // We're in a heading - insert a new paragraph after Enter
                            e.preventDefault();
                            
                            // Create new paragraph
                            const p = document.createElement('p');
                            p.innerHTML = '<br>'; // Ensure it's editable
                            
                            // Insert after the heading
                            headingNode.parentNode.insertBefore(p, headingNode.nextSibling);
                            
                            // Move cursor to new paragraph
                            const newRange = document.createRange();
                            newRange.setStart(p, 0);
                            newRange.collapse(true);
                            selection.removeAllRanges();
                            selection.addRange(newRange);
                            
                            // Sync to markdown
                            setTimeout(() => syncPreviewToEditor(), 50);
                            return;
                        }
                        headingNode = headingNode.parentElement;
                    }
                }
                
                // Default Enter behavior for non-headings, then sync
                setTimeout(() => {
                    clearTimeout(previewSyncTimeout);
                    previewSyncTimeout = setTimeout(() => {
                        syncPreviewToEditor();
                    }, 300); // Match the input debounce time
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
                    e.stopPropagation(); // Prevent VS Code sidebar toggle
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

        // Clipboard paste handler for images
        editor.addEventListener('paste', async (e) => {
            console.log('[MDOffice] Paste event in editor');
            const items = e.clipboardData?.items;
            if (!items) {
                console.log('[MDOffice] No clipboard items');
                return;
            }
            
            console.log('[MDOffice] Clipboard items count:', items.length);
            for (let i = 0; i < items.length; i++) {
                console.log('[MDOffice] Item', i, 'type:', items[i].type);
                if (items[i].type.indexOf('image') !== -1) {
                    console.log('[MDOffice] Image detected in clipboard!');
                    e.preventDefault();
                    const blob = items[i].getAsFile();
                    if (!blob) {
                        console.log('[MDOffice] Failed to get blob');
                        continue;
                    }
                    
                    console.log('[MDOffice] Image blob size:', blob.size);
                    
                    // Read blob as data URL
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imageData = event.target.result;
                        console.log('[MDOffice] Image data loaded, length:', imageData ? imageData.length : 0);
                        const altText = prompt('Enter alt text for pasted image:', 'Pasted image') || 'Pasted image';
                        
                        console.log('[MDOffice] Sending saveImageFromClipboard message');
                        // Send to extension to save the image
                        vscode.postMessage({
                            type: 'saveImageFromClipboard',
                            imageData: imageData,
                            altText: altText
                        });
                    };
                    reader.onerror = (error) => {
                        console.error('[MDOffice] Error reading image:', error);
                    };
                    reader.readAsDataURL(blob);
                    break;
                }
            }
        });

        preview.addEventListener('paste', async (e) => {
            console.log('[MDOffice] Paste event in preview');
            const items = e.clipboardData?.items;
            if (!items) {
                console.log('[MDOffice] No clipboard items in preview');
                return;
            }
            
            console.log('[MDOffice] Clipboard items count in preview:', items.length);
            for (let i = 0; i < items.length; i++) {
                console.log('[MDOffice] Preview item', i, 'type:', items[i].type);
                if (items[i].type.indexOf('image') !== -1) {
                    console.log('[MDOffice] Image detected in preview clipboard!');
                    e.preventDefault();
                    const blob = items[i].getAsFile();
                    if (!blob) {
                        console.log('[MDOffice] Failed to get blob in preview');
                        continue;
                    }
                    
                    console.log('[MDOffice] Preview image blob size:', blob.size);
                    
                    // Read blob as data URL
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imageData = event.target.result;
                        console.log('[MDOffice] Preview image data loaded, length:', imageData ? imageData.length : 0);
                        const altText = prompt('Enter alt text for pasted image:', 'Pasted image') || 'Pasted image';
                        
                        console.log('[MDOffice] Sending saveImageFromClipboard message from preview');
                        // Send to extension to save the image
                        vscode.postMessage({
                            type: 'saveImageFromClipboard',
                            imageData: imageData,
                            altText: altText
                        });
                    };
                    reader.onerror = (error) => {
                        console.error('[MDOffice] Error reading image in preview:', error);
                    };
                    reader.readAsDataURL(blob);
                    break;
                }
            }
        });

        // Drag and drop handler for images in editor
        editor.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        editor.addEventListener('drop', async (e) => {
            e.preventDefault();
            const files = e.dataTransfer?.files;
            if (!files || files.length === 0) return;
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imageData = event.target.result;
                        const altText = prompt('Enter alt text for dropped image:', file.name) || file.name;
                        
                        // Send to extension to save the image
                        vscode.postMessage({
                            type: 'saveImageFromClipboard',
                            imageData: imageData,
                            altText: altText
                        });
                    };
                    reader.readAsDataURL(file);
                }
            }
        });

        // Drag and drop handler for images in preview
        preview.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        preview.addEventListener('drop', async (e) => {
            e.preventDefault();
            const files = e.dataTransfer?.files;
            if (!files || files.length === 0) return;
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imageData = event.target.result;
                        const altText = prompt('Enter alt text for dropped image:', file.name) || file.name;
                        
                        // Send to extension to save the image
                        vscode.postMessage({
                            type: 'saveImageFromClipboard',
                            imageData: imageData,
                            altText: altText
                        });
                    };
                    reader.readAsDataURL(file);
                }
            }
        });

        // Handle markdown file links - click to open in MDOffice
        preview.addEventListener('click', (e) => {
            const target = e.target;
            
            // Check if clicked on a markdown file link
            if (target.classList && target.classList.contains('md-file-link')) {
                e.preventDefault();
                const filePath = target.getAttribute('data-file-path');
                const anchor = target.getAttribute('data-anchor');
                
                console.log('[MDOffice] Opening linked file:', filePath, 'anchor:', anchor);
                
                // Send message to extension to open the file
                vscode.postMessage({
                    type: 'openLinkedFile',
                    filePath: filePath,
                    anchor: anchor || ''
                });
                return;
            }
            
            // Check if clicked on an anchor link (same document)
            if (target.classList && target.classList.contains('anchor-link')) {
                e.preventDefault();
                const href = target.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const anchorId = href.substring(1);
                    console.log('[MDOffice] Scrolling to anchor:', anchorId);
                    
                    // Try to find the heading with this ID
                    const headingElement = preview.querySelector(\`[id="\${anchorId}"]\`) || 
                                          preview.querySelector(\`h1, h2, h3, h4, h5, h6\`);
                    
                    if (headingElement) {
                        headingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        console.warn('[MDOffice] Anchor not found:', anchorId);
                    }
                }
                return;
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
                case 'insertImage':
                    if (message.markdown) {
                        insertText(message.markdown);
                        if (preview.contentEditable === 'true' && viewMode.value !== 'editor') {
                            preview.focus();
                        } else {
                            editor.focus();
                        }
                    }
                    break;
                case 'scrollToAnchor':
                    if (message.anchor) {
                        // Generate slug the same way as headings
                        const anchorSlug = message.anchor.toLowerCase()
                            .replace(/<[^>]*>/g, '')
                            .replace(/[^a-z0-9\\s-]/g, '')
                            .replace(/\\s+/g, '-')
                            .replace(/-+/g, '-')
                            .replace(/^-|-$/g, '');
                        
                        console.log('[MDOffice] Scrolling to anchor:', anchorSlug);
                        
                        // Find the heading with this ID
                        const headingElement = preview.querySelector(\`[id="\${anchorSlug}"]\`);
                        
                        if (headingElement) {
                            // Small delay to ensure preview is rendered
                            setTimeout(() => {
                                headingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                // Highlight the heading briefly
                                headingElement.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
                                setTimeout(() => {
                                    headingElement.style.backgroundColor = '';
                                }, 2000);
                            }, 200);
                        } else {
                            console.warn('[MDOffice] Anchor not found in preview:', anchorSlug);
                        }
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


