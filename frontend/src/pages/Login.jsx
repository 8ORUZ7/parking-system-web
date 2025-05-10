import { useFormik } from "formik";
import { TextField, Button, Stack, Typography, Box } from "@mui/material";
import { loginApi } from "../common/axiosClient";
import { cacheWithExpiry } from "../common/helpers";
import { useDispatch } from "react-redux";
import { displayNotification } from "../redux/notificationSlice";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/loginSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ email, password }) => {
      try {
        const response = await loginApi({ email, password });
        dispatch(displayNotification({ message: "LOGIN SUCCESSFULLY", type: "success" }));
        dispatch(login(response.user));
        cacheWithExpiry("jwt", response.token, 1000 * 60 * 60 * 1);
        navigate("/parkingAreas");
      } catch (err) {
        dispatch(displayNotification({ message: String(err), type: "error" }));
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Horizontally center
        alignItems: "center", // Vertically center
        height: "40vh", // Full viewport height
        flexDirection: "column", // Stack items vertically
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>LOG IN</Typography>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2} sx={{ maxWidth: 200, width: '100%' }}>
          <TextField
            id="email"
            name="email"
            label="EMAIL"
            type="email"
            required
            fullWidth
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          <TextField
            id="password"
            name="password"
            label="PASSWORD"
            type="password"
            required
            fullWidth
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <Button type="submit" variant="contained" fullWidth>LOG IN</Button>
        </Stack>
      </form>
    </Box>
  );
}
