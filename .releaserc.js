import { createReleaseConfig } from '@textmode/release-config';

export default createReleaseConfig({
	githubAssets: ['dist/textmode.filters.esm.js', 'dist/textmode.filters.umd.js'],
});
