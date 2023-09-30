import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  useUserslistMutation,
  useSubscriptionListMutation,
} from "../../slices/adminApiSlice";
import {toast} from "react-toastify"

 const Dashboard = () => {
  const [usersAPI] = useUserslistMutation();
  const [SubcribtionsAPI] = useSubscriptionListMutation();
  const [chartData, setchartData] = useState(null);
  const [pieChartData, setpieChartData] = useState([]);
  const [dashboardData, setdashboardData] = useState({});
  const [noOfUsers,setNoofUsers] = useState(null);
  const [noofSubscribers,setnoOfSubscribers] = useState(null);

  useEffect(() => {
    const getChartData = async () => {
     
      const mockChartData = [
        { name: "Jan", revenue: 0, drivers: 20 },
        { name: "Feb", revenue: 60, drivers: 25 },
        { name: "Mar", revenue: 70, drivers: 30 },
        { name: "Apr", revenue: 80, drivers: 35 },
        { name: "May", revenue: 90, drivers: 40 },
        { name: "Jun", revenue: 100, drivers: 45 },
      ];

      const mockPieChartData = [
        { name: "Users", value: noOfUsers },
        { name: "Subscribe", value: noofSubscribers },
      ];

      const mockDashboardData = {
        newDrivers: 10,
        totalDrivers: 50,
        blockedDrivers: 5,
        newUsers: 20,
        totalUsers: 100,
        blockedUsers: 10,
      };

  

      setchartData(mockChartData);
      setpieChartData(mockPieChartData);
      setdashboardData(mockDashboardData);
    };
    getChartData();
  }, []);

  useEffect(() => {
    getUsersData();
  }, [dashboardData,noOfUsers,noofSubscribers]);

  const getUsersData = async()=>{
    usersAPI()
      .unwrap()
      .then((data) => {
        const userList = data.users.length;
        setNoofUsers(userList);
      })
      .catch((err) => {
       throw err;
      });
      SubcribtionsAPI().unwrap().then((data)=>{
        const subsribersList = data.subscriptions.length
        setnoOfSubscribers(subsribersList);
      }).catch((err)=>{
        throw err
      })
  }

  const COLORS = ["#0088FE", "#FFBB28", "#00C49F"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <>
      <div className="w-[81.5%] h-fit mx-auto my-[2.5rem] bg-gray-100 py-6  drop-shadow-lg">
        {!chartData || !pieChartData || !dashboardData ? (
          <>
            <div className="pr-4 mx-5 w-full text-center">
              <span>Loading</span>
            </div>
          </>
        ) : (
          <>
            <div className="w-[95%] mx-auto md:h-fit h-fit md:grid-cols-3  md:gap-8 grid  gap-5 ">
              <div className="bg-blue-700  rounded-3xl md:grid-cols-1 grid grid-rows-5 gap-1 drop-shadow-xl">
                <div className=" row-span-2 flex items-center px-3">
                  <h1 className="text-2xl font-medium text-white">
                    Total Users
                  </h1>
                </div>
                <div className=" row-span-3 flex items-center justify-end">
                  <h1 className="text-8xl px-2 text-white">{noOfUsers}</h1>
                </div>
              </div>

              <div className="bg-green-600 rounded-3xl grid grid-rows-5 gap-1 drop-shadow-xl">
                <div className=" row-span-2 flex items-center px-3">
                  <h1 className="text-2xl font-medium text-white">
                    Active Subcribtions
                  </h1>
                </div>
                <div className=" row-span-3 flex items-center justify-end">
                  <h1 className="text-8xl px-2  text-white">
                    {noofSubscribers}
                  </h1>
                </div>
              </div>

              <div className="bg-green-950  rounded-3xl grid grid-rows-5 gap-1 drop-shadow-xl">
                <div className=" row-span-2 flex items-center px-3">
                  <h1 className="text-2xl font-medium text-white">
                    Total Revenue
                  </h1>
                </div>
                <div className=" row-span-3 flex items-center justify-end">
                  <h1 className="text-8xl px-2  text-white">
                    {noofSubscribers * 1999}
                  </h1>
                </div>
              </div>
            </div>
            <div className="mt-16 md:grid-cols-2 md:gap-8 grid">
              <div>
                <h1 className="pl-8 mb-8 font-bold">
                  REVENUE
                </h1>
                {chartData && (
                  <LineChart
                    width={500}
                    height={300}
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    
                    <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
                  </LineChart>
                )}
              </div>
              <div>
                <h1 className="font-bold ml-28">PAYMENTS VS USERS</h1>
                {pieChartData && (
                  <PieChart width={400} height={220}>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                )}
                <div className="flex gap-5">
                  <h1 className="text-yellow-700 ml-32">Users</h1>
                  <h1 className="text-blue-700">Subcribers</h1>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
