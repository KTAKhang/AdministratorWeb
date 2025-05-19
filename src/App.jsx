import AllRoutes from "./components/AllRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <AllRoutes />
      <ToastContainer />
    </>
  );
}
