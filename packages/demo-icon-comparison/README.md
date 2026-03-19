# Blueprint Icon Comparison Demo App

A dedicated tool for comparing old Blueprint icons with the new Figma design (ShrimpClub) to identify which icons changed from filled to outlined style.

**Live Demo**: [View on GitHub Pages](https://palantir.github.io/blueprint/demo-icon-comparison/)

## Features

- **Side-by-Side Comparison**: View current Blueprint icon (left) vs new Figma icon (right)
- **Grid View**: All 694 Blueprint icons displayed in a searchable grid
- **"Unfilled" Badge**: Automatically or manually tag icons that changed from filled to outlined
- **Manual Tag Editing**: Click to add/remove "unfilled" badge on any icon
- **Visual Indicators**: Different badge styles for auto-detected vs manually tagged icons
- **Search & Filter**: Search icons by name, filter to show only unfilled icons
- **Export Functionality**: Export tagged icons as JSON or CSV for reporting
- **Persistent State**: Manual tags saved to localStorage

## Quick Start

### Prerequisites

- Node.js 20+ and pnpm installed
- Access to the Blueprint monorepo

### Setup

```bash
# From the root of the Blueprint repo
cd packages/demo-icon-comparison

# Install dependencies (if not already done)
pnpm install

# Start the dev server
pnpm dev
```

The app will open at **http://localhost:3001/**

### Environment Variables (Optional)

If you need to fetch icons from Figma:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Get your Figma Personal Access Token:
   - Go to https://www.figma.com/settings
   - Under "Personal access tokens", click "Create new token"
   - Copy the token

3. Add it to your `.env` file:
   ```
   FIGMA_PERSONAL_ACCESS_TOKEN=your_token_here
   ```

**IMPORTANT**: Never commit your `.env` file or expose your Figma token!

## Usage

### Reviewing Icons

1. Browse the grid of all 694 Blueprint icons
2. Each card shows:
   - Current Blueprint icon (left)
   - New Figma design (right)
   - Icon name below
   - Toggle button to mark as "unfilled"

### Tagging Icons

**Manual Tagging:**
- Click "Mark as 'unfilled'" to add the badge
- Click "Remove 'unfilled'" to remove it
- Manual tags show as blue badges with "(manual)" label

**Auto-Detection:**
- The system attempts to auto-detect filled→outlined changes
- Auto-detected tags show as orange badges

### Filtering

- Use the search box to find specific icons
- Click "Show unfilled only" to filter the view
- Total and unfilled counts shown in the header

### Exporting Results

1. Tag all icons that changed from filled to outlined
2. Click "Export JSON" or "Export CSV" in the header
3. Share the exported file with your team

## Data

- **Current Icons**: Loaded from `@blueprintjs/icons` package (694 icons)
- **New Icons**: Loaded from `/public/new-icons/` directory (702 SVG files from Figma)
- **Manual Overrides**: Saved to localStorage (`icon-comparison-overrides`)

## Deployment

This app is automatically deployed to GitHub Pages when changes are pushed to the `develop` or `main` branch.

### Manual Deployment

To deploy manually:

```bash
# Build the production bundle
cd packages/demo-icon-comparison
NODE_ENV=production pnpm build

# The built files will be in the dist/ directory
# These can be deployed to any static hosting service
```

### GitHub Pages Setup

1. Push your changes to the `develop` or `main` branch
2. The GitHub Actions workflow will automatically build and deploy
3. Enable GitHub Pages in repository settings:
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. The app will be available at: `https://[org].github.io/blueprint/demo-icon-comparison/`

## Development

### Project Structure

```
packages/demo-icon-comparison/
├── src/
│   ├── components/
│   │   └── IconComparisonCard.tsx   # Individual icon comparison card
│   ├── utils/
│   │   └── iconAnalysis.ts          # Style detection & export utilities
│   ├── types.ts                     # TypeScript interfaces
│   ├── App.tsx                      # Main application component
│   └── index.tsx                    # Entry point
├── public/
│   ├── new-icons/                   # 702 new Figma icon SVGs
│   └── index.html
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## Troubleshooting

### CSS Modules Error: "Cannot read properties of undefined"

**Problem**: When running the dev server, you get a runtime error like:
```
Cannot read properties of undefined (reading 'appContainer')
Cannot read properties of undefined (reading 'className')
```

**Root Cause**: This occurs with css-loader version 7.x or higher. The css-loader changed from CommonJS exports (default export = classNames object) to ES Module exports (named exports). When you import CSS Modules like:
```typescript
import styles from './styles.module.scss';
```

The `styles` object is `undefined` because the classNames are now exported as named exports instead of on the default export.

**Solution**: Add `esModule: false` to the css-loader options in `webpack.config.js`:

```javascript
{
  loader: 'css-loader',
  options: {
    esModule: false,  // Forces CommonJS exports
    modules: {
      localIdentName: '[name]__[local]--[hash:base64:5]',
    },
  },
}
```

This configuration is already in place in this project's webpack config. If you see this error, verify the `esModule: false` setting hasn't been removed.

**When This Occurs**:
- After upgrading css-loader to version 7.x or higher
- Starting a new project with latest css-loader
- Copying webpack config without the esModule setting

## Security

### Token Management

**NEVER commit tokens or secrets to git!**

This project uses environment variables for sensitive data:
- Figma tokens should be stored in `.env` (which is gitignored)
- A `.env.example` template is provided for reference
- The `.claude/` directory (which may contain tokens) is excluded from git

### If You've Exposed a Token

If you accidentally committed a token:
1. **Revoke the token immediately** in Figma settings
2. Generate a new token
3. Update your local `.env` file with the new token
4. Never commit the `.env` file

### Best Practices

- Use `.env` files for local development tokens
- Add `.env` to `.gitignore` (already configured)
- Use GitHub Secrets for CI/CD workflows
- Review files before committing: `git diff --cached`
- Use `.env.example` to document required variables without exposing values
