/* eslint-disable no-nested-ternary */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
// import Room from "@/pages/[room]";
import UserFormButtonBar from "./UserFormButtonBar";
// import { StartupCheckStrategy } from "testcontainers";

export default function UserForm({
  id,
  RoomId,
  MachineNum,
  Type,
  OutOfOrder,
  inUse,
  onClose,
  onSubmit,
}) {
  const [loadInfo, setLoadInfo] = useState({
    id,
    RoomId,
    MachineNum,
    Type,
    PhoneNum: Cookies.get("phoneNumber") || "",
    Email: Cookies.get("email") || "",
    Duration: null,
    OutOfOrder,
  });

  useEffect(() => {
    // Set initial values for phone number and email from cookies
    setLoadInfo((prevLoadInfo) => ({
      ...prevLoadInfo,
      PhoneNum: Cookies.get("phoneNumber") || "",
      Email: Cookies.get("email") || "",
    }));
  }, []);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(
    !inUse || OutOfOrder,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoadInfo((prevLoadInfo) => ({
      ...prevLoadInfo,
      [name]: name === "Duration" ? parseInt(value, 10) : value,
    }));

    if (name === "Duration" && (!OutOfOrder || OutOfOrder === false)) {
      setIsSubmitDisabled(value === "");
    }
  };

  const handleOutOfOrder = () => {
    const updatedLoadInfo = { ...loadInfo, OutOfOrder: !loadInfo.OutOfOrder };
    const { Duration, Email, PhoneNum, ...simplifiedLoadInfo } =
      updatedLoadInfo;

    const toggleOutOfOrder = async () => {
      try {
        const response = await fetch(`/api/machines/${id}`, {
          method: "PUT",
          body: JSON.stringify(simplifiedLoadInfo),
          headers: new Headers({
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
        });
        if (response.ok) {
          const loadData = await response.json();
          setLoadInfo(loadData);
        } else {
          setLoadInfo(null);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error posting load:", error);
      }
    };

    toggleOutOfOrder();

    onSubmit(updatedLoadInfo);
  };

  const handleStartLoad = () => {
    Cookies.set("phoneNumber", loadInfo.PhoneNum);
    Cookies.set("email", loadInfo.Email);

    const updatedLoadInfo = { ...loadInfo };
    // eslint-disable-next-line no-shadow
    const { OutOfOrder, Type, id, MachineNum, RoomId, ...simplifiedLoadInfo } =
      updatedLoadInfo;

    const startTime = new Date(); // Current time
    const endTime = new Date(
      startTime.getTime() +
        simplifiedLoadInfo.Duration * 60 * 1000 +
        10 * 60 * 1000,
    ); // Current time + duration + 10 minutes

    const Start = startTime.toISOString();
    const End = endTime.toISOString();

    const updatedSimplifiedLoadInfo = {
      ...simplifiedLoadInfo,
      Start,
      End,
      MachineId: loadInfo.id,
    };

    const postLoad = async () => {
      try {
        const response = await fetch(`/api/machines/${id}/loads`, {
          method: "POST",
          body: JSON.stringify(updatedSimplifiedLoadInfo),
          headers: new Headers({
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
        });
        if (response.ok) {
          const loadData = await response.json();
          setLoadInfo(loadData);
        } else {
          setLoadInfo(null);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error posting load:", error);
      }
    };

    postLoad();

    onSubmit(updatedLoadInfo);

    setIsSubmitDisabled(true);
  };

  const handleEndLoad = async () => {
    const fetchLoad = async () => {
      try {
        const response = await fetch(`/api/machines/${loadInfo.id}/loads`);
        if (response.ok) {
          const loadData = await response.json();
          const loadObject = loadData.loads.reduce(
            (obj, item) => ({ ...obj, [item.id]: item }),
            {},
          );
          return Object.values(loadObject); // TODO: maybe adjust the endpoint to just give us the loads array!
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error fetching load:", error);
      }
      return null;
    };

    const updatedLoadInfo = await fetchLoad();

    const endTime = new Date(); // Current time
    const newEndTime = endTime.toISOString();

    const newLoadInfo = {
      ...updatedLoadInfo[0],
      End: newEndTime,
    };

    const putLoad = async () => {
      try {
        const response = await fetch(`/api/loads/${newLoadInfo.id}`, {
          method: "PUT",
          body: JSON.stringify(newLoadInfo),
          headers: new Headers({
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
        });
        if (response.ok) {
          const loadData = await response.json();
          setLoadInfo(loadData);
        } else {
          setLoadInfo(null);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error posting load:", error);
      }
    };

    putLoad();

    onSubmit(updatedLoadInfo);

    setIsSubmitDisabled(true);
  };

  const handleSubmit = () => {
    if (loadInfo.Duration) {
      handleStartLoad();
    } else {
      handleEndLoad();
    }
  };

  return (
    <Box sx={{ maxWidth: "400px", margin: "auto" }}>
      {!inUse && !OutOfOrder ? (
        <form onSubmit={handleSubmit}>
          {/* Input fields for load information */}
          <TextField
            label="Machine"
            variant="outlined"
            fullWidth
            value={`${loadInfo.Type.charAt(0).toUpperCase()}${loadInfo.Type.slice(1)} ${loadInfo.MachineNum}`}
            onChange={handleChange}
            name="machineID"
            readOnly
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            value={loadInfo.PhoneNum}
            onChange={handleChange}
            name="PhoneNum"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={loadInfo.Email}
            onChange={handleChange}
            name="Email"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Duration (minutes)"
            variant="outlined"
            fullWidth
            value={loadInfo.Duration ? loadInfo.Duration : ""}
            onChange={handleChange}
            name="Duration"
            type="number"
            inputProps={{ min: 0, max: 75 }} // Restrict duration between 0 and 75 minutes
            sx={{ mb: 2 }}
          />
        </form>
      ) : OutOfOrder ? (
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          {loadInfo.Type.charAt(0).toUpperCase()}
          {loadInfo.Type.slice(1)} {loadInfo.MachineNum} is out of order
        </Typography>
      ) : (
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          {loadInfo.Type.charAt(0).toUpperCase()}
          {loadInfo.Type.slice(1)} {loadInfo.MachineNum} is currently in use
        </Typography>
      )}
      <UserFormButtonBar
        loadInfo={loadInfo}
        onCancel={onClose}
        onSubmit={handleSubmit}
        isSubmitDisabled={isSubmitDisabled}
        inUse={inUse}
        OutOfOrder={OutOfOrder}
        onOutOfOrder={handleOutOfOrder}
      />
    </Box>
  );
}

UserForm.propTypes = {
  id: PropTypes.number.isRequired,
  RoomId: PropTypes.number.isRequired,
  MachineNum: PropTypes.number.isRequired,
  Type: PropTypes.string.isRequired,
  OutOfOrder: PropTypes.bool,
  inUse: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
