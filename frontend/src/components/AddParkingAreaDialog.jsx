import { useFormik } from "formik";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { createParkingAreaApi } from "../common/axiosClient";
import { useDispatch } from "react-redux";
import { displayNotification } from "../redux/notificationSlice";
import PropTypes from "prop-types";
import * as Yup from "yup"; // Validation Schema for Formik

// Define validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("PARKING AREA NAME IS REQUIRED"),
  address: Yup.string().required("ADDRESS IS REQUIRED"),
  capacity: Yup.number().required("CAPACITY IS REQUIRED").min(5, "MINIMUM CAPACITY IS 5"),
  pricePerHour: Yup.number().required("PRICE PER HOUR IS REQUIRED").min(300, "PRICE PER HOUR SHOULD BE ATLEAST 100"),
  lat: Yup.number().required("LATITUDE IS REQUIRED"),
  lng: Yup.number().required("LONGTITUDE IS REQUIRED"),
});

// Helper component to render form fields
const RenderTextField = ({ id, label, value, onChange, error, helperText, type = "text", inputProps = {} }) => (
  <TextField
    id={id}
    name={id}
    label={label}
    variant="outlined"
    required
    type={type}
    value={value}
    onChange={onChange}
    error={error}
    helperText={helperText}
    sx={{ marginTop: 2 }} // Using sx for consistent styling
    inputProps={inputProps}
  />
);

export default function AddParkingAreaDialog({ open, handleClose }) {
  const dispatch = useDispatch();

  // Formik initialization with validation schema
  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      capacity: "",
      pricePerHour: "",
      lat: "",
      lng: "",
    },
    validationSchema, // Attach validation schema
    onSubmit: async (values) => {
      try {
        await createParkingAreaApi(values);
        dispatch(displayNotification({ message: "PARKING AREA CREATED SUCCESSFULLY", type: "success" }));
        handleClose();
      } catch (err) {
        dispatch(displayNotification({ message: `Error: ${err.message || err}`, type: "error" }));
      }
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>ADD NEW PARKING AREA</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", marginInline: 2 }}>
        <form onSubmit={formik.handleSubmit}>
          {/* Name Field */}
          <RenderTextField
            id="name"
            label="NAME"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          {/* Address Field */}
          <RenderTextField
            id="address"
            label="ADDRESS"
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />

          {/* Capacity Field */}
          <RenderTextField
            id="capacity"
            label="CAPACITY"
            value={formik.values.capacity}
            onChange={formik.handleChange}
            error={formik.touched.capacity && Boolean(formik.errors.capacity)}
            helperText={formik.touched.capacity && formik.errors.capacity}
            type="number"
            inputProps={{ min: 5, step: 5 }}
          />

          {/* Price Per Hour Field */}
          <RenderTextField
            id="pricePerHour"
            label="PRICE PER HOUR"
            value={formik.values.pricePerHour}
            onChange={formik.handleChange}
            error={formik.touched.pricePerHour && Boolean(formik.errors.pricePerHour)}
            helperText={formik.touched.pricePerHour && formik.errors.pricePerHour}
            type="number"
            inputProps={{ min: 100, step: 50 }}
          />

          {/* Latitude Field */}
          <RenderTextField
            id="lat"
            label="LATITUDE"
            value={formik.values.lat}
            onChange={formik.handleChange}
            error={formik.touched.lat && Boolean(formik.errors.lat)}
            helperText={formik.touched.lat && formik.errors.lat}
            type="number"
          />

          {/* Longitude Field */}
          <RenderTextField
            id="lng"
            label="LONGTITUDE"
            value={formik.values.lng}
            onChange={formik.handleChange}
            error={formik.touched.lng && Boolean(formik.errors.lng)}
            helperText={formik.touched.lng && formik.errors.lng}
            type="number"
          />

          {/* Submit Button */}
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formik.isSubmitting}
              sx={{ marginTop: 2 }}
            >
              {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : "CREATE"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

AddParkingAreaDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
