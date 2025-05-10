import {
  Grid, Card, CardContent, Typography, Button, Stack
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllParkingAreasApi, getNearbyParkingAreasApi
} from "../common/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { setBookingState } from "../redux/bookingSlice";
import { displayNotification } from "../redux/notificationSlice";
import AddParkingAreaDialog from "../components/AddParkingAreaDialog";
import UpdateParkingAreaDialog from "../components/UpdateParkingAreaDialog";
import DeleteParkingAreaDialog from "../components/DeleteParkingAreaDialog";
import { getLocation, generateGoogleMapsLink } from "../common/helpers";

export default function ParkingAreas() {
  const [parkingAreas, setParkingAreas] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nearby, setNearby] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.login);
  const { parkingArea: selectedParkingArea } = useSelector((state) => state.booking);

  const fetchParkingAreas = useCallback(async () => {
    try {
      const res = nearby
        ? await getNearbyParkingAreasApi(
            1,
            (await getLocation()).latitude,
            (await getLocation()).longitude
          )
        : await getAllParkingAreasApi();
      setParkingAreas(res);
    } catch (error) {
      dispatch(displayNotification({ message: String(error), type: "error" }));
    }
  }, [dispatch, nearby]);

  useEffect(() => {
    fetchParkingAreas();
  }, [fetchParkingAreas]);

  const setAndOpenDialog = (area, openSetter) => {
    dispatch(setBookingState({ parkingArea: area }));
    openSetter(true);
  };

  return (
    <div>
      <h2>PARKING AREAS</h2>
      <Stack my={1} spacing={2} direction="row" justifyContent="center">
        {user?.role === "admin" && (
          <Button variant="contained" onClick={() => setAddDialogOpen(true)}>
            ADD NEW
          </Button>
        )}
        <Button variant="contained" onClick={() => setNearby(!nearby)}>
          {nearby ? "Show All" : "Show Nearby"}
        </Button>
      </Stack>

      <Grid container spacing={4}>
        {parkingAreas.map((area) => (
          <Grid item key={area._id}>
            <Card>
              <CardContent style={{ padding: 20 }}>
                <Typography variant="h5" component="div" gutterBottom>
                  {area.name}
                </Typography>
                <Typography variant="body2">CAPACITY: {area.capacity}</Typography>
                <Typography variant="body2">PRICE PER HOUR: {area.pricePerHour}</Typography>
                <Typography variant="body2">
                  <a
                    href={generateGoogleMapsLink(area.lat, area.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LOCATION
                  </a>
                </Typography>
                <Typography variant="body2">ADDRESS: {area.address}</Typography>

                <Stack mt={2} spacing={2} direction="row" justifyContent="center">
                  {user?.role === "admin" && (
                    <>
                      <Button variant="contained" onClick={() => setAndOpenDialog(area, setUpdateDialogOpen)}>
                        UPDATE
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => setAndOpenDialog(area, setDeleteDialogOpen)}
                      >
                        DELETE
                      </Button>
                    </>
                  )}
                  {user?.role === "user" && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        dispatch(setBookingState({ parkingArea: area }));
                        navigate("/pickSlot");
                      }}
                    >
                      EXPLORE
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <AddParkingAreaDialog open={addDialogOpen} handleClose={() => { setAddDialogOpen(false); fetchParkingAreas(); }} />
      <UpdateParkingAreaDialog open={updateDialogOpen} handleClose={() => { setUpdateDialogOpen(false); fetchParkingAreas(); }} parkingArea={selectedParkingArea} />
      <DeleteParkingAreaDialog open={deleteDialogOpen} handleClose={() => { setDeleteDialogOpen(false); fetchParkingAreas(); }} parkingArea={selectedParkingArea} />
    </div>
  );
}
