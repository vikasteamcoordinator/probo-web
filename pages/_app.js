// ** Next, React And Locals Imports
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Layout from "@/Components/Layout/Layout";
import "@/styles/globals.css";
import "@/styles/progressBar.css";
import createEmotionCache from "@/mui/createEmotionCache.js";
import theme from "@/mui/theme.js";

// ** MUI Imports
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";

// ** Third Party Imports
import NProgress from "nprogress";
import { appWithTranslation } from "next-i18next";

// ** Redux store
import store from "@/Redux/store";

// ** Apollo client
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
  cache: new InMemoryCache(),
  credentials: "include",
});

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const router = useRouter();

  // Layout
  const [layout, setLayout] = useState(true);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  // Google Analytics Tracking Code
  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Layout Condition
  useEffect(() => {
    // Pages that don't need header & footer
    const pages = [
      "login",
      "register",
      "forgot-password",
      "reset-password",
      "checkout",
      "payment",
      "404",
    ];
    const currentPage = router.pathname.split("/")[1];

    if (pages.includes(currentPage)) {
      setLayout(false);
    } else {
      setLayout(true);
    }
  }, [router.asPath]);

  // NProgress
  useEffect(() => {
    router.events.on("routeChangeStart", () => NProgress.start());
    router.events.on("routeChangeComplete", () => NProgress.done());
    router.events.on("routeChangeError", () => NProgress.done());
  }, []);

  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <ApolloProvider client={client}>
            <Provider store={store}>
              <CssBaseline />
              {layout ? (
                <Layout
                  page={<Component {...pageProps} />}
                  isAuth={pageProps.isAuth}
                />
              ) : (
                <Component {...pageProps} />
              )}
            </Provider>
          </ApolloProvider>
        </ThemeProvider>
      </CacheProvider>
    </div>
  );
}

export default appWithTranslation(MyApp);
