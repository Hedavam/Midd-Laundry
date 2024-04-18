import React from "react";
import PropTypes from "prop-types";

export default function Rooms({ rooms, handleRoomClick }) {
  return (
    <div>
      <h1>Rooms</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <button type="button" onClick={() => handleRoomClick(room.name)}>
              {room.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

Rooms.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  handleRoomClick: PropTypes.func.isRequired,
};
