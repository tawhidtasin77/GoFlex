import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-zinc-950 border-t border-white/5 pt-10 pb-10 px-5 mt-auto'>
      <div className='max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-5'>
        <div>
          <h3 className='text-orange-500 mb-2.5'>GoFlex</h3>
          <p className='text-zinc-400 text-[0.9rem]'>Premium E-Commerce Platform.</p>
        </div>
        <div className='flex gap-5'>
          <Link to="/about" className='text-zinc-400 text-[0.9rem]'>About Us</Link>
          <Link to="/return" className='text-zinc-400 text-[0.9rem]'>Return Policy</Link>
          <Link to="/disclaimer" className='text-zinc-400 text-[0.9rem]'>Disclaimer</Link>
        </div>
        <div className='text-zinc-400 text-[0.9rem]'>
          &copy; {new Date().getFullYear()} GoFlex. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer