import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import "../styles/navbar.css"
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useSelector } from "react-redux"

const Navbar = () => {

  const {user, logout} = useContext(AuthContext);
  
  return (
    <>
      <header className=''>
        <nav className='nav flex justify-between items-center py-[18px] px-[50px]'>
            <div className='navbar-brand text-3xl font-bold'>
                <Link to="/" className='text-white flex tracking-[-1px] items-center gap-[10px] text-shadow-[0_2px_10px_rgba(249,115,22,0.3)]'>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRolOGpcRAxT-Njm-IVby_eOGcn4VJcUXCOqYwV7o7d6g&s=10" alt="GoFlex-logo" className='h-9 w-9 rounded-lg object-cover drop-shadow-[0_2px_8px_rgba(249,115,22,0.35)]' />
                    GoFlex
                </Link>
            </div>
            <ul className='navbar-links flex gap-7'>
                <li><NavLink to={'/shop'}>Shop</NavLink></li>
                <li><NavLink to={'/cart'}>Cart</NavLink></li>
                <li><NavLink to={'/profile'}>Profile</NavLink></li>
                <li><NavLink to={'#'}>Sign in</NavLink></li>
            </ul>
        </nav>
      </header>
    </>
  )
}

export default Navbar
