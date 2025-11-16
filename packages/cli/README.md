# @blueprintjs/cli

Interactive CLI for installing and managing Blueprint in your project.

## Installation

```bash
npx @blueprintjs/cli install
```

## Commands

### `install`

Install Blueprint in your project with your choice of SCSS or CSS.

**Interactive mode (recommended):**
```bash
npx @blueprintjs/cli install
```

**Non-interactive with options:**
```bash
npx @blueprintjs/cli install --format=scss --path=./src/styles
npx @blueprintjs/cli install --format=css --path=./src/styles --yes
```

**Options:**
- `--format <format>` - Stylesheet format: `scss` or `css`
- `--path <path>` - Installation path (default: `./src/styles`)
- `--yes, -y` - Skip prompts and use defaults

## Features

### SCSS Mode

- Copies customizable `tokens.scss` to your project
- Creates `blueprint.scss` import file
- Full compile-time theming support
- Arithmetic operations work: `$pt-spacing * 2`

### CSS Mode

- Copies pre-generated `tokens.css` with CSS custom properties
- Runtime theming support with CSS variables
- Easy theme overrides by changing CSS variables anywhere in your app
- No build-time compilation needed

## Usage

After installation, import Blueprint in your app:

**SCSS:**
```scss
// app.scss
@import './src/styles/blueprint.scss';
```

**CSS:**
```css
/* app.css */
@import './src/styles/blueprint.css';
```

Then use Blueprint components:
```tsx
import { Button } from '@blueprintjs/core';

function App() {
    return <Button intent="primary">Click me</Button>;
}
```

## License

Apache-2.0 © Palantir Technologies
