import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./admin.module.css";

// Import de Components
import Podcast from "./tabelas/Podcast";
import Usuario from "./tabelas/Usuario";
import Transcricao from "./tabelas/Transcricao";
import Instituicao from "./tabelas/Instituicao";
import Categoria from "./tabelas/Categoria";
import Tema from "./tabelas/Tema";

const API_BASE_URL = "/api-user";

export default function TelaAdmin() {
    const [controle, setControle] = useState("podcasts");
    const [dados, setDados] = useState([]);

    // Carregar dados quando a pagina carrega
    useEffect(() => {
        const carregarDados = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${API_BASE_URL}/estatisticas`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setDados(response.data);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        carregarDados();
    }, []);

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
                    <h1>{dados.totalPodcasts}</h1>
                </div>
                <div className={Style.card}>
                    <div className={Style.tituloCard}>
                        <p>Usuários Cadastrados</p>
                        <i className="fa-solid fa-user-group" style={{ color: "#22c55e" }}></i>
                    </div>
                    <h1>{dados.totalUsuarios}</h1>
                </div>
                <div className={Style.card}>
                    <div className={Style.tituloCard}>
                        <p>Visualizações Totais</p>
                        <i className="fa-solid fa-chart-column" style={{ color: "#a855f7" }}></i>
                    </div>
                    <h1>{dados.totalVisualizacoes}</h1>
                </div>
                <div className={Style.card}>
                    <div className={Style.tituloCard}>
                        <p>Qtd. Categorias/Temas</p>
                        <i className="fa-solid fa-arrow-trend-up" style={{ color: "#f97316" }}></i>
                    </div>
                    <h1>{dados.totalCategoriaTema}</h1>
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
                        ${controle === "instituicoes" ? Style.opcaoSelecionada : ""}
                    `}
                    onClick={() => { setControle("instituicoes") }}
                >
                    <p>Instituições</p>
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
                {controle === "instituicoes" && (
                    <Instituicao />
                )}
                {controle === "categorias" && (
                    <Categoria />
                )}
                {controle === "temas" && (
                    <Tema />
                )}
                {controle === "transcricao" && (
                    <Transcricao />
                )}
            </div>
        </div>
    );
}