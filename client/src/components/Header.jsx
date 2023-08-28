import React from "react";
import { useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../slices/userApiSlice";
import { logout } from "../slices/authSlice";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
      try {
        console.log("enetr here")
         const res =await logoutApiCall().unwrap();
        dispatch(logout());
        navigate("/login");
        toast.error("logout successfully");
      } catch (err) {
        // toast.error(err.message);
        console.log(err)
      }
    };
    return (
      <header className="flex items-center justify-between bg-blue-600 p-4">
        <div className="flex items-center space-x-2">
          <span className="text-white font-bold text-lg">LiveNex</span>
        </div>
        <div className="flex space-x-4">
          <button className="text-white font-medium">Account</button>
          <button className="text-white font-medium" onClick={logoutHandler}>
            Logout
          </button>
        </div>
      </header>
    );
};

export default Header;
