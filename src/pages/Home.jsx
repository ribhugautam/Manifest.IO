import React from "react";

function Home() {
  return (
    <div className="bg-slate-100 dark:bg-[#070F2B] dark:text-white p-8 flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center w-11/12 max-w-[1180px] mx-auto ">
        {/* Hero Section */}
        <section className="hero w-full max-w-4xl text-center">
          <h1 className="text-xl font-bold flex justify-center items-center gap-2 mb-2">
            Welcome to{` `}
            <div className="ring flex flex-wrap justify-center rounded items-center text-center ring-blue-500" >  
            <span className="text-blue-500 dark:bg-white/10 shadow-md bg-white rounded-l px-1 pl-2 ">
              MANIFEST
            </span>
            <span className="text-white shadow-md bg-blue-500 px-1 pr-2 rounded-r">
              .IO
            </span>
            </div>
          </h1>
        </section>
      </div>
    </div>
  );
}

export default Home;
