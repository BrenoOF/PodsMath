import React from "react";
import { useNavigate } from "react-router-dom";

import Style from "./topBar.module.css";

export default function CompTopBar() {
    const navigate = useNavigate();
    
    return (
        <div className={Style.containerTopBar}>
            <div>
                <i></i>
                <p>Buscar</p>
            </div>
            <div>
                <div onClick={() => { navigate("/login") }} >
                    <p>Entrar</p>
                </div>
                <div onClick={() => { navigate("/login") }} >
                    <p>Inscrever-se</p>
                </div>
                <i></i>
            </div>
        </div>
    )
}