import React, { useEffect, useState } from 'react';

import { IdProvider } from '@radix-ui/react-id';
import { DefaultSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';

import chaptersData from '../../types/ChaptersData';
import { getAllChaptersData } from '../utils/chapter';

import AudioPlayer from 'src/components/AudioPlayer/AudioPlayer';
import DeveloperUtility from 'src/components/DeveloperUtility/DeveloperUtility';
import Footer from 'src/components/dls/Footer/Footer';
import ToastContainerProvider from 'src/components/dls/Toast/ToastProvider';
import FontPreLoader from 'src/components/Fonts/FontPreLoader';
import GlobalListeners from 'src/components/GlobalListeners';
import Navbar from 'src/components/Navbar/Navbar';
import OneTimePopup from 'src/components/OneTimePopup/OneTimePopup';
import ThirdPartyScripts from 'src/components/ThirdPartyScripts/ThirdPartyScripts';
import DataContext from 'src/contexts/DataContext';
import ReduxProvider from 'src/redux/Provider';
import ThemeProvider from 'src/styles/ThemeProvider';
import { API_HOST } from 'src/utils/api';
import { logAndRedirectUnsupportedLogicalCSS } from 'src/utils/css';
import * as gtag from 'src/utils/gtag';
import { getDir } from 'src/utils/locale';
import { createSEOConfig } from 'src/utils/seo';
import 'src/styles/reset.scss';
import 'src/styles/fonts.scss';
import 'src/styles/theme.scss';
import 'src/styles/global.scss';
import 'src/styles/variables.scss';

function MyApp({ Component, pageProps }): JSX.Element {
  const router = useRouter();
  const { locale } = router;
  const [chapterData, setChapterData] = useState<chaptersData>();
  const { t } = useTranslation('common');
  // listen to in-app changes of the locale and update the HTML dir accordingly.
  useEffect(() => {
    document.documentElement.dir = getDir(locale);
    logAndRedirectUnsupportedLogicalCSS();
    const getChapterData = async () => {
      const data = await getAllChaptersData(locale);
      setChapterData(data);
    };
    getChapterData();
  }, [locale]);

  // Record page view to Google analytics when user navigate to a new page.
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageView(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="192x192" href="/images/logo/Logo@192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href={API_HOST} />
      </Head>
      <FontPreLoader locale={locale} />
      <ReduxProvider locale={locale}>
        <ThemeProvider>
          <IdProvider>
            <ToastContainerProvider>
              <DefaultSeo {...createSEOConfig({ locale, description: t('default-description') })} />
              <GlobalListeners />
              <Navbar />
              <DeveloperUtility />
              <Component {...pageProps} />
              <DataContext.Provider value={chapterData}>
                <AudioPlayer />
              </DataContext.Provider>
              <Footer />
              <OneTimePopup />
            </ToastContainerProvider>
          </IdProvider>
        </ThemeProvider>
      </ReduxProvider>

      <ThirdPartyScripts />
    </>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
