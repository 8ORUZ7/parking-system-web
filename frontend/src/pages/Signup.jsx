import { useFormik } from "formik";
import { TextField, Button, Box, Typography } from "@mui/material";
import { signupApi } from "../common/axiosClient";
import { useDispatch } from 'react-redux';
import { displayNotification } from "../redux/notificationSlice";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      try {
        await signupApi(values);
        dispatch(displayNotification({ message: "Sign Up successful", type: "success" }));
        navigate("/login");
      } catch (err) {
        dispatch(displayNotification({ message: String(err), type: "error" }));
      }
    },
  });

  const fields = [
    { id: "name", label: "NAME", type: "text" },
    { id: "email", label: "EMAIL", type: "email" },
    { id: "password", label: "PASSWORD", type: "password" },
    { id: "confirmPassword", label: "CONFIRM PASSWORD", type: "password" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        height: "50vh", // Full viewport height
        flexDirection: "column", // Stack form elements vertically
        textAlign: "center", // Center text inside the form
        padding: 2, // Padding for spacing around the form
      }}
    >
      <Typography variant="h4" gutterBottom>SIGN UP</Typography>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ width: 400, display: "flex", flexDirection: "column", gap: 2 }}>
          {fields.map(({ id, label, type }) => (
            <TextField
              key={id}
              id={id}
              name={id}
              label={label}
              type={type}
              required
              fullWidth
              onChange={formik.handleChange}
              value={formik.values[id]}
            />
          ))}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={formik.values.password !== formik.values.confirmPassword}
          >
            SIGN UP
          </Button>
        </Box>
      </form>
    </Box>
  );
}
