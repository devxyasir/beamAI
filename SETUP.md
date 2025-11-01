# Beam VS Code Extension - Setup Guide

## Prerequisites

- Node.js 16+ and npm
- VS Code 1.80.0+
- Beam API server running

## Quick Setup

### 1. Install Dependencies

**Extension:**
```bash
cd beam-vscode-extension
npm install
```

**Webview:**
```bash
cd webview
npm install
cd ..
```

### 2. Build Extension

```bash
# Compile TypeScript
npm run compile

# Build React webview
npm run build-webview
```

### 3. Run in Debug Mode

1. Open `beam-vscode-extension` folder in VS Code
2. Press `F5` to start debugging
3. New VS Code window opens with extension loaded

### 4. Test the Extension

In the Extension Development Host window:

1. Click Beam icon in sidebar (or Ctrl+Shift+P → "Beam: Open Chat")
2. Type a message: "Explain this codebase"
3. Beam should respond (requires API server running)

## Development Workflow

### Watch Mode

Terminal 1 - TypeScript:
```bash
npm run watch
```

Terminal 2 - Webview:
```bash
cd webview
npm run dev
```

### Debug

1. Set breakpoints in `src/` files
2. Press `F5`
3. Breakpoints hit in Extension Development Host

### Package for Distribution

```bash
# Build production
npm run compile
npm run build-webview

# Create .vsix
npm run package

# Install
code --install-extension beam-vscode-extension-1.0.0.vsix
```

## File Structure

```
beam-vscode-extension/
├── src/
│   ├── extension.ts           # Main entry ✓
│   ├── panels/
│   │   └── BeamChatPanel.ts   # Webview manager ✓
│   ├── services/
│   │   ├── beamApiClient.ts   # API client ✓
│   │   └── messageHandler.ts  # Message processing ✓
│   ├── commands/
│   │   └── contextMenuCommands.ts # Context menu ✓
│   └── types/
│       └── beam.d.ts          # Type definitions ✓
│
├── webview/
│   ├── src/
│   │   ├── App.tsx            # Main React app ✓
│   │   ├── vscode.ts          # VS Code API wrapper ✓
│   │   ├── components/
│   │   │   ├── ChatMessage.tsx        ✓
│   │   │   ├── ChatInput.tsx          ✓
│   │   │   ├── ThinkingIndicator.tsx  ✓
│   │   │   ├── PlanView.tsx           ✓
│   │   │   ├── FileChanges.tsx        ✓
│   │   │   ├── CodeBlock.tsx          ✓
│   │   │   ├── ConfidenceBar.tsx      ✓
│   │   │   └── ActionButtons.tsx      ✓
│   │   ├── hooks/
│   │   │   └── useVSCodeMessage.ts    ✓
│   │   ├── types/
│   │   │   └── index.ts       # React types ✓
│   │   └── styles/
│   │       └── app.css        # Native VS Code styling ✓
│   ├── package.json           ✓
│   ├── vite.config.ts         ✓
│   ├── tsconfig.json          ✓
│   └── index.html             ✓
│
├── package.json               # Extension manifest ✓
├── tsconfig.json              # TS config ✓
├── README.md                  # Documentation ✓
└── SETUP.md                   # This file ✓
```

## Configuration

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "beam.apiUrl": "http://localhost:8000",
  "beam.autoApplyChanges": false,
  "beam.showConfidence": true,
  "beam.maxMessageHistory": 50
}
```

### API Server

Start Beam backend:

```bash
# In main Beam directory
python -m beam.interfaces.api

# Or
beam-server
```

Verify: `curl http://localhost:8000/health`

## Troubleshooting

### Module not found errors

These are expected before `npm install`:
- `Cannot find module 'vscode'` → Run `npm install`
- `Cannot find module 'react'` → Run `cd webview && npm install`

### Build fails

```bash
# Clean and rebuild
rm -rf node_modules out webview/node_modules webview/dist
npm install
cd webview && npm install && cd ..
npm run compile
npm run build-webview
```

### Webview blank

1. Check browser console (Help → Toggle Developer Tools)
2. Ensure webview built: `ls webview/dist/assets/index.js`
3. Rebuild: `npm run build-webview`

### Cannot connect to API

1. Check API server: `curl http://localhost:8000/health`
2. Check settings: `beam.apiUrl` in VS Code settings
3. Check network/firewall

## Testing

### Manual Testing Checklist

- [ ] Extension activates (no errors in Output)
- [ ] Sidebar icon appears
- [ ] Chat panel opens
- [ ] Can send message
- [ ] Receives response from API
- [ ] Plan view renders
- [ ] File changes display
- [ ] "Apply All" button works
- [ ] "View Diff" opens diff viewer
- [ ] Click file name opens file
- [ ] Context menu commands work
- [ ] Settings respected
- [ ] Works in light theme
- [ ] Works in dark theme

### Automated Tests (TODO)

```bash
npm test
```

## Deployment

### To Marketplace

1. Create publisher account
2. Generate Personal Access Token
3. Publish:

```bash
vsce publish
```

### To GitHub Releases

1. Tag version: `git tag v1.0.0`
2. Push: `git push --tags`
3. Package: `npm run package`
4. Attach `.vsix` to GitHub release

## Next Steps

1. ✅ Extension structure complete
2. ✅ All components created
3. ✅ Native VS Code styling
4. 🔄 Install dependencies (`npm install`)
5. 🔄 Build and test
6. 🔄 Connect to Beam API
7. 🔄 Test all features
8. 🔄 Package for distribution

## Support

Questions? Issues?
- Create issue: https://github.com/yourusername/beam/issues
- Discord: https://discord.gg/beam-ai
