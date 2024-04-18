/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import Head from "next/head";
import theme from "../material/theme";
import "@/styles/globals.css";

export default function App(appProps) {
  const { Component, pageProps } = appProps;

  const router = useRouter();

  const [rooms, setRooms] = useState([
    { id: 1, name: "forest" },
    { id: 2, name: "battell" },
    { id: 3, name: "atwater" },
  ]);

  const [currentRoom, setCurrentRoom] = useState();

  useEffect(() => {
    const roomFromQuery = router.query.room;
    if (roomFromQuery) {
      setCurrentRoom(roomFromQuery);
    }
  }, [router.query.room]);

  const handleSetCurrentRoom = (room) => {
    if (room) {
      router.push(`/${room}`);
      setCurrentRoom(room);
    } else {
      router.push("/rooms");
      setCurrentRoom(null);
    }
  };

  const props = {
    ...pageProps,
    rooms,
    setRooms,
    currentRoom,
    setCurrentRoom: handleSetCurrentRoom,
  };

  return (
    <AppCacheProvider {...appProps}>
      <Head>
        <title>Laundry Availability</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <main>
          <Component {...props} />
        </main>
      </ThemeProvider>
    </AppCacheProvider>
  );
}

App.propTypes = {
  appProps: PropTypes.shape({}),
};
