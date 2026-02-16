import { createApp } from "vue";
import { Notify, Quasar } from "quasar";
import quasarLang from "quasar/lang/en-US";
import router from "./router/index";

// Icons
import "@quasar/extras/material-icons/material-icons.css";

// CSS Quasar
import "quasar/src/css/index.sass";

// Global styles
import "./assets/styles/globals.scss";

import App from "./App.vue";

// Boot files
import i18nBoot from "./boot/i18n";
import axiosBoot from "./boot/axios";
import a11yBoot from "./boot/a11y";

const app = createApp(App);

// Execute boot files
i18nBoot({ app });
axiosBoot({ app });
a11yBoot({ app });

app.use(Quasar, {
  plugins: { Notify },
  lang: quasarLang,
  config: {
    dark: "auto",
  },
});

app.use(router);

app.mount("#app");
