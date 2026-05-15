# Changelog

## 0.2.0

### Features

- **Status bar button** — `$(home)` icon in the status bar, one click to open dashboard
- **Show when no editors** — optionally reopen dashboard when all editor tabs are closed (`fogioDashboard.showWhenNoEditors`)
- **Apply Theme Pack suppresses Welcome** — sets `workbench.startupEditor: none` automatically

### Improvements

- **Faster startup** — dashboard activates immediately instead of waiting for full VS Code startup
- **Smaller VSIX** — screenshots excluded from package, served from GitHub

## 0.1.0

### Features

- **JetBrains-style welcome screen** — WebviewPanel-based dashboard that replaces the default Get Started tab
- **Recent projects list** — fetched from VS Code's recently opened history, sorted by last opened time
- **Project avatars** — first-letter colored circles using hash-based color palette (same style as JetBrains IDE)
- **Pin projects** — pinned items stay at the top with a visual "Pinned" / "Recent" divider
- **Search** — real-time filter by project name or path
- **Hover actions** — open in current window, open in new window, pin/unpin, remove from list
- **Keyboard navigation** — `Enter` to open, `Cmd/Ctrl+Enter` for new window, `Delete`/`Backspace` to remove, `Tab` between items
- **Missing project handling** — struck-through style for non-existent paths, click prompts removal
- **Quick actions** — New Project, Open, Clone Repository
- **Customize section** — Color Theme, Keymap, Plugins shortcuts
- **Apply JetBrains Theme Pack** — one-click install and activate `fogio.jetbrains-color-theme`, `fogio.jetbrains-file-icon-theme`, `fogio.jetbrains-product-icon-theme`
- **Auto-open on startup** — shows when no folder is open (`fogioDashboard.showOnStartup`)
- **Configurable project source** — `recentlyOpened`, `manual`, or `both` (`fogioDashboard.projectsSource`)
- **Theme-aware** — adapts to any VS Code color theme via CSS custom properties
- **JetBrains-style SVG icons** — inline fill-path icons matching JetBrains icon language
