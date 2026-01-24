import React, { useState } from "react";

import Style from "./configuracoes.module.css";

export default function TelaConfiguracoes() {
    const [menuTopo, setMenuTopo] = useState("perfil");

    return (
        <div className={Style.containerPerfil}>
            <div className={Style.divPerfil}>
                {/* Título */}
                <div className={Style.divTituloTop}>
                    <h1>
                        Configurações
                    </h1>
                    <p>
                        Gerencie suas informações pessoais e preferências
                    </p>
                </div>
                {/* Menu */}
                <div className={Style.menuTop}>
                    <div className={`
                        ${Style.opcoesMenuTop}
                        ${menuTopo === "perfil" ? Style.opcaoSelecionada : ""}
                    `}
                        onClick={() => setMenuTopo("perfil")}
                    >
                        <i className="fa-solid fa-user"></i>
                        <p>Perfil</p>
                    </div>
                    <div className={`
                        ${Style.opcoesMenuTop}
                        ${menuTopo === "seguranca" ? Style.opcaoSelecionada : ""}
                    `}
                        onClick={() => setMenuTopo("seguranca")}
                    >
                        <i className="fa-solid fa-lock"></i>
                        <p>Segurança</p>
                    </div>
                    <div className={`
                        ${Style.opcoesMenuTop}
                        ${menuTopo === "conta" ? Style.opcaoSelecionada : ""}
                    `}
                        onClick={() => setMenuTopo("conta")}
                    >
                        <i className="fa-solid fa-circle-info"></i>
                        <p>Conta</p>
                    </div>
                </div>
                {/* Formulário / Informações */}
                <div>
                    
                </div>
            </div>
        </div>
    )
}