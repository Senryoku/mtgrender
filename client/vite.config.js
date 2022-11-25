import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import compress from "vite-plugin-compress";

export default defineConfig({
	build: {
		target: ["esnext"],
	},
	assetsInclude: ["**/*.png"],
	plugins: [vue() /*, compress({ brotli: false })*/],
});
