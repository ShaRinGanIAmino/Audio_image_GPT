import { Outlet } from "react-router-dom";
const HomeLayout = () => {
  return (
    <div className=" h-screen w-screen">
      <Outlet />
    </div>
  );
};

export default HomeLayout;
