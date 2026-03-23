import React, { useState } from "react";

import Style from "./admin.module.css";

export default function TelaAdmin() {
    const [controle, setControle] = useState("podcasts");

    return (
        <div className={Style.containerAdmin}>
            <div className={Style.titulo}>
                <i className="fa-solid fa-shield"></i>
                <h1>Painel Administrativo</h1>
            </div>
            <div className={Style.divCards}>
                <div className={Style.card}>
                    <div className={Style.tituloCard}>
                        <p>Total de Podcasts</p>
                        <i className="fa-regular fa-file-audio" style={{ color: "#3b82f6" }}></i>
                    </div>
                    <h1>9</h1>
                </div>
                <div className={Style.card}>
                    <div className={Style.tituloCard}>
                        <p>Usuários Cadastrados</p>
                        <i className="fa-solid fa-user-group" style={{ color: "#22c55e" }}></i>
                    </div>
                    <h1>1</h1>
                </div>
                <div className={Style.card}>
                    <div className={Style.tituloCard}>
                        <p>Visualizações Totais</p>
                        <i className="fa-solid fa-chart-column" style={{ color: "#a855f7" }}></i>
                    </div>
                    <h1>0</h1>
                </div>
                <div className={Style.card}>
                    <div className={Style.tituloCard}>
                        <p>Tempo Médio de Escuta</p>
                        <i className="fa-solid fa-arrow-trend-up" style={{ color: "#f97316" }}></i>
                    </div>
                    <h1>0m 0s</h1>
                </div>
            </div>
            <div className={Style.menuDeOpcoes}>
                <div className={`
                        ${Style.opcoesMenu}
                        ${controle === "podcasts" ? Style.opcaoSelecionada : ""}
                    `}
                    onClick={() => { setControle("podcasts") }}
                >
                    <p>Podcasts</p>
                </div>
                <div className={`
                        ${Style.opcoesMenu}
                        ${controle === "usuarios" ? Style.opcaoSelecionada : ""}
                    `}
                    onClick={() => { setControle("usuarios") }}
                >
                    <p>Usuários</p>
                </div>
                <div className={`
                        ${Style.opcoesMenu}
                        ${controle === "transcricao" ? Style.opcaoSelecionada : ""}
                    `}
                    onClick={() => { setControle("transcricao") }}
                >
                    <p>Transcrição</p>
                </div>
            </div>
            <div>
                {/* Tabelas */}
            </div>
        </div>
    );
}