# Astryx adapter (optional)

This folder maps Cozy tokens to the token names of [Astryx](https://www.npmjs.com/package/@astryxdesign/core). Use it only if your app uses Astryx components.

**Requirements:** `@astryxdesign/core` and `@astryxdesign/theme-neutral`, version 0.7.16 or a compatible version.

```tsx
import { Theme } from '@astryxdesign/core/theme';
import { cozyTheme } from 'cozy/adapters/astryx';
import 'cozy/tokens.css'; // the adapter reads --cozy-nav-* and --cozy-radius-nav-item from this file

<Theme theme={cozyTheme} mode="light">{children}</Theme>;
```

The adapter is TypeScript source. Your bundler compiles it. There is no build step in this repository.
