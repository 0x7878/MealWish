import './index.css';
import App from './App';
import * as ReactDOM from "react-dom/client";
import * as React from "react";
import {
  createTheme,
  ThemeProvider
} from "@mui/material/styles";
import { HassContextProvider } from './HassContext';
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import "./lib/date.extension";

class MealWish extends HTMLElement {

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  connectedCallback() {

    const shadowContainer = this.attachShadow({ mode: 'open' });
    const emotionRoot = document.createElement("style");
    const shadowRootElement = document.createElement("div");
    shadowContainer.appendChild(emotionRoot);
    shadowContainer.appendChild(shadowRootElement);

    const cache = createCache({
      key: "css",
      prepend: true,
      container: emotionRoot
    });

    const shadowTheme = createTheme({
      palette: {
        mode: 'dark',
      },
      components: {
        MuiPopover: {
          defaultProps: {
            container: shadowRootElement
          }
        },
        MuiPopper: {
          defaultProps: {
            container: shadowRootElement
          }
        },
        MuiModal: {
          defaultProps: {
            container: shadowRootElement
          }
        }
      }
    });

    ReactDOM.createRoot(shadowRootElement).render(
      <React.StrictMode>
        <CacheProvider value={cache}>
          <ThemeProvider theme={shadowTheme}>
            <HassContextProvider appInstance={this}>
              <App />
            </HassContextProvider>
          </ThemeProvider>
        </CacheProvider>
      </React.StrictMode>
    );
  }
}

customElements.define("meal-wish",MealWish)

//Provide a fake hass object for testing
setTimeout(() => {
  const app = document.getElementsByTagName("meal-wish")[0] as any;
  app.hass = {user: {name: "Anton Davaria"}};
}, 2000);