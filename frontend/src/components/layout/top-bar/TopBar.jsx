import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { PrimeReactContext } from 'primereact/api';
import { useMatchMedia } from 'primereact/hooks';

import Style from "./topBar.module.css";

// Import de Componentes
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';

export default function CompTopBar({ slidebarAberta, alertSair, userLogado, setUserLogado }) {
    const navigate = useNavigate();
    const { changeTheme } = useContext(PrimeReactContext);
    const [menuUserAberto, setMenuUserAberto] = useState(false);

    // Gerenciamento de Configuração do sistema pelo User
    const [configAtual, setConfigAtual] = useState({
        tema: localStorage.getItem("theme-mode") || "light",
        font: localStorage.getItem("font-size") || "normal"
    });

    // Gerenciamento de Linguagens
    const [selectLinguaAberto, setSelectLinguaAberto] = useState(false);
    const selectLinguaRef = useRef(null);
    // Gerenciamento de Temas
    const [selectTemaAberto, setSelectTemaAberto] = useState(false);
    const selectTemaRef = useRef(null);

    // opções de temas (dps simular com json)
    const temas = [
        { label: "Modo claro", value: "light" },
        { label: "Modo escuro", value: "dark" }
    ];

    const [temaSelecionado, setTemaSelecionado] = useState(localStorage.getItem("theme-mode") || "light");
    const mudarTema = (tema) => {
        setTemaSelecionado(tema);
        aplicarTema(tema);
    };

    // opções de linguas (dps simular com json)
    const linguas = [
        { label: "Português", value: "pt-br", icon: "br" },
        { label: "Inglês", value: "us", icon: "us" },
        { label: "Espanhol", value: "es", icon: "es" }
    ];

    const [linguaSelecionada, setLinguaSelecionada] = useState(localStorage.getItem("app-language") || "pt-br");
    const mudarLingua = (lingua) => {
        if (linguaSelecionada === lingua) return;

        setLinguaSelecionada(lingua);
        localStorage.setItem("app-language", lingua);

        toast.current.show({
            severity: 'info',
            summary: 'Idioma alterado',
            detail: `Idioma alterado para ${lingua}`,
            life: 2000
        });
    };

    // Mudança do Tema
    const aplicarTema = (modo) => {
        if (configAtual.tema === modo) return;

        if (modo === 'light') {
            changeTheme(
                "/themes/lara-dark-blue/theme.css",
                "/themes/lara-light-blue/theme.css",
                "theme-link"
            )
            document.documentElement.setAttribute("data-theme", "light");
        }

        if (modo === 'dark') {
            changeTheme(
                "/themes/lara-light-blue/theme.css",
                "/themes/lara-dark-blue/theme.css",
                "theme-link"
            )
            document.documentElement.setAttribute("data-theme", "dark");
        }

        localStorage.setItem("theme-mode", modo);
        setConfigAtual(prev => ({
            ...prev,
            tema: modo
        }));

        // Dispara um Evento para Mudança de Temas
        window.dispatchEvent(new CustomEvent("themeChange", {
            detail: modo
        }));

        toast.current.show({
            severity: 'info',
            summary: 'Tema alterado',
            detail: `Tema alterado para ${modo}`,
            life: 2000
        });
    };

    // Mudança de Fonte
    const aplicarFonte = (tamanho) => {
        if (configAtual.font === tamanho) return;

        tamanhoFonte(tamanho);

        localStorage.setItem("font-size", tamanho);
        setConfigAtual(prev => ({
            ...prev,
            font: tamanho
        }));

        // Dispara um Evento para Mudança de Fonte
        window.dispatchEvent(new CustomEvent("fontChange", {
            detail: tamanho
        }));

        toast.current.show({
            severity: 'info',
            summary: 'Tamanho da Fonte Alterado',
            detail:
                tamanho === "small" ? "Fonte pequena ativada" :
                    tamanho === "normal" ? "Fonte normal ativada" :
                        tamanho === "large" ? "Fonte grande ativada" : " ",
            life: 2000
        });
    };
    const tamanhoFonte = (tamanho) => {
        let scale = 1;
        if (tamanho === "small") scale = 0.9;
        if (tamanho === "normal") scale = 1;
        if (tamanho === "large") scale = 1.1;

        document.documentElement.style.setProperty("--font-scale", scale);
    }

    // ✅ Aplica o tema salvo ao recarregar a página
    useEffect(() => {
        const temaSalvo = localStorage.getItem("theme-mode") || "light";
        const fonteSalva = localStorage.getItem("font-size") || "normal";

        tamanhoFonte(fonteSalva);

        document.documentElement.setAttribute("data-theme", temaSalvo);

        if (temaSalvo === "dark") {
            changeTheme(
                "/themes/lara-light-blue/theme.css",
                "/themes/lara-dark-blue/theme.css",
                "theme-link"
            );
        } else {
            changeTheme(
                "/themes/lara-dark-blue/theme.css",
                "/themes/lara-light-blue/theme.css",
                "theme-link"
            );
        }
    }, [changeTheme]);

    // Busca dados do User
    const [dadosUser, setDadosUser] = useState(null);

    useEffect(() => {
        const buscarDadosUsuario = async () => {
            if (!userLogado) return;
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const response = await fetch("/api-user/usuarios/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    setUserLogado(false);
                    return;
                }

                const data = await response.json();
                const caminhoOriginal = data.caminho_imagem || "";
                let urlImagem = "";
                if (caminhoOriginal) {
                    const nomeArquivo = caminhoOriginal.split('/').pop();
                    urlImagem = `/api-user/imagens/file/${nomeArquivo}`;
                }

                setDadosUser({ ...data, img: urlImagem });
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            }
        };

        buscarDadosUsuario();
    }, [userLogado, setUserLogado]);

    // Verificação se está Logado
    useEffect(() => {
        if (!userLogado) {
            setDadosUser(null);
        }
    }, [userLogado]);

    // Refs para quando clicar fora do menuConfigs ele fechar
    const toast = useRef(null);

    const [menuConfigsAberto, setMenuConfigsAberto] = useState(false);
    const menuConfigsRef = useRef(null);
    const btnConfigsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuConfigsAberto &&
                menuConfigsRef.current &&
                !menuConfigsRef.current.contains(event.target) &&
                !btnConfigsRef.current.contains(event.target)
            ) {
                setMenuConfigsAberto(false);
            }
        };

        document.addEventListener("pointerdown", handleClickOutside);
        return () => { document.removeEventListener("pointerdown", handleClickOutside) };
    }, [menuConfigsAberto]);

    // Refs User Mobile
    const [modalUserMobileAberto, setModalUserMobileAberto] = useState(false);
    const mobileConfigsRef = useRef(null);
    const btnMobileConfigsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                modalUserMobileAberto &&
                mobileConfigsRef.current &&
                !mobileConfigsRef.current.contains(event.target) &&
                !btnMobileConfigsRef.current.contains(event.target)
            ) {
                setModalUserMobileAberto(false);
            }
        };

        document.addEventListener("pointerdown", handleClickOutside);
        return () => { document.removeEventListener("pointerdown", handleClickOutside) };
    }, [modalUserMobileAberto]);

    // Verificação de mobile
    const mobile = useMatchMedia('(max-width: 769px)');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectLinguaRef.current && !selectLinguaRef.current.contains(event.target)) {
                setSelectLinguaAberto(false);
            }
        };
        document.addEventListener("pointerdown", handleClickOutside);
        return () =>
            document.removeEventListener("pointerdown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectTemaRef.current && !selectTemaRef.current.contains(event.target)) {
                setSelectTemaAberto(false);
            }
        };
        document.addEventListener("pointerdown", handleClickOutside);
        return () =>
            document.removeEventListener("pointerdown", handleClickOutside);
    }, []);

    return (
        <>
            <Toast ref={toast} position="bottom-right" />
            <div className={`${Style.containerTopBar} ${slidebarAberta ? Style.topBarAberta : Style.topBarFechada}`}>
                <div className={Style.divEsquerda}>
                    <IconField iconPosition="left" className={Style.ajusteInput}>
                        <InputIcon className="pi pi-search" />
                        <InputText placeholder="Buscar..." className={Style.input} />
                    </IconField>
                </div>
                <div className={Style.divDireita}>
                    {!userLogado ? (
                        <>
                            <div className={Style.btnPadrao}
                                onClick={() => {
                                    navigate("/login", { state: { mode: "login" } });
                                }}
                            >
                                <p>Entrar</p>
                            </div>
                            <div className={Style.btnPadrao + " " + Style.corParaFundo + " " + Style.ajusteMobile}
                                onClick={() => {
                                    navigate("/login", { state: { mode: "cadastro" } });
                                }}
                            >
                                <p>Inscrever-se</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className={Style.divInfoPerfil}
                                onClick={() => { setMenuUserAberto(!menuUserAberto) }}
                            >
                                <div className={Style.divInfoTexto}>
                                    <h1>{dadosUser?.nome}</h1>
                                    <p>{dadosUser?.email}</p>
                                </div>
                                <img src={dadosUser?.img || "/imgs/avatar-default.png"} alt="foto de perfil"
                                    className={Style.imgPerfil} draggable="false"
                                    ref={btnMobileConfigsRef}
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        if (mobile) {
                                            setModalUserMobileAberto(!modalUserMobileAberto);
                                        } else {
                                            navigate("/perfil");
                                        }
                                    }}
                                    onError={(e) => (e.target.src = "/imgs/avatar-default.png")}
                                />
                            </div>
                        </>
                    )}
                    <div
                        ref={btnConfigsRef}
                        className={Style.btnConfigs} onClick={() => setMenuConfigsAberto(!menuConfigsAberto)}
                    >
                        <i className="fa-solid fa-circle-half-stroke"></i>
                    </div>
                    {/* Modal para navegação mobile */}
                    {mobile && modalUserMobileAberto && (
                        <div
                            ref={mobileConfigsRef}
                            className={`${Style.menuConfigs} ${modalUserMobileAberto ? Style.menuAberto : ""}`}
                        >
                            <div className={Style.modalInfoUser}>
                                <h1>{dadosUser?.nome}</h1>
                                <p>{dadosUser?.email}</p>
                            </div>
                            <hr className={Style.hrSeparacao} />
                            <div onClick={() => {
                                navigate("/perfil");
                                setModalUserMobileAberto(false);
                            }}
                                className={Style.btnTroca}
                            >
                                <div>
                                    <i className="fa-solid fa-gear"
                                        style={{ fontSize: "1.1rem" }}
                                    ></i>
                                    <p>Configurações</p>
                                </div>
                            </div>
                            <div onClick={() => {
                                navigate("/admin");
                                setModalUserMobileAberto(false);
                            }}
                                className={Style.btnTroca}
                            >
                                <div>
                                    <i className="fa-solid fa-user-shield"
                                        style={{ fontSize: "1.1rem" }}
                                    ></i>
                                    <p>Admin</p>
                                </div>
                            </div>
                            <div onClick={() => alertSair()} className={Style.btnTroca + " " + Style.modalBtnSair}>
                                <div>
                                    <i className="fa-solid fa-arrow-right-from-bracket"
                                        style={{ fontSize: "1.1rem" }}
                                    ></i>
                                    <p>Sair</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Modal para controle das configurações do úsuario */}
                    <div
                        ref={menuConfigsRef}
                        className={`${Style.menuConfigs} ${menuConfigsAberto ? Style.menuAberto : ""}`}
                    >
                        <div className={Style.divTituloConfig}>
                            <h1>Idioma</h1>
                        </div>
                        <div ref={selectLinguaRef} className={Style.selectContainer}>
                            <div className={Style.selectSelecionado} onClick={() => setSelectLinguaAberto(!selectLinguaAberto)}>
                                {linguas.find(t => t.value === linguaSelecionada)?.label}
                                <span className={Style.selectSeta}>
                                    <i className="fa-solid fa-angle-down" style={{ fontSize: "0.9rem" }}></i>
                                </span>
                            </div>
                            {selectLinguaAberto && (
                                <div className={Style.selectMenu}>
                                    {linguas.map((item) => (
                                        <div
                                            key={item.value}
                                            className={Style.btnTroca}
                                            onClick={() => {
                                                mudarLingua(item.value);
                                                setSelectLinguaAberto(false);
                                            }}
                                        >
                                            <span className={`fi fi-${item.icon}`}></span>
                                            {item.label}
                                            {item.value === linguaSelecionada &&
                                                <i className="fa-solid fa-check"></i>
                                            }
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <hr className={Style.hrSeparacaoConfig} />
                        <div className={Style.divTituloConfig}>
                            <h1>Temas</h1>
                        </div>
                        <div ref={selectTemaRef} className={Style.selectContainer}>
                            <div className={Style.selectSelecionado} onClick={() => setSelectTemaAberto(!selectTemaAberto)}>
                                {temas.find(t => t.value === temaSelecionado)?.label}
                                <span className={Style.selectSeta}>
                                    <i className="fa-solid fa-angle-down" style={{ fontSize: "0.9rem" }}></i>
                                </span>
                            </div>
                            {selectTemaAberto && (
                                <div className={Style.selectMenu}>
                                    {temas.map((item) => (
                                        <div
                                            key={item.value}
                                            className={Style.btnTroca}
                                            onClick={() => {
                                                mudarTema(item.value);
                                                setSelectTemaAberto(false);
                                            }}
                                        >
                                            {item.label}
                                            {item.value === temaSelecionado &&
                                                <i className="fa-solid fa-check"></i>
                                            }
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <hr className={Style.hrSeparacaoConfig} />
                        <div className={Style.divTituloConfig}>
                            <h1>Fonts</h1>
                        </div>
                        <div onClick={() => aplicarFonte("small")} className={Style.btnTroca}>
                            <div>
                                <i className="fa-solid fa-a" style={{ fontSize: "0.5rem" }}></i>
                                <p>Fonte Pequena</p>
                            </div>
                            {configAtual.font === "small" && <i className="fa-solid fa-check"></i>}
                        </div>
                        <div onClick={() => aplicarFonte("normal")} className={Style.btnTroca}>
                            <div>
                                <i className="fa-solid fa-a" style={{ fontSize: "0.75rem" }}></i>
                                <p>Fonte Normal</p>
                            </div>
                            {configAtual.font === "normal" && <i className="fa-solid fa-check"></i>}
                        </div>
                        <div onClick={() => aplicarFonte("large")} className={Style.btnTroca}>
                            <div>
                                <i className="fa-solid fa-a" style={{ fontSize: "1rem" }}></i>
                                <p>Fonte Grande</p>
                            </div>
                            {configAtual.font === "large" && <i className="fa-solid fa-check"></i>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}