import React from 'react'
import { NavLink, Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
      <header className=''>
        <nav className='flex justify-between mx-auto max-w-screen-xl'>
            <div>
                <Link to="/">
                    {/* <img src="" alt="" /> */}
                    GoFlex
                </Link>
            </div>
            <ul className='flex gap-4'>
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
