import { Home, Login, Signup, Bookings, ParkingAreas, PickSlot, BookSlot, PaymentSuccessful } from "../pages";
import RequireLogin from "../components/RequireLogin";

const pages = [
  { name: "Home", path: "/", element: <Home />, hiddenTo: []},
  { name: "Login", path: "/login", element: <Login />, hiddenTo: [] },
  { name: "Signup", path: "/signup", element: <Signup />, hiddenTo: [] },
  { name: "Bookings", path: "/bookings", element: <RequireLogin><Bookings /></RequireLogin>, hiddenTo: ['guest'] },
  { name: "Parking Areas", path: "/parkingAreas", element: <RequireLogin><ParkingAreas /></RequireLogin>, hiddenTo: ['guest']},
  { name: "Pick Slot", path: "/pickSlot", element: <RequireLogin role='user'><PickSlot /></RequireLogin>, hiddenTo: ['admin', 'user', 'guest']},
  { name: "Book Slot", path: "/bookSlot", element: <RequireLogin role='user'><BookSlot /></RequireLogin>, hiddenTo: ['admin', 'user', 'guest']},
  { name: "Payment Successful", path: "/paymentSuccessful", element: <PaymentSuccessful />, hiddenTo: ['admin', 'user', 'guest'] },
  { name: "Payment Failed", path: "/paymentFailed", element: <h3>PAYMENT FAILED</h3>, hiddenTo: ['admin', 'user', 'guest'] },
];

export default pages;