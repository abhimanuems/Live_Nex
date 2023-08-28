import React,{useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

const Body = () => {
  const navigate = useNavigate();
   const { userInfo } = useSelector((state) => state.auth);
   useEffect(() => {
     if (!userInfo) {
       navigate("/login");
     }
   }, [navigate, userInfo]);
  return (
    <div>

      <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded m-2 p-2">
        <Link to="/video">Create Live</Link>
      </button>
    </div>
  );
}

export default Body