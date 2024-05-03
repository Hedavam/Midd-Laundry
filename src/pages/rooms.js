import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";

export default function Rooms({
  rooms,
  setCurrentRoom,
  favoriteRoom,
  setFavoriteRoom,
}) {
  // Sort the rooms array based on whether a room is favorited or not
  const sortedRooms = rooms.slice().sort((a, b) => {
    if (a.Name === favoriteRoom) return -1;
    if (b.Name === favoriteRoom) return 1;
    return a.Name.localeCompare(b.Name); // Alphabetical sorting
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Typography variant="h2">Rooms</Typography>
        {sortedRooms.map((room) => (
          <Grid item key={room.id}>
            <Button
              variant="contained"
              onClick={() => setCurrentRoom(room.Name)}
              sx={{ width: "100px" }}
            >
              {room.Name}
            </Button>
            <IconButton onClick={() => setFavoriteRoom(room.Name)}>
              {favoriteRoom === room.Name ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>
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
  favoriteRoom: PropTypes.string,
  setFavoriteRoom: PropTypes.func.isRequired,
};
