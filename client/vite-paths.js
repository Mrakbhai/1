// vite-paths.js
import { resolve } from 'path';

/**
 * A custom plugin to resolve '@/' path aliases
 */
export function resolvePaths() {
  return {
    name: 'resolve-paths',
    resolveId(source) {
      if (source.startsWith('@/')) {
        return resolve(__dirname, 'src', source.substring(2));
      }
      return null;
    }
  };
}