import { vi } from 'vitest';
import type { TextmodeFramebuffer } from 'textmode.js';

export function framebuffer(width = 80, height = 40): TextmodeFramebuffer {
	const texture = {} as WebGLTexture & { owner?: TextmodeFramebuffer };
	const result = {
		width,
		height,
		attachmentCount: 1,
		textures: [texture],
		begin: vi.fn(),
		end: vi.fn(),
		resize: vi.fn(function (this: { width: number; height: number }, nextWidth: number, nextHeight: number) {
			this.width = nextWidth;
			this.height = nextHeight;
		}),
		dispose: vi.fn(),
	} as unknown as TextmodeFramebuffer;
	texture.owner = result;
	return result;
}
