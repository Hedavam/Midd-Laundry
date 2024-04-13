import PropTypes from "prop-types";
import styles from "@/styles/Home.module.css";

export default function Machine({ id, num, type, inUse, outOfOrder, onClick }) {
  // eslint-disable-next-line no-nested-ternary
  const machineStatusClass = outOfOrder
    ? styles.outOfOrder
    : inUse
      ? styles.inUse
      : styles.available;

  return (
    <div
      className={`${styles.machine} ${machineStatusClass}`}
      onClick={() => onClick(id)}
      type={type}
    >
      {num}
    </div>
  );
}

Machine.propTypes = {
  id: PropTypes.number.isRequired,
  num: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  inUse: PropTypes.bool.isRequired,
  outOfOrder: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
