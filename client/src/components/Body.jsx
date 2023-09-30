import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSubscriptionMutation } from "../slices/userApiSlice";
import { clearRTMPURLS } from "../slices/userDetails.js";
import Destination from "./Destination";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    dispatch(clearRTMPURLS());
  }, []);

  const handleModal = () => {
    return true;
  };
  const streamData =[]

  return (
    <div className="bg-white w-5/6 p-4">
      <p className="font-semibold text-[#576CBC] text-2xl p-2 m-2">Streams</p>
      <div className="m-2 p-2">
        <Destination onClick={handleModal} />
      </div>
      <div>
        <h4 className="text-l font-semibold mb-4">Past Streams</h4>
        <hr />
        <div className="container mx-auto p-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-gray-700">Title</th>
                <th className="px-6 py-3 text-left  text-gray-700">Started</th>
                <th className="px-6 py-3 text-left  text-gray-700">Ended</th>
              </tr>
            </thead>
            <tbody>
              {streamData.map((stream, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-6 py-4">{stream.title}</td>
                  <td className="px-6 py-4">{stream.started}</td>
                  <td className="px-6 py-4">{stream.ended}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Body;
