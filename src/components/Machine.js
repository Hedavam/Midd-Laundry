import PropTypes from "prop-types";
import styles from "@/styles/Home.module.css";

export default function Machine({ id, num, type, inUse, onClick }) {
  return (
    <div
      className={`${styles.machine} ${inUse ? styles.inUse : styles.available}`}
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
  onClick: PropTypes.func.isRequired,
};
