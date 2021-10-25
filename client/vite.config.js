import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	build: {
		target: ["es2020"],
	},
	assetsInclude: ["**/*.png"],
	plugins: [vue()],
});
