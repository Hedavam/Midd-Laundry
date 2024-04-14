import PropTypes from "prop-types";
import styles from "@/styles/UserFormButtonBar.module.css";
import UserFormShape from "./UserFormShape";

export default function UserFormButtonBar({
  loadInfo,
  onCancel,
  onSubmit,
  isSubmitDisabled,
  inUse,
  outOfOrder,
}) {
  const handleClick = (action) => {
    if (action === "cancel") {
      onCancel();
    } else if (action === "continue") {
      onSubmit(loadInfo);
    }
  };

  const buttonLabel = inUse && !outOfOrder ? "Finish Load" : "Submit";

  return (
    <div className={styles.userFormButtonBar}>
      <button type="button" onClick={() => handleClick("cancel")}>
        Cancel
      </button>
      <button
        type="button"
        disabled={isSubmitDisabled}
        onClick={() => handleClick("continue")}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

UserFormButtonBar.propTypes = {
  loadInfo: UserFormShape,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  inUse: PropTypes.bool.isRequired,
  outOfOrder: PropTypes.bool.isRequired,
};
