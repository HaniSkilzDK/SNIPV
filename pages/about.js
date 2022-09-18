import Head from "next/head";
import React from "react";
import About from "../components/SnipvInfo/About";
import Heading from "../components/SnipvInfo/Heading";
import SidebarInfo from "../components/SnipvInfo/Sidebar";

const about = () => {
  return (
    <div className="min-h-[80vh]">
      <Head>
        <title>Om SNIPV</title>
        <meta name="description" content="Created by Peter G" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div>
          <Heading />
        </div>
        <div className="flex gap-4">
          <div>
            <SidebarInfo />
          </div>
          <div className="w-full">
            <About />
          </div>
        </div>
      </div>
    </div>
  );
};

export default about;
