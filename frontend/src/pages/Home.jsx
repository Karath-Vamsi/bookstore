import React from "react";
import heroimg from "../assets/books11.png";

const Home = () => {
    return (
        <div className="home page-bg">
            <div className="hero-text">
                <h1>Read. Learn. Share.</h1>
                <h3>COSC Book Sale for Enthusiasts</h3>
            </div>
            <div className="hero-img">
                <img src={heroimg} alt="" />
            </div>
        </div>
    );
};

export default Home;