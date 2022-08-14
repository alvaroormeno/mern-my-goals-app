import React from 'react'
import {FaSignInAlt, FaSignOutAlt, FaUser} from 'react-icons/fa'
import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {logout, reset} from '../features/auth/authSlice.js'


function Header() {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())   
    dispatch(reset())  
    navigate('/') 
  }

  return (
    <div className='header'>
      <div className='logo'>
        <Link to='/' >GoalSetter</Link>
      </div>
      <ul>
        {user ? (
          <li>
            <button className='btn' onClick={onLogout}>
              <FaSignOutAlt/> Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to='/Register'>
                <FaUser/> Register
              </Link>
            </li>
          </>
        )}
        
      </ul>
    </div>
  )
}

export default Header