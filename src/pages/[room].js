import React, { useState } from "react";
import UserForm from "@/components/UserForm";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Machine from "../components/Machine";

export default function Room({ currentRoom, setCurrentRoom }) {
  /* will fetch something that looks similar to this using info passed down about the currentRoomId, will have to adjust inUse as we have separate loads table for this */
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
              position: "absolute",
              top: 0,
              left: 0,
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
            {`${currentRoom.charAt(0).toUpperCase()}${currentRoom.slice(1)}`}
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
          </Box>
        </Grid>
      </Grid>
    )
  );
}

Room.propTypes = {
  pageProps: PropTypes.shape({}),
  currentRoom: PropTypes.string,
  setCurrentRoom: PropTypes.func,
};
