/// <reference types="vite/client" />

// Allows TypeScript to understand PDF asset imports (Vite serves them as URLs)
declare module "*.pdf" {
  const src: string;
  export default src;
}
