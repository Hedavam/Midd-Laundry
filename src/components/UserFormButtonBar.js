import PropTypes from "prop-types";
import styles from "@/styles/UserFormButtonBar.module.css";
import UserFormShape from "./UserFormShape";

export default function UserFormButtonBar({ loadInfo, onCancel, onSubmit }) {
  // investigate why this isn't being passed down

  const handleClick = (action) => {
    if (action === "cancel") {
      onCancel();
    } else if (action === "continue") {
      onSubmit(loadInfo);
    }
  };

  /* Only want to enable continue when we have (one of either phone # OR email) AND have machineID AND have room AND have duration */
  const disableContinue =
    !(loadInfo.phoneNumber || loadInfo.email) ||
    !loadInfo.machineId ||
    !loadInfo.duration;

  return (
    <div className={styles.userFormButtonBar}>
      <button type="button" onClick={() => handleClick("cancel")}>
        Cancel
      </button>
      <button
        type="button"
        disabled={disableContinue}
        onClick={() => handleClick("continue")}
      >
        Submit
      </button>
    </div>
  );
}

UserFormButtonBar.propTypes = {
  loadInfo: UserFormShape,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
