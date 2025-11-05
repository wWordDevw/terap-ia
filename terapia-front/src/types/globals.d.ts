// Declaraciones de tipos para imports de CSS
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';

// Declaraciones específicas para side-effects
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module './globals.css';
declare module '../globals.css';
declare module './app/globals.css';