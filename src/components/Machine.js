import PropTypes from "prop-types";
import Box from "@mui/material/Box";

export default function Machine({ id, num, inUse, outOfOrder, onClick }) {
  const machineStatusStyle = {
    width: "120px", // Adjust the width as needed
    height: "120px", // Adjust the height as needed
    margin: "16px", // Adjust the margin as needed for spacing
    border: "1px solid #000",
    borderRadius: "4px",
    padding: "8px",
    cursor: "pointer",
    // eslint-disable-next-line no-nested-ternary
    backgroundColor: outOfOrder ? "#ff6961" : inUse ? "#fdfd96" : "#77dd77",
  };

  return (
    <Box onClick={() => onClick(id)} sx={machineStatusStyle} component="div">
      {num}
    </Box>
  );
}

Machine.propTypes = {
  id: PropTypes.number.isRequired,
  num: PropTypes.number.isRequired,
  inUse: PropTypes.bool.isRequired,
  outOfOrder: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
