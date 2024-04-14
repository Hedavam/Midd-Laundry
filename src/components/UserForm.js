import { useState } from "react";
import PropTypes from "prop-types";
import styles from "@/styles/UserForm.module.css";
import UserFormButtonBar from "./UserFormButtonBar";

export default function UserForm({
  machineId,
  machineNum,
  machineType,
  onClose,
  onSubmit,
  outOfOrder,
}) {
  const [loadInfo, setLoadInfo] = useState({
    machineId,
    machineNum,
    machineType,
    phoneNumber: "",
    email: "",
    duration: "",
    outOfOrder,
  });

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoadInfo((prevLoadInfo) => ({
      ...prevLoadInfo,
      [name]: value,
    }));

    if (name === "duration") {
      setIsSubmitDisabled(value === "");
    }
  };

  const handleOutOfOrderChange = (e) => {
    const { checked } = e.target;
    setLoadInfo((prevLoadInfo) => ({
      ...prevLoadInfo,
      outOfOrder: checked,
    }));

    setIsSubmitDisabled(false);
  };

  const handleSubmit = () => {
    onSubmit(loadInfo);
    setIsSubmitDisabled(true);
  };

  return (
    <div className={styles.userFormContainer}>
      <form onSubmit={handleSubmit}>
        {/* Input fields for load information */}
        <label>
          Machine:
          <input
            type="text"
            name="machineID"
            value={`${loadInfo.machineType.charAt(0).toUpperCase()}${loadInfo.machineType.slice(1)} ${loadInfo.machineNum}`}
            onChange={handleChange}
            readOnly
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={loadInfo.phoneNumber}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={loadInfo.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Duration (minutes):
          <input
            type="number"
            name="duration"
            value={loadInfo.duration}
            onChange={handleChange}
          />
        </label>
        <label>
          Out of Order:
          <input
            type="checkbox"
            name="outOfOrder"
            checked={loadInfo.outOfOrder}
            onChange={handleOutOfOrderChange}
          />
        </label>
      </form>
      <UserFormButtonBar
        loadInfo={loadInfo}
        onCancel={onClose}
        onSubmit={handleSubmit}
        isSubmitDisabled={isSubmitDisabled}
      />
    </div>
  );
}

UserForm.propTypes = {
  machineId: PropTypes.number.isRequired,
  machineNum: PropTypes.number.isRequired,
  machineType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  outOfOrder: PropTypes.bool.isRequired,
};
