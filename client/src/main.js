import { createApp } from "vue";
import App from "./App.vue";
import ToastContainer from "./components/ToastContainer.vue";
import "./index.css";

import Spinner from "./components/Spinner.vue";

const Toast = {
	toastContainer: null,
	install(app, options) {
		app.config.globalProperties.toast = (text) => {
			if (!this.toastContainer) {
				const div = document.createElement("div");
				document.body.appendChild(div);
				this.toastContainer = createApp(ToastContainer).mount(div);
			}
			this.toastContainer.push({ text });
		};
	},
};

const app = createApp(App);
app.component("Spinner", Spinner);
app.use(Toast);
app.mount("#app");
