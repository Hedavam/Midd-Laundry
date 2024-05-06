/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import Cookies from "js-cookie";
import Head from "next/head";
import theme from "../material/theme";

export default function App(appProps) {
  const { Component, pageProps } = appProps;

  const router = useRouter();

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms");
        if (response.ok) {
          const roomsData = await response.json();
          setRooms(roomsData);
        } else {
          setRooms([]);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const [currentRoom, setCurrentRoom] = useState();

  const [favoriteRoom, setFavoriteRoom] = useState();

  /* probably will need to setCurrentRoomId (state) & pass down to [room].js, so that in that file, we can fetch necessary machines */
  useEffect(() => {
    const roomFromQuery = router.query.room;
    const roomObject = rooms.find((object) => object.Name === roomFromQuery);
    if (roomFromQuery) {
      setCurrentRoom(roomObject);
    }
  }, [router.query.room, rooms]);

  const handleSetCurrentRoom = (room) => {
    const roomObject = rooms.find((object) => object.Name === room);
    if (room) {
      router.push(`/${room}`);
      setCurrentRoom(roomObject);
    } else {
      router.push("/rooms");
      setCurrentRoom(null);
    }
  };

  useEffect(() => {
    const favoriteRoomName = Cookies.get("favoriteRoom");
    if (favoriteRoomName !== "null") {
      setFavoriteRoom(favoriteRoomName);
      if (router.asPath === "/rooms") {
        handleSetCurrentRoom(favoriteRoomName);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFavoriteClick = (room) => {
    const newFavoriteRoom = favoriteRoom === room ? null : room;
    setFavoriteRoom(newFavoriteRoom);
    Cookies.set("favoriteRoom", newFavoriteRoom);
  };

  const props = {
    ...pageProps,
    rooms,
    setRooms,
    currentRoom,
    setCurrentRoom: handleSetCurrentRoom,
    favoriteRoom,
    setFavoriteRoom: handleFavoriteClick,
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
