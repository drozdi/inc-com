/// <reference types="vite/client" />

declare module '*.css' {
	const classes: Record<string, string>;
	export default classes;
}

declare module '*.module.css' {
	const classes: Record<string, string>;
	export default classes;
}

declare module '*.svg' {
	const src: string;
	export default src;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
