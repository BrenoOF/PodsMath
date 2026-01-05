import React from "react";
import { useNavigate } from "react-router-dom";

import Style from "./slideBar.module.css";

export default function CompSlideBar() {
    const navigate = useNavigate();

    return (
        <div className={Style.containerSlideBar}>
            <div className={Style.divLogo}>
                <img src={require("../../../imgs/Logo1.png")} alt="Podsmath Logo"
                    className={Style.imgLogo} onClick={() => { navigate("/") }}
                    draggable="false" />
                <i className="fa-regular fa-square-caret-left" style={{ fontSize: "1rem", color: "#000" }}></i>
            </div>
            <div>
                <div>
                    <i ></i>
                    <p>Home</p>
                </div>
                <div>
                    <i ></i>
                    <p>Explorar</p>
                </div>
            </div>
            <div onClick={() => { navigate("/login") }}>
                <i ></i>
                <p>Entrar / Cadastrar</p>
            </div>
        </div>
    )
}