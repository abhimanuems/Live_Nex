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
  const facebook = () => {
    try {
      const authWindow = window.open("http://localhost:8000/users/facebookauth");

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
    <div className="bg-white w-5/6 p-4">
      <button class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
        <Link to="/video">Create Live</Link>
      </button>

      <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        onClick={youtube}
      >
        youtube
      </button>
      <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        onClick={facebook}
      >
        facebook
      </button>
     
    </div>
  );
};

export default Body;
