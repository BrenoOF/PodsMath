import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';

import Style from "./slideBar.module.css";

// Import Components

export default function CompSlideBar({ aberta, setAberta }) {
    const navigate = useNavigate();
    const location = useLocation();

    // Função para ver a Rota
    const rotaAtiva = (rota) => location.pathname === rota;

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
        try {
            localStorage.removeItem("usuarioId");
            setUserLogado(false);
            navigate("/");
        } catch (error) {
            console.error("Erro ao Realizar logout ", error);
        }
    }
    const alertSair = () => {
        Swal.fire({
            title: "Quer Realmente Sair?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sim, Quero Sair!",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#012663"
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
            }
        });
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
                <div className={`${Style.btnPadrao} ${rotaAtiva("/") ? Style.btnSelecionado : ""}`}
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    <i className="fa-regular fa-house" style={{ fontSize: "1rem" }}></i>
                    <p>Home</p>
                </div>
                <div className={`${Style.btnPadrao} ${rotaAtiva("/explorar") ? Style.btnSelecionado : ""}`}
                    onClick={() => {
                        navigate("/explorar");
                    }}
                >
                    <i className="fa-regular fa-folder" style={{ fontSize: "1rem" }}></i>
                    <p>Explorar</p>
                </div>
                {userLogado && (
                    <>
                        <div className={`${Style.btnPadrao} ${rotaAtiva("/historico") ? Style.btnSelecionado : ""}`}
                            onClick={() => {
                                navigate("/historico");
                            }}
                        >
                            <i className="fa-regular fa-clock" style={{ fontSize: "1rem" }}></i>
                            <p>Histórico</p>
                        </div>
                        <div className={`${Style.btnPadrao} ${rotaAtiva("/favoritos") ? Style.btnSelecionado : ""}`}
                            onClick={() => {
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
                        <div className={Style.divMenuLogado}>
                            <div className={`${Style.btnPadrao} ${rotaAtiva("/perfil") ? Style.btnSelecionado : ""}`}
                                onClick={() => {
                                    navigate("/configuracoes");
                                }}
                            >
                                <i className="fa-solid fa-gear" style={{ fontSize: "1rem" }}></i>
                                <p>Configurações</p>
                            </div>
                            <div className={Style.btnPadrao + " " + Style.btnSair}
                                onClick={() => { alertSair() }}
                            >
                                <i className="fa-solid fa-arrow-right-from-bracket"
                                    style={{ fontSize: "1rem" }}
                                ></i>
                                <p>Sair</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}