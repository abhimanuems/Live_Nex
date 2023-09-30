import React, { useEffect, useState } from 'react'
import {useSubscriptionListMutation} from '../../slices/adminApiSlice'

const Subscription = () => {
  const [subscriptionList,setSubscriptionList] = useState(null);
  const [subscriptionAPI] = useSubscriptionListMutation();
  useEffect(() => {
    getSubscriptionList();
  }, []);

  const getSubscriptionList = async()=>{
    await subscriptionAPI().unwrap().then((data)=>{
       setSubscriptionList(data.subscriptions);
    }).catch((err)=>{
     console.error(err);
    })
    
  }
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
  return (
    <div className=" w-5/6 bg-gray-100">
      <div className="bg-gray-100 text-center mt-4">
        <h1 className="text-[#19376D] text-xl font-bold">Subscription List</h1>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-screen min-h-screen bg-gray-100 flex items justify-center font-sans overflow-hidden">
          <div className="w-full lg:w-4/6">
            <div className="bg-white shadow-md rounded my-6">
              <table className="min-w-max w-full  table-auto">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">StartDate</th>
                    <th className="py-3 px-6 text-center">End Date</th>
                    <th className="py-3 px-6 text-center">Active</th>
                  </tr>
                </thead>
                {subscriptionList
                  ? subscriptionList.map((index) => (
                      <tbody className="text-gray-600 text-sm font-light">
                        <tr className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="py-3 px-6 text-left whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="font-medium">{index.email}</span>
                            </div>
                          </td>
                          <td className="py-3 px-6 text-left">
                            <div className="flex items-center">
                              <span>
                                {formatDate(index.razorpayDetails.startDate)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div className="flex items-center justify-center">
                              <span>
                                {formatDate(index.razorpayDetails.endDate)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-6 text-center">
                            <div className="flex items-center justify-center">
                              <span>
                                {index.razorpayDetails.success ? (
                                  <span className="text-green-400">
                                    Active{" "}
                                  </span>
                                ) : (
                                  <span className="text-red-400">Inactive</span>
                                )}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    ))
                  : null}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription