/*
  ButtonBar.js

  The `ButtonBar` component is a simple collection of buttons.

  Cancel -> route back to main page
  Continue -> route to confirmation page; only want this to display if certain fields of userform are filled out 
    (will use prop from userform to determine this)

  props: UserFormShape
*/

import UserFormShape from "./UserFormShape";

export default function UserFormButtonBar({ loadInfo }) {
  // investigate why this isn't being passed down

  const handleClick = (e) => {
    if (e === "cancel") {
      // router.push("/edit"); main page
    }
    if (e === "continue") {
      // router.push(`/articles/${currentArticle?.id}/edit`); confirmation page
    }
  };

  /* Only want to enable continue when we have (one of either phone # OR email) AND have machineID AND have room AND have duration */
  const disableContinue =
    !(loadInfo.phoneNumber || loadInfo.email) ||
    !loadInfo.machineId ||
    !loadInfo.room ||
    !loadInfo.duration;

  return (
    <div>
      <button type="button" onClick={() => handleClick("cancel")}>
        Cancel
      </button>
      <button
        type="button"
        disabled={disableContinue}
        onClick={() => handleClick("continue")}
      >
        Continue
      </button>
    </div>
  );
}

UserFormButtonBar.propTypes = {
  loadInfo: UserFormShape,
};
