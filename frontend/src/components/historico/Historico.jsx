import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Style from "./historico.module.css";
import StyleExterno from "../home/carrosseis/carrosseis.module.css";

export default function TelaHistorico() {
    const navigate = useNavigate();
    const [podcastsHistorico, setPodcastsHistorico] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("/api-user/historicos/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const dadosComHistorico = response.data.map(item => {
                    const caminhoOriginal = item.imagem_caminho || "";
                    let urlImagem = "";

                    if (caminhoOriginal) {
                        const nomeArquivo = caminhoOriginal.split('/').pop();
                        urlImagem = `/api-user/imagens/file/${nomeArquivo}`;
                    }

                    return {
                        ...item,
                        img: urlImagem,
                        idPodcast: item.audios_idaudios, // Para o navigate
                        historico: true
                    };
                });

                setPodcastsHistorico(dadosComHistorico);
            } catch (error) {
                console.error("Erro ao carregar histórico", error);
            }
        }
        carregarDados();
    }, [navigate]);

    return (
        <div className={Style.containerHistorico}>
            <div className={Style.divTitulo}>
                <div className={Style.titulo}>
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    <h1>Histórico</h1>
                </div>
                <p>
                    Acompanhe os episódios que você já ouviu
                </p>
            </div>
            {podcastsHistorico.length === 0 ? (
                <div className={Style.divNaoTemPodcast}>
                    <p>
                        Você ainda não ouviu nenhum episódio.
                    </p>
                </div>
            ) : (
                <div className={StyleExterno.divPodcastsProprio}>
                    {podcastsHistorico.map(item => (
                        <div className={StyleExterno.cardProprio} key={item.id}
                            onClick={() => {
                                navigate(`/explorar/${item.idTema}/${item.playlistTema}/${item.idPodcast}`);
                            }}
                        >
                            <img src={item.img || "/imgs/podcast-default.jpg"} 
                                alt={`Capa do podcast ${item.titulo}`}
                                className={StyleExterno.imgCard} draggable="false"
                                onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                            />
                            <div className={StyleExterno.divTextosProprio}>
                                <h1>{item.titulo}</h1>
                                <p>{item.descricao}</p>
                                <div className={StyleExterno.btnAssunto}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/explorar/${item.idTema}`);
                                    }}
                                >
                                    <p>{item.assunto}</p>
                                </div>
                            </div>
                            <div className={StyleExterno.divIconProprio}>
                                <i className={`fa-solid fa-circle-play ${StyleExterno.iconPlayProprio}`}></i>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}