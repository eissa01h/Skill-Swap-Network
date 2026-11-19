import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rollupNativeJs = path.resolve(__dirname, '../node_modules/rollup/dist/native.js');

if (fs.existsSync(rollupNativeJs)) {
  let content = fs.readFileSync(rollupNativeJs, 'utf8');
  if (!content.includes("@rollup/wasm-node/dist/native.js")) {
    const target = `const nativeModule = requireWithFriendlyError(
\texistsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`
);`;
    const replacement = `let nativeModule;
try {
\tnativeModule = requireWithFriendlyError(
\t\texistsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`
\t);
} catch (e) {
\ttry {
\t\tnativeModule = require('@rollup/wasm-node/dist/native.js');
\t} catch {
\t\tthrow e;
\t}
}`;
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      fs.writeFileSync(rollupNativeJs, content, 'utf8');
      console.log('Successfully patched rollup for Windows WASM fallback.');
    }
  }
}

