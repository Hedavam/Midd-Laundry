import PropTypes from "prop-types";
import styles from "@/styles/Home.module.css";

export default function WashingMachine({ id, num, inUse, onClick }) {
  return (
    <div
      className={`${styles.machine} ${inUse ? styles.inUse : styles.available}`}
      onClick={() => onClick(id)}
    >
      {num}
    </div>
  );
}

WashingMachine.propTypes = {
  id: PropTypes.number.isRequired,
  num: PropTypes.number.isRequired,
  inUse: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
