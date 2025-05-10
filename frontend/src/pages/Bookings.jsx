import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box
} from "@mui/material";
import { useDispatch } from "react-redux";
import { displayNotification } from "../redux/notificationSlice";
import { getAllBookingsApi } from "../common/axiosClient";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const dispatch = useDispatch();

  const fetchBookings = useCallback(async () => {
    try {
      const res = await getAllBookingsApi();
      const sorted = res.sort(
        (a, b) => new Date(b.startTime) - new Date(a.startTime)
      );
      setBookings(sorted);
    } catch (err) {
      dispatch(displayNotification({ message: String(err), type: "error" }));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        BOOKINGS
      </Typography>

      <Box mb={2}>
        <Button variant="contained" onClick={fetchBookings}>
          REFRESH
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {["PARKING AREA", "USER", "SLOT", "FROM", "TO"].map((heading) => (
                <TableCell key={heading} sx={{ fontWeight: "bold" }}>
                  {heading.toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.parkingArea?.name || "N/A"}</TableCell>
                <TableCell>{booking.user?.name || "N/A"}</TableCell>
                <TableCell>{booking.slot}</TableCell>
                <TableCell>{new Date(booking.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(booking.endTime).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
