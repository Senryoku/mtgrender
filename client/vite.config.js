import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import compress from "vite-plugin-compress";

export default defineConfig({
	build: {
		target: ["es2020"],
	},
	assetsInclude: ["**/*.png"],
	plugins: [vue()/*, compress({ brotli: false })*/],
});
