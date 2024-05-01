import React, { useState, useEffect } from "react";
import UserForm from "@/components/UserForm";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Machine from "../components/Machine";

export default function Room({ currentRoom, setCurrentRoom }) {
  /* will fetch something that looks similar to this using info passed down about the currentRoomId, will have to adjust inUse as we have separate loads table for this */
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    /* Early exit if currentRoom or its id is undefined */
    if (!currentRoom || !currentRoom.id) {
      return;
    }
    const fetchMachines = async () => {
      try {
        const response = await fetch(`/api/rooms/${currentRoom.id}`);
        if (response.ok) {
          const machinesData = await response.json();
          setMachines(machinesData);
        } else {
          setMachines(null);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching machines:", error);
      }
    };
    fetchMachines();
  }, [currentRoom]);

  // console.log(machines); /* COOL, we get what we want here!!! */

  /* TODO: Some of this logic will have to change, especially with inUse and outOfOrder */
  useEffect(() => {}, []);

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
    // loadInfo is the stuff being inputted into the form

    // Find the index of the selected machine by its id
    const selectedMachineIndex = machines.findIndex(
      (machine) => machine.id === selectedMachine,
    );
    const updatedMachines = [...machines];

    // Toggle the inUse state of the selected machine
    updatedMachines[selectedMachineIndex] = {
      ...updatedMachines[selectedMachineIndex],
      inUse: !!loadInfo.duration,
      OutOfOrder: loadInfo.OutOfOrder,
    };

    // Update the machines state with the updated machines array
    setMachines(updatedMachines);

    setMachines(updatedMachines);
    setSelectedMachine(null);
    setShowUserForm(false);
  };

  // /* Make the api call to get post this machine's load - in here? - i think in here! */
  // useEffect(() => {
  //   /* Early exit if load info being put in or its id is not defined??? */
  //   if (!selectedMachine) {
  //     return;
  //   }
  //   const postLoad = async () => {
  //     try {
  //       const response = await fetch(`/api/machines/${selectedMachine}/loads`, {
  //         /* this second arg. specifies POST request, with JSON encoded data that is expecting a JSON response */
  //         method: "POST",
  //         // body: JSON.stringify(newLoad), TODO: how do we get the new load in here?
  //         headers: new Headers({
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         }),
  //       });
  //       if (response.ok) {
  //         const loadData = await response.json();
  //         postLoad(loadData);
  //       } else {
  //         postLoad(null); // hmm
  //       }
  //     } catch (error) {
  //       // eslint-disable-next-line no-console
  //       console.error("Error posting load:", error);
  //     }
  //   };
  //   postLoad();
  // }, [
  //   selectedMachine,
  // ]); /* want to make this api call when currentRoom changes; on reload, this should trigger again */

  /* TODO: Change var. names down here */
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
            <UserForm /* TODO: Modify UserForm component! */
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
            {`${currentRoom.Name.charAt(0).toUpperCase()}${currentRoom.Name.slice(1)}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            Washers
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
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
            Dryer
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            {machines
              .filter((machine) => machine.Type === "dryer")
              .sort((a, b) => a.MachineNum - b.MachineNum)
              .map((dryer) => (
                <Machine
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
      </Grid>
    )
  );
}

Room.propTypes = {
  pageProps: PropTypes.shape({}),
  currentRoom: PropTypes.string,
  setCurrentRoom: PropTypes.func,
};
