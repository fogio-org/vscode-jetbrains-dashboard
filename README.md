# JetBrains Dashboard

> **JetBrains-style Welcome Screen** for VS Code — replaces the default Get Started tab with a project dashboard inspired by IntelliJ IDEA / GoLand / WebStorm.

[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=fogio.jetbrains-dashboard):

![VS Code Marketplace Version](https://vsmarketplacebadges.dev/version-short/fogio.jetbrains-dashboard.svg?style=for-the-badge&colorA=555555&colorB=007ec6&label=VERSION)&nbsp;
![VS Code Marketplace Rating](https://vsmarketplacebadges.dev/rating-short/fogio.jetbrains-dashboard.svg?style=for-the-badge&colorA=555555&colorB=007ec6&label=RATING)&nbsp;
![VS Code Marketplace Downloads](https://vsmarketplacebadges.dev/downloads-short/fogio.jetbrains-dashboard.svg?style=for-the-badge&colorA=555555&colorB=007ec6&label=DOWNLOADS)&nbsp;
![VS Code Marketplace Installs](https://vsmarketplacebadges.dev/installs-short/fogio.jetbrains-dashboard.svg?style=for-the-badge&colorA=555555&colorB=007ec6&label=INSTALLS)

[Open VSX](https://open-vsx.org/extension/fogio/jetbrains-dashboard):

![Open VSX Version](https://img.shields.io/open-vsx/v/fogio/jetbrains-dashboard?style=for-the-badge&color=%23c260ef&label=VERSION)&nbsp;
![Open VSX Rating](https://img.shields.io/open-vsx/rating/fogio/jetbrains-dashboard?style=for-the-badge&color=%23c260ef&label=RATING)&nbsp;
![Open VSX Downloads](https://img.shields.io/open-vsx/dt/fogio/jetbrains-dashboard?style=for-the-badge&color=%23c260ef&label=DOWNLOADS)&nbsp;
![Open VSX Release Date](https://img.shields.io/open-vsx/release-date/fogio/jetbrains-dashboard?style=for-the-badge&color=%23c260ef&label=RELEASE%20DATE)

---

## Screenshots

### Dashboard

Project list with pinned projects, search, quick actions, and theme customization — adapts to any VS Code color theme.

![JetBrains Dashboard — Dark Theme](https://raw.githubusercontent.com/fogio-org/vscode-jetbrains-dashboard/master/resources/screenshots/dashboard-dark.png)

![JetBrains Dashboard — Light Theme](https://raw.githubusercontent.com/fogio-org/vscode-jetbrains-dashboard/master/resources/screenshots/dashboard-light.png)

### Status Bar

Click the `$(home)` icon in the status bar to open the dashboard at any time.

![Status Bar Button](https://raw.githubusercontent.com/fogio-org/vscode-jetbrains-dashboard/master/resources/screenshots/status-bar-button.png)

---

## Features

- **Project list** — recent projects sorted by last opened, with hash-colored avatars (like JetBrains)
- **Pin projects** — pinned projects stick to the top with a visual divider
- **Search** — filter projects by name or path
- **Quick actions** — New Project, Open, Clone Repository
- **Customize** — Color Theme, Keymap, Plugins
- **One-click theme pack** — install and activate `fogio.jetbrains-color-theme`, `fogio.jetbrains-file-icon-theme`, `fogio.jetbrains-product-icon-theme` together
- **Status bar button** — `$(home)` icon in status bar, one click to open dashboard
- **Startup auto-open** — shows automatically when no folder is open (configurable)
- **Show on empty** — optionally reopen dashboard when all editor tabs are closed (like JetBrains)
- **Theme-aware** — adapts to any VS Code color theme via CSS variables

Part of the JetBrains-for-VS-Code suite:

| Extension | Description |
| --- | --- |
| [JetBrains New UI Color Theme](https://marketplace.visualstudio.com/items?itemName=fogio.jetbrains-color-theme) | Editor and UI colors |
| [JetBrains New UI File Icon Theme](https://marketplace.visualstudio.com/items?itemName=fogio.jetbrains-file-icon-theme) | File and folder icons |
| [JetBrains New UI Product Icon Theme](https://marketplace.visualstudio.com/items?itemName=fogio.jetbrains-product-icon-theme) | Activity bar and UI icons |
| **JetBrains Dashboard** (this extension) | Welcome screen and project manager |

## Getting Started

1. **Install** from the [Marketplace](https://marketplace.visualstudio.com/items?itemName=fogio.jetbrains-dashboard)
2. **Open VS Code without a folder** — the dashboard appears automatically
3. **Or** press `Cmd+Shift+P` → `JetBrains Dashboard: Open`

## Project List

Each project shows:

- **Avatar** — first letter in a colored circle, color derived from project name hash (same algorithm as JetBrains)
- **Name** — folder name
- **Path** — full path, truncated from the left
- **Relative time** — "2 hours ago", "Yesterday", "3 days ago"

**Hover actions:**

- Open in new window
- Pin / Unpin
- Remove from list

**Keyboard:**

- `Enter` — open project (hold `Cmd/Ctrl` for new window)
- `Delete` / `Backspace` — remove from list

Projects that no longer exist on disk are shown as struck-through. Clicking shows a prompt to remove.

## Commands

| Command | Description |
| --- | --- |
| JetBrains Dashboard: Open | Open the dashboard panel |
| JetBrains Dashboard: Pin Project | Toggle pin via QuickPick |
| JetBrains Dashboard: Add Project to List | Add a folder to the manual project list |
| JetBrains Dashboard: Clear Project History | Wipe all project metadata |

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `fogioDashboard.showOnStartup` | `true` | Show dashboard on startup when no folder is open |
| `fogioDashboard.showWhenNoEditors` | `false` | Show dashboard automatically when all editor tabs are closed |
| `fogioDashboard.projectsSource` | `"recentlyOpened"` | Source: `"recentlyOpened"`, `"manual"`, or `"both"` |
| `fogioDashboard.maxProjects` | `25` | Maximum number of projects to display |

## Build

```bash
npm install
npm run build      # production bundle
npm run watch      # dev mode with auto-rebuild
```

Press `F5` in VS Code to launch the Extension Development Host.

## License

MIT
