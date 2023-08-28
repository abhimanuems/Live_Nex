import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import Loginpage from "./pages/Loginpage";
import SignupPage from "./pages/Signuppage";
import Homepage from "./pages/Homepage";
import store from './store';
import VideoStreaming from "./components/VideoStreaming";
import WebRTCComponent from "./components/Webtrc";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/login",
        element: <Loginpage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/video",
        element: <VideoStreaming />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
