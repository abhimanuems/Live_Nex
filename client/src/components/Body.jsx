import React, { useEffect ,useState} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
 import {
   useSubscriptionMutation,
 } from "../slices/userApiSlice";
import Destination from "./Destination";
 


const Body = () => {
  const navigate = useNavigate();
   const [pro, setPro] = useState();
  const { userInfo } = useSelector((state) => state.auth);
  const [subscribe] = useSubscriptionMutation();
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const isSubscribed = subscribe().unwrap();
    if (isSubscribed) {
      setPro(true);
    } else {
      setPro(false);
    }
  }, []);
 
  const handleModal =()=>{
    return true
  }

  return (
    <div className="bg-white w-5/6 p-4">
      <p className="font-semibold text-[#576CBC] text-2xl p-2 m-2">Streams</p>
      <Destination onClick={handleModal} />
    </div>
  );
};

export default Body;
