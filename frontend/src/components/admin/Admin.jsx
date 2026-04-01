import React, { useState } from "react";
// import axios from "axios";

import Style from "./admin.module.css";

// Import de Components
import Podcast from "./tabelas/Podcast";
import Usuario from "./tabelas/Usuario";
import Transcricao from "./tabelas/Transcricao";

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
                        <p>Qtd. Categorias/Temas</p>
                        <i className="fa-solid fa-arrow-trend-up" style={{ color: "#f97316" }}></i>
                    </div>
                    <h1>20</h1>
                </div>
            </div>
            {/* Menu para trocar as tabelas do admin */}
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
                        ${controle === "categorias" ? Style.opcaoSelecionada : ""}
                    `}
                    onClick={() => { setControle("categorias") }}
                >
                    <p>Categorias</p>
                </div>
                <div className={`
                        ${Style.opcoesMenu}
                        ${controle === "temas" ? Style.opcaoSelecionada : ""}
                    `}
                    onClick={() => { setControle("temas") }}
                >
                    <p>Temas</p>
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
            <div className={Style.divTabela}>
                {controle === "podcasts" && (
                    <Podcast />
                )}
                {controle === "usuarios" && (
                    <Usuario />
                )}
                {controle === "categorias" && (
                    <Transcricao />
                )}
                {controle === "temas" && (
                    <Transcricao />
                )}
                {controle === "transcricao" && (
                    <Transcricao />
                )}
            </div>
        </div>
    );
}