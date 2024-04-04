import Head from "next/head";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styles from "@/styles/Home.module.css";
import WashingMachine from "../components/WashingMachine";
import Dryer from "../components/Dryer";

export default function Home() {
  const [machines, setMachines] = useState([
    { id: 1, num: 1, type: "washing", inUse: false },
    { id: 2, num: 2, type: "washing", inUse: false },
    { id: 3, num: 3, type: "washing", inUse: false },
    { id: 4, num: 4, type: "washing", inUse: false },
    { id: 5, num: 1, type: "dryer", inUse: false },
    { id: 6, num: 2, type: "dryer", inUse: false },
    { id: 7, num: 3, type: "dryer", inUse: false },
    { id: 8, num: 4, type: "dryer", inUse: false },
  ]);

  const toggleMachine = (id) => {
    setMachines((prevMachines) =>
      prevMachines.map((machine) => {
        if (machine.id === id) {
          return { ...machine, inUse: !machine.inUse };
        }
        return machine;
      }),
    );
  };

  return (
    <>
      <Head>
        <title>Laundry Availability</title>
      </Head>
      <main className={styles.main}>
        <h1>Laundry Availability</h1>
        <div className={styles.row}>
          <h2 style={{ textAlign: "center" }}>Washers </h2>
          <div className={styles.machines}>
            {machines
              .filter((machine) => machine.type === "washing")
              .map((washingMachine) => (
                <WashingMachine
                  key={washingMachine.id}
                  id={washingMachine.id}
                  num={washingMachine.num}
                  inUse={washingMachine.inUse}
                  onClick={toggleMachine}
                />
              ))}
          </div>
        </div>
        <div className={styles.row}>
          <h2 style={{ textAlign: "center" }}>Dryers</h2>
          <div className={styles.machines}>
            {machines
              .filter((machine) => machine.type === "dryer")
              .map((dryer) => (
                <Dryer
                  key={dryer.id}
                  id={dryer.id}
                  num={dryer.num}
                  inUse={dryer.inUse}
                  onClick={toggleMachine}
                />
              ))}
          </div>
        </div>
      </main>
    </>
  );
}

Home.propTypes = {
  pageProps: PropTypes.shape({}),
};
