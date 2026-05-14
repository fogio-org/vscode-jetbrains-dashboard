# JetBrains Dashboard

JetBrains-style Welcome Screen for VS Code. Replaces the default Get Started tab with a IntelliJ/GoLand/WebStorm-inspired project dashboard.

Part of the JetBrains-for-VS-Code suite:
- `fogio.jetbrains-color-theme`
- `fogio.jetbrains-file-icon-theme`
- `fogio.jetbrains-product-icon-theme`
- `fogio.jetbrains-dashboard` (this extension)

## Features

- Recent projects list with hash-colored avatars, relative timestamps, and per-row actions (open, open in new window, pin, remove).
- Pinned projects pinned to the top with a visual divider.
- Quick search filter over names and paths.
- Quick actions: New Project, Open, Clone Repository.
- Customize panel: Color Theme, Keymap, Plugins, plus one-click "Apply JetBrains Theme Pack".
- Auto-opens at startup when no folder is open (configurable).

## Commands

- `JetBrains Dashboard: Open` — open the dashboard panel.
- `JetBrains Dashboard: Pin Project` — toggle pin via QuickPick.
- `JetBrains Dashboard: Clear Project History` — wipe stored metadata and recent files.

## Settings

- `fogioDashboard.showOnStartup` — show on startup when no folder is open. Default: `true`.
- `fogioDashboard.projectsSource` — `recentlyOpened` | `manual` | `both`. Default: `recentlyOpened`.
- `fogioDashboard.maxProjects` — list cap. Default: `25`.

## Build

```sh
npm install
npm run build      # production bundle
npm run watch      # dev
```

Press `F5` in VS Code to launch the Extension Development Host.

## License

MIT
