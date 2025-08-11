import Navbars from "../components/Sections/Navbars";
import Footers from "../components/Sections/Footers";
import { Outlet } from "react-router-dom";
import React from "react";

const Layout = () => {
  const [query, setQuery] = React.useState("");
  return (
    <div className="font-lexend max-w-[1920px] mx-auto">
      <Navbars query={query} setQuery={setQuery} />
      <Outlet context={{ query }} />
      <Footers />
    </div>
  );
};

export default Layout;
