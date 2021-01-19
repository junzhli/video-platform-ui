import App from 'next/app';
import React from 'react';
import 'bulma/css/bulma.css';
import '@creativebulma/bulma-divider/dist/bulma-divider.min.css';
import "video.js/dist/video-js.min.css";
import "@silvermine/videojs-quality-selector/dist/css/quality-selector.css";
import "@fontsource/roboto";
// import { useStore } from '../store';
import {CssBaseline, ThemeProvider} from "@material-ui/core";
import theme from "../components/theme";
import {GlobalStateProvider} from '../store';

declare module 'react' {
  interface HTMLAttributes<T> {
      disabled?: any;
  }
}

class MyApp extends App {
  static async getInitialProps({Component, ctx}) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return {pageProps};
  }

  componentDidMount() {
    // if (!state.userMisc.userLoggedIn && props.authenticated) {
    //   dispatch(setUserIsLoggedIn(true))
    // }
    this.removeInjectedSSRCSS();
  }

  removeInjectedSSRCSS() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const {Component, pageProps} = this.props;
    // const store = useStore(pageProps.initialReduxState);

    return (
        <React.Fragment>
          {/*<Provider store={store}>*/}
          <GlobalStateProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </GlobalStateProvider>
          {/*</Provider>*/}
        </React.Fragment>

    );
  }
}

export default MyApp;
