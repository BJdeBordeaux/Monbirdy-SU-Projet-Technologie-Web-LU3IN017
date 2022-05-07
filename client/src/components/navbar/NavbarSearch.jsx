import React, { useState, useContext, useRef } from "react";
import {
    Nav, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Button,
} from "reactstrap";
import { BsThreeDots, BsFillPersonFill } from "react-icons/bs";
import { BiLogOut, BiHome } from 'react-icons/bi'
import "./navbar.css";
import { FaUserFriends } from "react-icons/fa";
import { UserContext } from "../../context/user/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NavbarSearch() {
    const { user, dispatch } = useContext(UserContext);
    const [navbarCollapsed, setNavbarCollapsed] = useState(false);

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    const [searchInput, setSearchInput] = useState("");
    const searchRef = useRef(null);

    const navigate = useNavigate();

    function changeCollapsed() {
        setNavbarCollapsed(!navbarCollapsed);
    }

    async function handleLogOut() {
        dispatch({ type: "LogOut" });
        sessionStorage.setItem("user", null);
        // destroy session
        await axios.get("/auth/logout", {}, { withCredentials: true });
        window.location.href = "/";
    }

    function handleShowFriends() {
        dispatch({ type: "ShowFriends" });
    }

    const handleSearch = (e) => {
        e.preventDefault();
        // redirect to the username that we search
        if (searchInput !== "") {
            window.location.href = "/profile/" + searchInput;
        }
    }

    return (
        <div>
            <nav className="topNavbar navbar navbar-expand-md navbar-light bg-light fixed-top"
            >
                <div className="container-fluid">
                    <a className="topNavbarBrand navbar-brand" href="/">
                        Monbirdy
                    </a>
                    <button aria-label="Toggle navigation" type="button" className="navbar-toggler"
                        onClick={changeCollapsed}
                    />
                    <div
                        className="topNavbarContents collapse show navbar-collapse d-flex justify-content-between"
                    >
                        <Nav
                            className="topNavbarLeft navbar-nav float-left"
                            navbar
                        >
                            {user && <NavItem onClick={handleShowFriends}>
                                <NavLink>
                                    <FaUserFriends />
                                </NavLink>
                            </NavItem>}
                        </Nav>
                        <div
                            className="topNavbarSearch d-flex"
                        >
                            <input className="form-control" placeholder="search for anyone..." name="search" type="search" ref={searchRef} onChange={() => {
                                setSearchInput(searchRef.current.value);
                            }} />
                            <Button color={"success"} onClick={handleSearch}>Search</Button>
                        </div>
                        <Nav
                            navbar
                            className="ml-auto"
                        >
                            <NavItem className="cursor-pointer">
                                <NavLink>
                                    <img src={user.profilePhoto ? PF + user.profilePhoto : `${PF}person/defaultAvatar.jpg`} alt="" className="navbarImg"/>
                                </NavLink>
                            </NavItem>
                            <UncontrolledDropdown
                                inNavbar
                                nav
                                direction="left"
                                className=" d-flex align-items-center"
                            >
                                <DropdownToggle
                                    nav
                                >
                                    <BsThreeDots />
                                </DropdownToggle>
                                <DropdownMenu
                                    flip={true}
                                    className="navbarDropdownMenu dropdown-menu-end"
                                >
                                    <DropdownItem className="d-flex align-items-center"
                                        onClick={() => navigate("/profile/" + user.username)}
                                    >
                                        <span className="">Profile</span><BsFillPersonFill className="" />
                                    </DropdownItem>
                                    <DropdownItem className="d-flex align-items-center"
                                        onClick={() => navigate("/")}
                                    >
                                        <span className="">Home</span><BiHome className="" />
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem className="d-flex align-items-center" onClick={handleLogOut}>
                                        <span className="">Log out</span><BiLogOut className="" />
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                    </div>
                </div>
            </nav>
        </div>
    );

}

