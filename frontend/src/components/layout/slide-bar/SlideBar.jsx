import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Style from "./slideBar.module.css";

export default function CompSlideBar({ aberta, setAberta }) {
    const navigate = useNavigate();

    const [trocar, setTrocar] = useState("Home");

    // Verificação se está Logado
    const [userLogado, setUserLogado] = useState(false);
    const usuarioId = localStorage.getItem("usuarioId");

    useEffect(() => {
        if (!usuarioId) {
            setUserLogado(false);
            return;
        };

        setUserLogado(true);
    }, [usuarioId]);

    // Fazer Logout
    const logout = () => {
        localStorage.removeItem("usuarioId");

        setUserLogado(false);

        navigate("/");
    }

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
                    onClick={() => {
                        setTrocar("Home");
                        navigate("/");
                    }}
                >
                    <i className="fa-regular fa-house" style={{ fontSize: "1rem" }}></i>
                    <p>Home</p>
                </div>
                <div className={`${Style.btnPadrao} ${trocar === "Explorar" ? Style.btnSelecionado : ""}`}
                    onClick={() => {
                        setTrocar("Explorar");
                        navigate("/explorar");
                    }}
                >
                    <i className="fa-regular fa-folder" style={{ fontSize: "1rem" }}></i>
                    <p>Explorar</p>
                </div>
                {userLogado && (
                    <>
                        <div className={`${Style.btnPadrao} ${trocar === "Histórico" ? Style.btnSelecionado : ""}`}
                            onClick={() => {
                                setTrocar("Histórico");
                                navigate("/historico");
                            }}
                        >
                            <i className="fa-regular fa-clock" style={{ fontSize: "1rem" }}></i>
                            <p>Histórico</p>
                        </div>
                        <div className={`${Style.btnPadrao} ${trocar === "Favoritos" ? Style.btnSelecionado : ""}`}
                            onClick={() => {
                                setTrocar("Favoritos");
                                navigate("/favoritos");
                            }}
                        >
                            <i className="fa-regular fa-heart" style={{ fontSize: "1rem" }}></i>
                            <p>Favoritos</p>
                        </div>
                    </>
                )}
            </div>
            <div className={Style.divBtnLogin}>
                {!userLogado ? (
                    <>
                        <div className={Style.btnPadrao + " " + Style.btnLogin}
                            onClick={() => { navigate("/login") }}
                        >
                            <i className="fa-regular fa-user" style={{ fontSize: "1rem", color: "#fff" }}></i>
                            <p>Entrar / Cadastrar</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={Style.btnPadrao + " " + Style.btnLogin}
                            onClick={() => { navigate("/perfil") }}
                        >
                            <i className="fa-solid fa-gear"
                                style={{ fontSize: "1rem", color: "#fff" }}
                            ></i>
                            <p>Configurações</p>
                        </div>
                        <div className={Style.btnPadrao + " " + Style.btnLogin}
                            onClick={() => { logout() }}
                        >
                            <i className="fa-solid fa-arrow-right-from-bracket"
                                style={{ fontSize: "1rem", color: "#fff" }}
                            ></i>
                            <p>Sair</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}