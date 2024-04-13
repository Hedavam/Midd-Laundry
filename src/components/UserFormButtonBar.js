import PropTypes from "prop-types";
import styles from "@/styles/UserFormButtonBar.module.css";
import UserFormShape from "./UserFormShape";

export default function UserFormButtonBar({ loadInfo, onCancel, onSubmit }) {
  const handleClick = (action) => {
    if (action === "cancel") {
      onCancel();
    } else if (action === "continue") {
      onSubmit(loadInfo);
    }
  };

  return (
    <div className={styles.userFormButtonBar}>
      <button type="button" onClick={() => handleClick("cancel")}>
        Cancel
      </button>
      <button type="button" onClick={() => handleClick("continue")}>
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
