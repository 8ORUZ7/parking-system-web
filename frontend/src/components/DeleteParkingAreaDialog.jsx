import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { deleteParkingAreaApi } from "../common/axiosClient";
import { useDispatch } from "react-redux";
import { displayNotification } from "../redux/notificationSlice";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// Wrapper to show dialog if a parking area is selected
export default function Wrapper({ parkingArea, open, handleClose }) {
  if (!parkingArea) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>PARKING AREA NOT SELECTED</DialogTitle>
      </Dialog>
    );
  } else {
    return <DeleteParkingAreaDialog parkingArea={parkingArea} open={open} handleClose={handleClose} />;
  }
}

Wrapper.propTypes = {
  parkingArea: PropTypes.object,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

// Dialog for deleting a selected parking area
function DeleteParkingAreaDialog({ parkingArea, open, handleClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle deletion of the parking area
  const onDelete = async () => {
    try {
      await deleteParkingAreaApi(parkingArea._id);
      dispatch(displayNotification({ message: "PARKING AREA DELETED SUCCESSFULLY.", type: "success" }));
      handleClose();  // Close the dialog after success
      navigate('/parkingAreas');  // Redirect to the list of parking areas
    } catch (err) {
      dispatch(displayNotification({ message: `Error: ${err.message || err}`, type: "error" }));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>DELETE PARKING AREA</DialogTitle>
      <DialogContent style={{ justifyContent: 'center', marginInline: 20 }}>
        <DialogContentText>
          ARE YOU SURE YOU WANT TO DELETE THIS PARKING AREA: <strong>{parkingArea.name}</strong>?
        </DialogContentText>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={onDelete}
            style={{ marginTop: 10 }}
          >
            DELETE
          </Button>
          <Button
            variant="outlined"
            onClick={handleClose}
            style={{ marginTop: 10 }}
          >
            CANCEL
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

DeleteParkingAreaDialog.propTypes = {
  parkingArea: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
