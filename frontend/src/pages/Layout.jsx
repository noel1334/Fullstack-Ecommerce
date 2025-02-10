import React from "react";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import SearchBar from "../Component/SearchBar";

import { Outlet } from "react-router-dom";
import ScrollToTopButton from "./ScrollToTopButton";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="pt-16 px-4 top-20 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <SearchBar />
        <Outlet />
        <ScrollToTopButton />
      </div>
      <div className="w-full bg-slate-100 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Footer />
      </div>
    </>
  );
};

export default Layout;
