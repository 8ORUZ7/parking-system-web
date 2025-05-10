import { useFormik } from "formik";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box
} from "@mui/material";
import { updateParkingAreaApi } from "../common/axiosClient";
import { useDispatch } from "react-redux";
import { displayNotification } from "../redux/notificationSlice";
import PropTypes from "prop-types";

export default function UpdateParkingAreaWrapper({ parkingArea, open, handleClose }) {
  if (!parkingArea) {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>PARKING AREA NOT SELECTED</DialogTitle>
      </Dialog>
    );
  }

  return (
    <UpdateParkingAreaDialog
      parkingArea={parkingArea}
      open={open}
      handleClose={handleClose}
    />
  );
}

UpdateParkingAreaWrapper.propTypes = {
  parkingArea: PropTypes.object,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

function UpdateParkingAreaDialog({ parkingArea, open, handleClose }) {
  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      _id: parkingArea._id,
      name: parkingArea.name,
      address: parkingArea.address,
      capacity: parkingArea.capacity,
      pricePerHour: parkingArea.pricePerHour,
      lat: parkingArea.lat,
      lng: parkingArea.lng,
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await updateParkingAreaApi(values);
        dispatch(displayNotification({ message: "UPDATE SUCCESSFUL.", type: "success" }));
        handleClose();
      } catch (err) {
        dispatch(displayNotification({ message: String(err), type: "error" }));
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>UPDATE PARKING AREA</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          {[
            { id: "name", label: "NAME" },
            { id: "address", label: "ADDRESS" },
            { id: "capacity", label: "CAPACITY", type: "number", inputProps: { min: 5, step: 5 } },
            { id: "pricePerHour", label: "PRICE PER HOUR", type: "number", inputProps: { min: 100, step: 50 } },
            { id: "lat", label: "LATITUDE", type: "number" },
            { id: "lng", label: "LONGTITUDE", type: "number" }
          ].map(({ id, label, type = "text", inputProps }) => (
            <TextField
              key={id}
              id={id}
              name={id}
              label={label}
              type={type}
              inputProps={inputProps}
              value={formik.values[id]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              required
              margin="normal"
            />
          ))}
          <DialogActions>
            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
              UPDATE
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

UpdateParkingAreaDialog.propTypes = {
  parkingArea: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
