import axios from "axios";
import MainDashboard from "../_components/mainDashboard";

const Dashboard = () => {
  return (
    <div className="my-12  pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-7 px-4 md:px-10 lg:px-16  ">
      <MainDashboard />
    </div>
  );
};

export default Dashboard;
