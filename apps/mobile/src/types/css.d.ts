/// <reference types="expo/types" />

// CSS Modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Global CSS
declare module '@/global.css' {
  const content: string;
  export default content;
}
