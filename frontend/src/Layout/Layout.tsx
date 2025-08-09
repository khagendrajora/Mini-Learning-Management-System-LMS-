import Navbars from "../components/Sections/Navbars";
import Footers from "../components/Sections/Footers";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="font-lexend max-w-[1920px] mx-auto">
      <Navbars />
      <Outlet />
      <Footers />
    </div>
  );
};

export default Layout;
