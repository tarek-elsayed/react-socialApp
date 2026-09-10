import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export default function Navbar() {
  const { userToken, setUserToken } = useContext(UserContext);
  let navigate = useNavigate();



  let signOut = ()=>{;
    localStorage.removeItem('userToken');
    setUserToken(null);
    navigate('/login')
  }
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm px-16 fixed z-10">
        <div className="flex-1">
          <Link to={'/home'} className="btn btn-ghost text-xl">Social App</Link>
        </div>

        <div className="flex gap-6">
          {!userToken ? <ul className="flex gap-5 items-center">
            <li>
              <Link to={"/"}>Register</Link>
            </li>
            <li>
              <Link to={"/login"}>Login</Link>
            </li>
          </ul> :
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to={'profile'} className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link to={'bookmarks'} className="justify-between">
                  Saved Posts
                </Link>
              </li>
              <li>
                <Link to={'changepassword'} className="justify-between">
                  Change Password
                </Link>
              </li>
              <li>
                <button onClick={()=>{
                  signOut()
                }}>Logout</button>
              </li>
            </ul>
          </div>}
          
            
        </div>
      </div>
    </>
  );
}
