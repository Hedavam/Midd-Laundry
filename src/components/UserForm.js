/*
  UserForm.js

  The `UserForm` component is a form allowing users to log their loads.

  The bar has two states determined by `allowEdit`. If false, only an "Add" button is shown.
  If true, then "Add" and "Edit" are shown. 

  When a button is clicked, `handleClick` is called with "add", or "edit".

  props:
    allowContinue - a Boolean indicating if our expectations of what's in userform field's is met
*/
import PropTypes from "prop-types";
import { useState } from "react";
import UserFormButtonBar from "./UserFormButtonBar";


export default function UserForm({ /* setMachineStatus */ room, machineId }) {
  // machine ppl will send down prop. to setMachineStatus (required); room, id (optional - initialized as empty string or actual values)
  /* Define UserForm for input */
  const loadInfoObj = {
    phoneNumber: null,
    email: null,
    machineId, // will use value from prop
    duration: null,
    room, // will use value from prop
  };

  const [loadInfo, setloadInfo] = useState(loadInfoObj);

  /* Func. to determine enableContinue */

  /* Make the form */

  return (
    <>
      <form>
        <label> Phone Number: </label>
        <input
          type="number"
          value={loadInfo.phoneNumber}
          onChange={(event) =>
            setloadInfo({ ...loadInfo, phoneNumber: event.target.value })
          }
         />

        <label> Email </label>
        <input
          type="email"
          value={loadInfo.email}
          onChange={(event) =>
            setloadInfo({ ...loadInfo, email: event.target.value })
          }
         />

        <label> Machine-Id (Unique - 6 Digits): </label>
        <input
          type="text"
          value={loadInfo.machineId}
          onChange={(event) =>
            setloadInfo({ ...loadInfo, machineId: event.target.value })
          }
         />

        <label> Duration (minutes): </label>
        <input
          type="number"
          onChange={(event) =>
            setloadInfo({ ...loadInfo, duration: event.target.value })
          }
         />

        <label> Room: </label>
        <input
          type="text"
          value={loadInfo.room}
          onChange={(event) =>
            setloadInfo({ ...loadInfo, room: event.target.value })
          }
         />
      </form>

      <UserFormButtonBar loadInfo={loadInfo} />
    </>
  );

  /* Handle logic to determine if continue button should be enabled */
}

/* For later: pass down setMachineStatus (required), loadInfo */

UserForm.propTypes = {
  // setMachineStatus: PropTypes.func.isRequired,
  room: PropTypes.string.isRequired,
  machineId: PropTypes.string.isRequired,
};
