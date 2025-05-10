import React from "react";
import {
  Button,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { displayNotification } from "../redux/notificationSlice";
import { bookSlotApi } from "../common/axiosClient";
import { generateGoogleMapsLink } from "../common/helpers";

export default function BookSlot() {
  const { parkingArea, startTime, endTime, slot } = useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const [paymentUrl, setPaymentUrl] = React.useState("");

  const onBookSlotClick = async () => {
    try {
      const response = await bookSlotApi({ parkingAreaId: parkingArea._id, startTime, endTime, slot });
      setPaymentUrl(response.paymentSession.url);
    } catch (error) {
      dispatch(displayNotification({ message: String(error), type: "error" }));
    }
  };

  const allDetailsAvailable = parkingArea && startTime && endTime && slot;

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        BOOK PARKING SLOT
      </Typography>

      {!allDetailsAvailable ? (
        <Typography variant="h6" color="error">
          PLEASE SELECT THE PARKING AREA, TIME, AND SLOT FIRST.
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ maxWidth: 600, mb: 2 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell><strong>PARKING AREA</strong></TableCell>
                  <TableCell>{parkingArea.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>LOCATION</strong></TableCell>
                  <TableCell>
                    <a
                      href={generateGoogleMapsLink(parkingArea.lat, parkingArea.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      VIEW ON GOOGLE MAPS
                    </a>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>FROM</strong></TableCell>
                  <TableCell>{new Date(startTime).toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>TO</strong></TableCell>
                  <TableCell>{new Date(endTime).toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>SLOT</strong></TableCell>
                  <TableCell>{slot}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={onBookSlotClick}>
              BOOK SLOT
            </Button>
            {paymentUrl && (
              <Button
                variant="contained"
                color="success"
                onClick={() => window.open(paymentUrl, "_blank")}
              >
                PAY TO COMPLETE BOOKING
              </Button>
            )}
          </Stack>
        </>
      )}
    </div>
  );
}
