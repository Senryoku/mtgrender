import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";

import Spinner from "./components/Spinner.vue";

const app = createApp(App);
app.component("Spinner", Spinner);
app.mount("#app");
