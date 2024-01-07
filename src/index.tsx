import './index.css';
import App from './App';
import * as ReactDOM from "react-dom/client";
import * as React from "react";
import {
  createTheme,
  ThemeProvider
} from "@mui/material/styles";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

class MealWish extends HTMLElement {

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
            <App />
          </ThemeProvider>
        </CacheProvider>
      </React.StrictMode>
    );
  }
}

customElements.define("meal-wish",MealWish)
