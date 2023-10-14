import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import React from "react";
import {store} from "@/_shared/redux/store";
import { Provider } from 'react-redux';

export default function App({ Component, pageProps }: AppProps) {
  return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
  )
}
