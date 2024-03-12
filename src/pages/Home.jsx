import React, { useEffect } from 'react';
import { account } from '../appwrite/config';

function Home() {
  return (
    <div className='bg-slate-100 flex flex-col items-center justify-center h-full'>
    <div className="flex flex-col items-center justify-center w-11/12 max-w-[1180px] mx-auto ">
      {/* Hero Section */}
      <section className="hero w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome to Manifest.io</h1>
      </section>
    </div>
    </div>
  );
}

export default Home