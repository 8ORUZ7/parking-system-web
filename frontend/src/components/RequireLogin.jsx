import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RequireLogin({ children, role }) {
  const { loggedIn, user } = useSelector((state) => state.login);
  const navigate = useNavigate();

  if (loggedIn) {
    if (role === undefined || role === user.role) {
      return children;
    } else {
      return (
        <Box textAlign="center">
          <Typography variant="h6" color="error">
            YOU NEED TO BE AN {role} TO PERFORM THIS ACTION!
          </Typography>
        </Box>
      );
    }
  }

  return (
    <Box textAlign="center">
      <Typography variant="h6">PLEASE LOG IN FIRST</Typography>
      <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
        GO TO LOG IN PAGE
      </Button>
    </Box>
  );
}

RequireLogin.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
};

RequireLogin.defaultProps = {
  role: undefined,
};
