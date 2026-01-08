import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Style from "./topBar.module.css";

// Import de Componentes
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";

export default function CompTopBar({ slidebarAberta }) {
    const navigate = useNavigate();

    const [menuConfigsAberto, setMenuConfigsAberto] = useState(false);

    const aplicarTema = (modo) => {
        const themeLink = document.getElementById('theme-link');
        if (!themeLink) return;

        if (modo === 'light') {
            themeLink.href = '/themes/lara-light-blue/theme.css';
            document.body.setAttribute("data-theme", "light");
        }

        if (modo === 'dark') {
            themeLink.href = '/themes/lara-dark-blue/theme.css';
            document.body.setAttribute("data-theme", "dark");
        }

        localStorage.setItem('theme-mode', modo);
    };

    return (
        <div className={`${Style.containerTopBar} ${slidebarAberta ? Style.topBarAberta : Style.topBarFechada}`}>
            <div className={Style.divEsquerda}>
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText placeholder="Buscar..." className={Style.input} />
                </IconField>
            </div>
            <div className={Style.divDireita}>
                <div className={Style.btnPadrao} onClick={() => { navigate("/login") }} >
                    <p>Entrar</p>
                </div>
                <div className={Style.btnPadrao + " " + Style.corParaFundo} onClick={() => { navigate("/login") }} >
                    <p>Inscrever-se</p>
                </div>
                <div className={Style.btnConfigs} onClick={() => setMenuConfigsAberto(!menuConfigsAberto)}>
                    <i className="fa-solid fa-circle-half-stroke"></i>
                </div>
                <div
                    className={`${Style.menuConfigs} ${menuConfigsAberto ? Style.menuAberto : ""
                        }`}
                >
                    <span onClick={() => aplicarTema("light")}>
                        🌞 Modo claro
                    </span>
                    <span onClick={() => aplicarTema("dark")}>
                        🌙 Modo escuro
                    </span>
                </div>
            </div>
        </div>
    )
}