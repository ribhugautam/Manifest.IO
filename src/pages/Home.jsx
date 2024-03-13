import React, { useEffect } from "react";
import { account } from "../appwrite/config";

function Home() {
  return (
    <div className="bg-slate-100 flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center w-11/12 max-w-[1180px] mx-auto ">
        {/* Hero Section */}
        <section className="hero w-full max-w-4xl text-center">
          <h1 className="text-xl font-bold mb-2">
            Welcome to{" "}
            <span className="text-blue-500 shadow-md bg-white rounded-l px-1 pl-2 ">
              MANIFEST
            </span>
            <span className="text-white shadow-md bg-blue-500 px-1 pr-2 rounded-r">
              .IO
            </span>
          </h1>
        </section>
      </div>
    </div>
  );
}

export default Home;
