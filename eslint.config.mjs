import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Next.js 앱으로 전환하며 남은 Vite 데모 진입점은 현재 런타임에서 사용하지 않는다.
    "src/App.tsx",
    "src/main.tsx",
    "src/router.tsx",
    "src/pages/**",
    "vite.config.ts",
  ]),
]);

export default eslintConfig;
