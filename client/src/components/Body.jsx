import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Body = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);
  const youtube = () => {
    try {
      const authWindow = window.open("http://localhost:8000/users/youtubeAuth");

      const messageListener = (event) => {
        if (event.origin === "http://localhost:8000") {
          const response = event.data;

          authWindow.close();
          window.removeEventListener("message", messageListener);
          if (response) navigate("/");
        }
      };
      window.addEventListener("message", messageListener);
    } catch (error) {
      if (error) throw error;
    }
  };

  return (
    <div>
      <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-2 p-2">
        <Link to="/video">Create Live</Link>
      </button>
      <button
        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-2 p-2"
        onClick={youtube}
      >
        youtube
      </button>
    </div>
  );
};

export default Body;
