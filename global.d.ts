declare const __DEV__: boolean;
declare const __IS_WEBPACK__: boolean;
declare const __IS_VITE__: boolean;
declare const __IS_CRXJS__: boolean;

declare module '*?script';
declare module '*?script&module';

// declare module '*.css' {
//   const url: string;
//   export default url;
// }
// declare module '*.scss' {
//   const url: string;
//   export default url;
// }
// declare module '*.sass' {
//   const url: string;
//   export default url;
// }
// declare module '*.styl' {
//   const url: string;
//   export default url;
// }

// /** Maps authored classNames to their CSS Modules -suffixed generated classNames. */
// interface Mapping {
//   [key: string]: string;
// }
// declare module '*.module.css' {
//   const mapping: Mapping;
//   export default mapping;
// }
// declare module '*.module.scss' {
//   const mapping: Mapping;
//   export default mapping;
// }
// declare module '*.module.sass' {
//   const mapping: Mapping;
//   export default mapping;
// }
// declare module '*.module.styl' {
//   const mapping: Mapping;
//   export default mapping;
// }

// declare module '*.css';

// declare module '*.scss' {
//   const classes: { [key: string]: string };
//   export default classes;
// }

// declare module '*.css' {
//   const classes: { [key: string]: string };
//   export default classes;
// }

// declare module '*.scss' {
//   const content: Record<string, string>;
//   export default content;
// }

// declare module '*.css' {
//   const content: Record<string, string>;
//   export default content;
// }

// declare module "*.svg" {
//   import React = require("react");
//   export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
//   const src: string;
//   export default src;
// }

// declare module "*.svg" {
//   import React = require("react");
//   export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>; //SFC
//   const src: string;
//   export default src;
// }

// declare module "*.svg" {
//   import * as React from "react";

//   export const ReactComponent: React.FunctionComponent<
//     React.SVGProps<SVGSVGElement> & { title?: string }
//   >;
// }

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: string;
  export default content;
}

// namespace NodeJS {
//   interface ProcessEnv {
//     NODE_ENV: string;
//     PORT: string;
//     MONGO_URI: string;
//     TOOLBAR_OPEN: string;
//     SIDEBAR_OPEN: string;
//   }
// }
