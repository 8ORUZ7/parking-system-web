import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { displayNotification } from "../redux/notificationSlice";
import { confirmSuccessfulPaymentApi } from "../common/axiosClient";

export default function PaymentSuccessful() {
  const sessionId = new URLSearchParams(window.location.search).get("sessionId");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!sessionId) return;

    confirmSuccessfulPaymentApi(sessionId)
      .then((res) => {
        dispatch(displayNotification({ message: res.message, type: "success" }));
      })
      .catch((err) => {
        dispatch(displayNotification({ message: String(err), type: "error" }));
      });
  }, [sessionId, dispatch]);

  return (
    <div>
      <h3>{sessionId ? "PAYMENT SUCCESSFUL" : "PAYMENT FAILED"}</h3>
    </div>
  );
}
