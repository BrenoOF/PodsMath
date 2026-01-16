import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PrimeReactContext } from 'primereact/api';

import Style from "./topBar.module.css";

// Import de Componentes
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';

export default function CompTopBar({ slidebarAberta }) {
    const navigate = useNavigate();
    const { changeTheme } = useContext(PrimeReactContext);

    const [configAtual, setConfigAtual] = useState({
        tema: localStorage.getItem("theme-mode") || "light",
        font: localStorage.getItem("font-size") || "normal"
    });

    const [menuConfigsAberto, setMenuConfigsAberto] = useState(false);

    const menuConfigsRef = useRef(null);
    const btnConfigsRef = useRef(null);
    const toast = useRef(null);

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

        toast.current.show({
            severity: 'contrast',
            summary: 'Tema alterado',
            detail: modo === 'dark'
                ? 'Modo escuro ativado'
                : 'Modo claro ativado',
            life: 2000
        });
    };

    const aplicarFonte = (tamanho) => {
        if (configAtual.font === tamanho) return;

        tamanhoFonte(tamanho);

        localStorage.setItem("font-size", tamanho);
        setConfigAtual(prev => ({
            ...prev,
            font: tamanho
        }));

        toast.current.show({
            severity: 'contrast',
            summary: 'Tamanho da Fonte Alterado',
            detail:
                tamanho === "normal" ? "Fonte normal ativada" :
                    tamanho === "large" ? "Fonte grande ativada" :
                        tamanho === "xlarge" ? "Fonte muito grande ativada" : " ",
            life: 2000
        });
    };
    const tamanhoFonte = (tamanho) => {
        let scale = 1;
        if (tamanho === "normal") scale = 1;
        if (tamanho === "large") scale = 1.1;
        if (tamanho === "xlarge") scale = 1.25;

        document.documentElement.style.setProperty("--font-scale", scale);
    }

    // ✅ Aplica o tema salvo ao recarregar a página
    useEffect(() => {
        const temaSalvo = localStorage.getItem("theme-mode" || "light");
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

    // refs para quando clicar fora do menuConfigs ele fechar
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

        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    }, [menuConfigsAberto]);

    return (
        <>
            <Toast ref={toast} position="bottom-right" />
            <div className={`${Style.containerTopBar} ${slidebarAberta ? Style.topBarAberta : Style.topBarFechada}`}>
                <div className={Style.divEsquerda}>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText placeholder="Buscar..." className={Style.input} />
                    </IconField>
                </div>
                <div className={Style.divDireita}>
                    <div className={Style.btnPadrao}
                        onClick={() => {
                            navigate("/login", { state: { mode: "login" } });
                        }}
                    >
                        <p>Entrar</p>
                    </div>
                    <div className={Style.btnPadrao + " " + Style.corParaFundo}
                        onClick={() => {
                            navigate("/login", { state: { mode: "cadastro" } });
                        }}
                    >
                        <p>Inscrever-se</p>
                    </div>
                    <div
                        ref={btnConfigsRef}
                        className={Style.btnConfigs} onClick={() => setMenuConfigsAberto(!menuConfigsAberto)}
                    >
                        <i className="fa-solid fa-circle-half-stroke"></i>
                    </div>
                    {/* Modal para controle das configurações do úsuario */}
                    <div
                        ref={menuConfigsRef}
                        className={`${Style.menuConfigs} ${menuConfigsAberto ? Style.menuAberto : ""}`}
                    >
                        <div onClick={() => aplicarTema("light")} className={Style.btnTroca}>
                            <div>
                                <i className="fa-regular fa-moon"></i>
                                <p>Modo claro</p>
                            </div>
                            {configAtual.tema === "light" && <i className="fa-solid fa-check"></i>}
                        </div>
                        <div onClick={() => aplicarTema("dark")} className={Style.btnTroca}>
                            <div>
                                <i className="fa-regular fa-sun"></i>
                                <p>Modo escuro</p>
                            </div>
                            {configAtual.tema === "dark" && <i className="fa-solid fa-check"></i>}
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
                        <div onClick={() => aplicarFonte("xlarge")} className={Style.btnTroca}>
                            <div>
                                <i className="fa-solid fa-a" style={{ fontSize: "1.1rem" }}></i>
                                <p>Fonte Muito Grande</p>
                            </div>
                            {configAtual.font === "xlarge" && <i className="fa-solid fa-check"></i>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}