import React from "react";
import Document, {Html, Main, Head, NextScript} from "next/document";
import {ServerStyleSheets} from "@material-ui/styles";

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        // const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
        // return {pageProps};
        const sheets = new ServerStyleSheets();
        const originalRenderPage = ctx.renderPage;

        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
            });

        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            // Styles fragment is rendered after the app and page rendering finish.
            styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
        };
    }

    render() {
        return (
            // <Html lang="en">
            //     <Head>
            //         {/* PWA primary color */}
            //         {/*<meta name="theme-color" content={theme.palette.primary.main} />*/}
            //     </Head>
            //     <body>
            //     <Main />
            //     <NextScript />
            //     </body>
            // </Html>

            <Html>
                <Head />
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
