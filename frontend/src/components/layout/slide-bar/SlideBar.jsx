import React from "react";
import { useNavigate } from "react-router-dom";

import Style from "./slideBar.module.css";

export default function CompSlideBar() {
    const navigate = useNavigate();

    return(
        <div className={Style.containerSlideBar}>
            <div>
                <img />

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