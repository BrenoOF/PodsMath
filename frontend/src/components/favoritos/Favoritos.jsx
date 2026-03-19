import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Style from "./favoritos.module.css";
import StyleExterno from "../home/carrosseis/carrosseis.module.css";

export default function TelaFavoritos() {
    const navigate = useNavigate();
    const [podcastsFavoritos, setPodcastsFavoritos] = useState([]);

    const toggleFavorito = async (id, statusAtual) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            if (statusAtual) {
                await axios.delete(`/api-user/favoritos/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`/api-user/favoritos`, 
                    { audios_idaudios: id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            // Atualiza apenas o status visual, mantendo o item na página
            setPodcastsFavoritos((prev) =>
                prev.map((podcast) =>
                    podcast.id === id ? { ...podcast, favorito: !statusAtual } : podcast
                )
            );
        } catch (error) {
            console.error("Erro ao alternar favorito", error);
        }
    };

    useEffect(() => {
        const carregarDados = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get("/api-user/favoritos/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const dadosComFavorito = response.data.map(item => {
                    const caminhoOriginal = item.imagem_caminho || "";
                    let urlImagem = "";

                    if (caminhoOriginal) {
                        const nomeArquivo = caminhoOriginal.split('/').pop();
                        urlImagem = `/api-user/imagens/file/${nomeArquivo}`;
                    }

                    return {
                        ...item,
                        img: urlImagem,
                        idPodcast: item.id, // Para o navigate
                        favorito: true
                    };
                });

                setPodcastsFavoritos(dadosComFavorito);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        carregarDados();
    }, [navigate]);

    return (
        <div className={Style.containerFavoritos}>
            <div className={Style.divTitulo}>
                <div className={Style.titulo}>
                    <i className="fa-solid fa-heart"></i>
                    <h1>Meus Favoritos</h1>
                </div>
                <p>
                    {podcastsFavoritos.length === 0 ? "Você não possui nenhum podcast salvo" : `
                        ${podcastsFavoritos.length} 
                        ${podcastsFavoritos.length === 1 ? "podcast salvo" : "podcasts salvos"}
                    `}
                </p>
            </div>
            <div className={Style.divCardNovidade}>
                {podcastsFavoritos.map(item => (
                    <div className={StyleExterno.cardNovidade} key={item.id}
                        onClick={() => {
                            navigate(`/explorar/${item.idTema}/${item.playlistTema}/${item.idPodcast}`);
                        }}
                    >
                        <div className={StyleExterno.divImgCardNovidade}>
                            <img src={item.img  || "/imgs/podcast-default.jpg"} alt={item.titulo}
                                className={StyleExterno.imgCard} draggable="false"
                                onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                            />
                        </div>
                        <h1>{item.titulo}</h1>
                        <p>{item.descricao}</p>
                        <div className={Style.divAcoesBottom}>
                            <div className={StyleExterno.btnAssunto}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/explorar/${item.idTema}`);
                                }}
                            >
                                <p>{item.assunto}</p>
                            </div>
                            <div className={`
                                ${Style.divCoracao}
                                ${!item.favorito ? Style.apagadaCoracao : ""}
                            `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorito(item.id, item.favorito);
                                }}
                            >
                                {item.favorito ? (
                                    <i className="fa-solid fa-heart"></i>
                                ) : (
                                    <i className="fa-solid fa-heart-crack"></i>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}