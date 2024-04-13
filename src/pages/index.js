import React, { useState } from "react";
import UserForm from "@/components/UserForm";
import Head from "next/head";
import PropTypes from "prop-types";
import styles from "@/styles/Home.module.css";
import Machine from "../components/Machine";

export default function Home() {
  const [machines, setMachines] = useState([
    { id: 1, num: 1, type: "washer", inUse: false, outOfOrder: false },
    { id: 2, num: 2, type: "washer", inUse: false, outOfOrder: false },
    { id: 3, num: 3, type: "washer", inUse: false, outOfOrder: false },
    { id: 4, num: 4, type: "washer", inUse: false, outOfOrder: false },
    { id: 5, num: 1, type: "dryer", inUse: false, outOfOrder: false },
    { id: 6, num: 2, type: "dryer", inUse: false, outOfOrder: false },
    { id: 7, num: 3, type: "dryer", inUse: false, outOfOrder: false },
    { id: 8, num: 4, type: "dryer", inUse: false, outOfOrder: false },
  ]);

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);

  const toggleMachine = (id) => {
    setSelectedMachine(id);
    setShowUserForm(true); // Show the UserForm when a machine is clicked
  };

  const handleCloseForm = () => {
    setSelectedMachine(null);
    setShowUserForm(false); // Close the UserForm
  };

  const handleFormSubmit = (loadInfo) => {
    // Find the index of the selected machine by its id
    const selectedMachineIndex = machines.findIndex(
      (machine) => machine.id === selectedMachine,
    );
    const updatedMachines = [...machines];

    // Toggle the inUse state of the selected machine
    updatedMachines[selectedMachineIndex] = {
      ...updatedMachines[selectedMachineIndex],
      inUse: !!loadInfo.duration,
      outOfOrder: loadInfo.outOfOrder,
    };

    // Update the machines state with the updated machines array
    setMachines(updatedMachines);

    // eslint-disable-next-line no-console
    console.log("Submitted load info:", loadInfo);
    setMachines(updatedMachines);
    setSelectedMachine(null);
    setShowUserForm(false);
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
              .filter((machine) => machine.type === "washer")
              .map((washer) => (
                <Machine
                  key={washer.id}
                  id={washer.id}
                  num={washer.num}
                  type={washer.type}
                  inUse={washer.inUse}
                  outOfOrder={washer.outOfOrder}
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
                <Machine
                  key={dryer.id}
                  id={dryer.id}
                  num={dryer.num}
                  type={dryer.type}
                  inUse={dryer.inUse}
                  outOfOrder={dryer.outOfOrder}
                  onClick={toggleMachine}
                />
              ))}
          </div>
        </div>
        {/* Render UserForm as a popup */}
        {showUserForm && (
          <div className={styles.popup}>
            <UserForm
              machineId={selectedMachine}
              machineType={
                machines.find((machine) => machine.id === selectedMachine)?.type
              }
              machineNum={
                machines.find((machine) => machine.id === selectedMachine)?.num
              }
              outOfOrder={
                machines.find((machine) => machine.id === selectedMachine)
                  ?.outOfOrder
              }
              onClose={handleCloseForm}
              onSubmit={handleFormSubmit}
            />
          </div>
        )}
      </main>
    </>
  );
}

Home.propTypes = {
  pageProps: PropTypes.shape({}),
};
