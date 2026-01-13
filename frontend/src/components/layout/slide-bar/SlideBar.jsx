import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Style from "./slideBar.module.css";

export default function CompSlideBar({ aberta, setAberta }) {
    const navigate = useNavigate();

    const [trocar, setTrocar] = useState("Home");

    return (
        <div className={`${Style.containerSlideBar} ${!aberta ? Style.fechada : ""}`}>
            <div className={Style.divLogo}>
                <img src={require("../../../imgs/Logo1.png")} alt="Podsmath Logo"
                    className={Style.imgLogo} onClick={() => { navigate("/") }}
                    draggable="false" />
                {!aberta && (
                    <hr className={Style.linhaToggle} />
                )}
                <i className={`fa-regular fa-square-caret-left ${Style.btnToggle}`} style={{ fontSize: "1rem" }}
                    onClick={() => setAberta(!aberta)}
                ></i>
            </div>
            <div className={Style.divMenuOpcoes}>
                <div className={`${Style.btnPadrao} ${trocar === "Home" ? Style.btnSelecionado : ""}`}
                    onClick={()=>{
                        setTrocar("Home");
                        navigate("/");
                    }}
                >
                    <i className="fa-regular fa-house" style={{ fontSize: "1rem" }}></i>
                    <p>Home</p>
                </div>
                <div className={`${Style.btnPadrao} ${trocar === "Explorar" ? Style.btnSelecionado : ""}`}
                    onClick={()=>{
                        setTrocar("Explorar");
                        navigate("/explorar")
                    }}
                >
                    <i className="fa-regular fa-folder" style={{ fontSize: "1rem" }}></i>
                    <p>Explorar</p>
                </div>
            </div>
            <div className={Style.divBtnLogin}>
                <div className={Style.btnPadrao + " " + Style.btnLogin}
                    onClick={() => { navigate("/login") }}
                >
                    <i className="fa-regular fa-user" style={{ fontSize: "1rem", color: "#fff" }}></i>
                    <p>Entrar / Cadastrar</p>
                </div>
            </div>
        </div>
    )
}