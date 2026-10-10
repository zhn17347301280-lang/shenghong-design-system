declare module '*.css';
declare module '*.svg?raw' {
  const source: string;
  export default source;
}
declare module '*.png?inline' {
  const url: string;
  export default url;
}
