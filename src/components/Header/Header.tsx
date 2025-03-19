import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import HeaderStyle from "../Header/HeaderStyle.module.css";
import { useState } from "react";
import logotyp from "../../assets/logotyp.svg";

function Header() {
    //Hämta user from context
    const { user, logout } = useAuth();

    //visa meny
    const [showMenu, setMenu] = useState(false);

    //Toggla meny
    const toggleMenuBar = () => {

        setMenu(value => !value)
    }

    return (
        <>
            <header className={HeaderStyle.header}>
                <div className={HeaderStyle.headerContainer}>

                    <NavLink to="/"><img src={`${logotyp}`} alt="logotyp" style={{ display: "block" }} /></NavLink>

                    <nav className={`${HeaderStyle.navMain} ${showMenu ? HeaderStyle.navMobil : ""}`}>
                        <ul>
                            <li><NavLink to="/" onClick={toggleMenuBar} className={({ isActive }) => isActive ? HeaderStyle.active : ""}>Böcker</NavLink></li>

                            {user &&
                                <li>
                                    <NavLink to="/mypage" onClick={toggleMenuBar} className={({ isActive }) => isActive ? HeaderStyle.active : ""}>Min sida</NavLink>
                                </li>
                            }
                            <li>
                                {
                                    !user ? <NavLink to="/login" onClick={toggleMenuBar} className={({ isActive }) => isActive ? HeaderStyle.active : ""}>Logga in</NavLink> : <NavLink to="/login" onClick={() => { toggleMenuBar(); logout(); }} className={({ isActive }) => isActive ? HeaderStyle.active : ""}>Logga ut</NavLink>
                                }
                            </li>
                        </ul>
                        <div className={`${HeaderStyle.hamburger} ${showMenu ? HeaderStyle.hamburger && HeaderStyle.active : ""}`} onClick={toggleMenuBar}>
                            <span className={HeaderStyle.bar}></span>
                            <span className={HeaderStyle.bar}></span>
                            <span className={HeaderStyle.bar}></span>
                        </div>
                    </nav>


                </div>
            </header>
        </>
    )
}

export default Header