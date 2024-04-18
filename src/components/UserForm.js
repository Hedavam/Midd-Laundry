/* eslint-disable no-nested-ternary */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import UserFormButtonBar from "./UserFormButtonBar";

export default function UserForm({
  machineId,
  machineNum,
  machineType,
  outOfOrder,
  inUse,
  onClose,
  onSubmit,
}) {
  const [loadInfo, setLoadInfo] = useState({
    machineId,
    machineNum,
    machineType,
    phoneNumber: Cookies.get("phoneNumber") || "",
    email: Cookies.get("email") || "",
    duration: "",
    outOfOrder,
  });

  useEffect(() => {
    // Set initial values for phone number and email from cookies
    setLoadInfo((prevLoadInfo) => ({
      ...prevLoadInfo,
      phoneNumber: Cookies.get("phoneNumber") || "",
      email: Cookies.get("email") || "",
    }));
  }, []);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(
    !inUse || outOfOrder,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoadInfo((prevLoadInfo) => ({
      ...prevLoadInfo,
      [name]: value,
    }));

    if (name === "duration" && outOfOrder === false) {
      setIsSubmitDisabled(value === "");
    }
  };

  const handleOutOfOrder = () => {
    const updatedLoadInfo = { ...loadInfo, outOfOrder: !loadInfo.outOfOrder };
    setLoadInfo(updatedLoadInfo);
    onSubmit(updatedLoadInfo);
  };

  const handleSubmit = () => {
    Cookies.set("phoneNumber", loadInfo.phoneNumber);
    Cookies.set("email", loadInfo.email);

    onSubmit(loadInfo);
    setIsSubmitDisabled(true);
  };

  return (
    <Box sx={{ maxWidth: "400px", margin: "auto" }}>
      {!inUse && !outOfOrder ? (
        <form onSubmit={handleSubmit}>
          {/* Input fields for load information */}
          <TextField
            label="Machine"
            variant="outlined"
            fullWidth
            value={`${loadInfo.machineType.charAt(0).toUpperCase()}${loadInfo.machineType.slice(1)} ${loadInfo.machineNum}`}
            onChange={handleChange}
            name="machineID"
            readOnly
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={loadInfo.phoneNumber}
            onChange={handleChange}
            name="phoneNumber"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={loadInfo.email}
            onChange={handleChange}
            name="email"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Duration (minutes)"
            variant="outlined"
            fullWidth
            value={loadInfo.duration}
            onChange={handleChange}
            name="duration"
            type="number"
            sx={{ mb: 2 }}
          />
        </form>
      ) : outOfOrder ? (
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          {loadInfo.machineType.charAt(0).toUpperCase()}
          {loadInfo.machineType.slice(1)} {loadInfo.machineNum} is out of order
        </Typography>
      ) : (
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          {loadInfo.machineType.charAt(0).toUpperCase()}
          {loadInfo.machineType.slice(1)} {loadInfo.machineNum} is currently in
          use
        </Typography>
      )}
      <UserFormButtonBar
        loadInfo={loadInfo}
        onCancel={onClose}
        onSubmit={handleSubmit}
        isSubmitDisabled={isSubmitDisabled}
        inUse={inUse}
        outOfOrder={outOfOrder}
        onOutOfOrder={handleOutOfOrder}
      />
    </Box>
  );
}

UserForm.propTypes = {
  machineId: PropTypes.number.isRequired,
  machineNum: PropTypes.number.isRequired,
  machineType: PropTypes.string.isRequired,
  outOfOrder: PropTypes.bool.isRequired,
  inUse: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
