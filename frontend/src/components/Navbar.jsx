import {useState } from "react";
import {Link , useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

export default function Navbar({onMenuClick}){
    const {user , logout} =useAuth();
    const [menuOpen , setMenuOpen] = useState(false);
    const navigate = useNavigate();

    function handlelogout(){
        logout();
        NavigateEvent("/login");
    }

    return(
        <header className="topbar"> 
        <button className="mobile-menu icon-button"
                onClick={onMenuClick}
                aria-label="Open-navigation">
                ☰
        </button>

        <Link className="brand" to="/">
        <span className="brand-mark">C</span>
        <span>Collab</span><span className="brand-accent">Sphere</span>
        </Link>

        <div className="topbar-right">
            <span className="environment-label">DEMO WORKSPACE</span>

        <button
            className="avatar-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Account menu" >
            {(user?.name || "D").charAt(0).toUpperCase()}
        </button>

        {menuOpen && (
          <div className="account-menu">
            <strong>{user?.name || "Developer"}</strong>
            <span>{user?.email || "demo@example.com"}</span>
            <button onClick={handlelogout}>Log out</button>
          </div>
        )}

        </div>
        </header>
    )

}