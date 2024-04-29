import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import UserFormShape from "./UserFormShape";

export default function UserFormButtonBar({
  loadInfo,
  onCancel,
  onSubmit,
  isSubmitDisabled,
  inUse,
  outOfOrder,
  onOutOfOrder,
}) {
  const handleClick = (action) => {
    if (action === "cancel") {
      onCancel();
    } else if (action === "continue") {
      onSubmit(loadInfo);
    } else if (action === "outOfOrder") {
      onOutOfOrder();
    }
  };

  const buttonLabel = inUse && !outOfOrder ? "Finish Load" : "Start Load";

  return (
    <Grid container spacing={2} justifyContent="space-evenly">
      <Grid item>
        <Button variant="contained" onClick={() => handleClick("cancel")}>
          Cancel
        </Button>
      </Grid>
      {!outOfOrder ? (
        <>
          {!inUse && (
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => handleClick("outOfOrder")}
              >
                Out of Order?
              </Button>
            </Grid>
          )}
          <Grid item>
            <Button
              variant="contained"
              disabled={isSubmitDisabled}
              onClick={() => handleClick("continue")}
            >
              {buttonLabel}
            </Button>
          </Grid>
        </>
      ) : (
        <Grid item>
          <Button variant="outlined" onClick={() => handleClick("outOfOrder")}>
            Not Out of Order?
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

UserFormButtonBar.propTypes = {
  loadInfo: UserFormShape,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  inUse: PropTypes.bool.isRequired,
  outOfOrder: PropTypes.bool.isRequired,
  onOutOfOrder: PropTypes.func.isRequired,
};
