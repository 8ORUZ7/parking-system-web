import './App.css';
import React from 'react';
import {
  Snackbar, IconButton, Alert, Typography, Button, Stack, ListItem, Box,
  List, Drawer
} from '@mui/material';
import { hideNotification } from './redux/notificationSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/loginSlice';
import pages from './common/pages';
import { useNavigate, Routes, Route } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginState = useSelector((state) => state.login);
  const notification = useSelector((state) => state.notification);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleCloseNotification = () => dispatch(hideNotification());
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  const role = loginState.user.role || 'guest';

  return (
    <div>
      <Snackbar
        open={notification.open}
        autoHideDuration={notification.autoHideDuration}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          variant='filled'
          severity={notification.type}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseNotification}>
              x
            </IconButton>
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box>
          <Typography fontSize={20} fontWeight="bold" p={2}>Menu</Typography>
          <List>
            {pages.map((page) => (
              page.hiddenTo.includes(role)
                ? null
                : (
                  <ListItem key={page.path} style={{ cursor: 'pointer' }}>
                    <Button onClick={() => {
                      setDrawerOpen(false);
                      navigate(page.path);
                    }}>
                      {page.name}
                    </Button>
                  </ListItem>
                )
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Stack adjusted for vertical layout */}
      <Stack
        direction="column" // Stack items vertically
        spacing={2} // Space between elements
        sx={{ padding: '16px', alignItems: 'flex-start' }} // Align items to the left and add padding
      >
        {/* Left-aligned button to open the drawer */}
        <Button onClick={() => setDrawerOpen(true)} variant='contained' color='info' size='medium'>
          &#9776;
        </Button>


        {/* Left-aligned login/logout status */}
        <Typography>
          {loginState.loggedIn
            ? <>
                {loginState.user.name} ({role})
                <Button onClick={handleLogout}>LOGOUT</Button>
              </>
            : 'NOT LOGGED IN'}
        </Typography>
      </Stack>

      {/* Routes */}
      <Routes>
        {pages.map((page) => (
          <Route key={page.path} path={page.path} element={page.element} />
        ))}
        <Route path='*' element={<Typography>404 Not Found</Typography>} />
      </Routes>
    </div>
  );
}

export default App;
