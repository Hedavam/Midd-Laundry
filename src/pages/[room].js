import React, { useState, useEffect } from "react";
import UserForm from "@/components/UserForm";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Machine from "../components/Machine";
import Calendar from "../components/Calendar";

export default function Room({ currentRoom, setCurrentRoom }) {
  /* will fetch something that looks similar to this using info passed down about the currentRoomId, will have to adjust inUse as we have separate loads table for this */
  const [machines, setMachines] = useState([]);
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    // fetch machines for the current room
    const fetchMachines = async () => {
      try {
        const response = await fetch(`/api/rooms/${currentRoom.id}/loads`);
        if (response.ok) {
          const machinesData = await response.json();
          const updatedMachines = machinesData.map((machine) => ({
            ...machine,
            inUse: !!machine.loads.length > 0, // Set 'inUse' based on the presence of active load
          }));
          setMachines(updatedMachines);
        } else {
          setMachines([]);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching machines:", error);
      }
    };

    // fetch loads for the current room
    const fetchLoads = async () => {
      try {
        const response = await fetch(`/api/rooms/${currentRoom.id}/allLoads`);
        if (response.ok) {
          const loadsData = await response.json();
          setLoads(loadsData);
        } else {
          setLoads([]);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching loads:", error);
      }
    };

    if (currentRoom) {
      fetchMachines();
      fetchLoads();
    }

    // Set up interval to call fetchMachines every minute
    const intervalId = setInterval(fetchMachines, 60000);

    // Clean up interval on component unmount
    // eslint-disable-next-line consistent-return
    return () => clearInterval(intervalId);
  }, [currentRoom]);

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
      inUse: !!loadInfo.Duration,
      OutOfOrder: loadInfo.OutOfOrder,
    };

    // Update the machines state with the updated machines array
    setMachines(updatedMachines);
    setSelectedMachine(null);
    setShowUserForm(false);
  };

  return (
    currentRoom && (
      <Grid container spacing={2} justifyContent="center">
        {/* Render UserForm as a popup */}
        {showUserForm && (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              zIndex: 999,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
            }}
          >
            <UserForm
              id={selectedMachine}
              RoomId={currentRoom.id}
              Type={
                machines.find((machine) => machine.id === selectedMachine)?.Type
              }
              MachineNum={
                machines.find((machine) => machine.id === selectedMachine)
                  ?.MachineNum
              }
              OutOfOrder={
                machines.find((machine) => machine.id === selectedMachine)
                  ?.OutOfOrder
              }
              inUse={
                machines.find((machine) => machine.id === selectedMachine)
                  ?.inUse
              }
              onClose={handleCloseForm}
              onSubmit={handleFormSubmit}
            />
          </Box>
        )}
        <Grid item xs={12}>
          <Button variant="outlined" onClick={() => setCurrentRoom(null)}>
            Back to Rooms
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h2" align="center">
            {currentRoom.Name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            Washers
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" data-testid="washer">
            {machines
              .filter((machine) => machine.Type === "washer")
              .sort((a, b) => a.MachineNum - b.MachineNum)
              .map((washer) => (
                <Machine
                  key={washer.id}
                  id={washer.id}
                  MachineNum={washer.MachineNum}
                  type={washer.Type}
                  inUse={washer.inUse}
                  OutOfOrder={washer.OutOfOrder}
                  onClick={toggleMachine}
                />
              ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            Dryers
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" data-testid="dryer">
            {machines
              .filter((machine) => machine.Type === "dryer")
              .sort((a, b) => a.MachineNum - b.MachineNum)
              .map((dryer) => (
                <Machine
                  data-testid="dryer"
                  key={dryer.id}
                  id={dryer.id}
                  MachineNum={dryer.MachineNum}
                  type={dryer.Type}
                  inUse={dryer.inUse}
                  OutOfOrder={dryer.OutOfOrder}
                  onClick={toggleMachine}
                />
              ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            Most/Least Busy Times
          </Typography>
          <Calendar loads={loads} />
        </Grid>
      </Grid>
    )
  );
}

Room.propTypes = {
  pageProps: PropTypes.shape({}),
  currentRoom: PropTypes.shape({
    id: PropTypes.number.isRequired,
    Name: PropTypes.string.isRequired,
  }),
  setCurrentRoom: PropTypes.func,
};
