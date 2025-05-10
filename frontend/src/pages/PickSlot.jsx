import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import {
  TextField, Button, Grid, Card, CardContent, Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { displayNotification } from "../redux/notificationSlice";
import { setBookingState } from "../redux/bookingSlice";
import { getBookingsApi } from "../common/axiosClient";
import { useNavigate } from "react-router-dom";
import { generateGoogleMapsLink, getCurrentDateTimeString } from "../common/helpers";

export default function PickSlot() {
  const booking = useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const [showSlots, setShowSlots] = useState(false);

  const formik = useFormik({
    initialValues: {
      startTime: '',
      endTime: '',
    },
    onSubmit: ({ startTime, endTime }) => {
      const now = new Date();
      if (new Date(startTime) < now || new Date(endTime) < now) {
        alert("Selected DateTimes Cannot be in the Past");
        setShowSlots(false);
        return;
      }
      if (startTime >= endTime) {
        alert("Start time cannot be greater than or equal to the End time");
        setShowSlots(false);
        return;
      }

      dispatch(setBookingState({ startTime, endTime }));
      setShowSlots(true);
    },
  });

  const renderParkingAreaDetails = () => {
    const { name, capacity, pricePerHour, address, lat, lng } = booking.parkingArea;
    return (
      <Grid item>
        <h3>{name}</h3>
        <h5>CAPACITY: {capacity}</h5>
        <h5>PRICE PER HOUR: {pricePerHour}</h5>
        <h5>ADDRESS: {address}</h5>
        <h5>
          <a href={generateGoogleMapsLink(lat, lng)} target="_blank" rel="noopener noreferrer">
            LOCATION
          </a>
        </h5>
      </Grid>
    );
  };

  const renderDateTimeField = (id, label) => (
    <div key={id}>
      <TextField
        id={id}
        name={id}
        label={label}
        type="datetime-local"
        required
        style={{ marginBlock: 5 }}
        InputLabelProps={{ shrink: true }}
        inputProps={{ min: getCurrentDateTimeString() }}
        onChange={formik.handleChange}
        value={formik.values[id]}
      />
      <br />
    </div>
  );

  return (
    <div>
      <h3>PICK SLOT</h3>
      {!booking.parkingArea ? (
        <h3>PLEASE SELECT A PARKING AREA FIRST</h3>
      ) : (
        <Grid container justifyContent="space-evenly">
          {renderParkingAreaDetails()}
          <Grid item>
            <h3>SELECT TIME AND DATE</h3>
            <form onSubmit={formik.handleSubmit}>
              {["startTime", "endTime"].map((id, idx) =>
                renderDateTimeField(id, idx === 0 ? "From" : "To")
              )}
              <Button type="submit" variant="contained" style={{ marginBlock: 5 }}>
                CHECK
              </Button>
            </form>
          </Grid>
        </Grid>
      )}
      {showSlots && <Slots />}
    </div>
  );
}

const Slots = () => {
  const { parkingArea, startTime, endTime } = useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const discoverSlots = async () => {
      try {
        const bookings = await getBookingsApi(parkingArea._id, startTime, endTime);
        const bookedSet = new Set(bookings.map((b) => b.slot));
        const slotsArray = Array.from({ length: parkingArea.capacity }, (_, i) => ({
          slotNumber: i + 1,
          booked: bookedSet.has(i + 1),
        }));
        setSlots(slotsArray);
      } catch (err) {
        dispatch(displayNotification({ message: String(err), type: "error" }));
      }
    };

    if (parkingArea && startTime && endTime) {
      discoverSlots();
    }
  }, [dispatch, parkingArea, startTime, endTime]);

  const handleSlotClick = (slotNumber) => {
    dispatch(setBookingState({ slot: slotNumber }));
    navigate("/bookSlot");
  };

  return (
    <div>
      <h3>SLOTS</h3>
      <Grid container spacing={4}>
        {slots.map(({ slotNumber, booked }) => (
          <Grid item key={slotNumber}>
            <Card
              style={{
                color: "white",
                backgroundColor: booked ? "red" : "green",
                cursor: booked ? "default" : "pointer",
              }}
              onClick={() => !booked && handleSlotClick(slotNumber)}
            >
              <CardContent style={{ padding: 20 }}>
                <Typography variant="h5">{slotNumber}</Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {booked ? "Booked" : "Available"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
