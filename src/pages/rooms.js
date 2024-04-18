import React from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function Rooms({ rooms, setCurrentRoom }) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Typography variant="h2">Rooms</Typography>
        {rooms.map((room) => (
          <Grid item key={room.id}>
            <Button
              variant="contained"
              onClick={() => setCurrentRoom(room.name)}
            >
              {room.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

Rooms.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  setCurrentRoom: PropTypes.func.isRequired,
};
