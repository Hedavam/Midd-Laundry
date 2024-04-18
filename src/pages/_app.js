/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Head from "next/head";
import Rooms from "@/components/Rooms";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const [rooms, setRooms] = useState([
    { id: 1, name: "forest" },
    { id: 2, name: "battell" },
    { id: 3, name: "atwater" },
  ]);

  const [showRooms, setShowRooms] = useState();

  const handleRoomClick = (roomName) => {
    router.push(`/${roomName}`);
    setShowRooms(false);
  };

  const props = {
    ...pageProps,
    rooms,
    setRooms,
    showRooms,
    setShowRooms,
    handleRoomClick,
  };

  return (
    <div>
      <Head>
        <title>Laundry Availability</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {showRooms && <Rooms {...props} />}
        <Component {...props} />
      </main>
    </div>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.shape({}),
};
