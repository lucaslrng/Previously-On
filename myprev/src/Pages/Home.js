import axios from "axios";
import React from "react";
import HomeBody from "../Components/HomeBody/HomeBody.js";
import MyNav from "../Components/Navbar/navbar.js";


const Home = (props) => {
    return(
        <>
            <MyNav />
            <HomeBody />
        </>
    )
}

export default Home;