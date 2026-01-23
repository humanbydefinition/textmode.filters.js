/// <reference types="vite/client" />

// Declare module for raw shader imports
declare module '*.frag' {
	const content: string;
	export default content;
}

declare module '*.vert' {
	const content: string;
	export default content;
}

declare module '*.glsl' {
	const content: string;
	export default content;
}
