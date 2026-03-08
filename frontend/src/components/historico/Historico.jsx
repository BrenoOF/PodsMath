import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./historico.module.css";
import StyleExterno from "../home/carrosseis/carrosseis.module.css";

export default function TelaHistorico() {
    const [podcastsHistorico, setPodcastsHistorico] = useState([]);
    const [controle, setControle] = useState("maisRecente");

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const response = await axios.get("/dados/podcasts.json");

                const dadosComHistorico = response.data.podcastsProprios.map(item => ({
                    ...item,
                    historico: true
                }));

                setPodcastsHistorico(dadosComHistorico);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        carregarDados();
    }, []);

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
            <div className={Style.menuTop}>
                <div className={`
                    ${Style.opcoesMenuTop}
                    ${controle === "maisRecente" ? Style.opcaoSelecionada : ""}
                `}
                    onClick={() => { setControle("maisRecente") }}
                >
                    <p>Mais Recentes</p>
                </div>
                <div className={`
                    ${Style.opcoesMenuTop}
                    ${controle === "maisOuvido" ? Style.opcaoSelecionada : ""}
                `}
                    onClick={() => { setControle("maisOuvido") }}
                >
                    <p>Mais Ouvidos</p>
                </div>
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
                        <div className={StyleExterno.cardProprio} key={item.id}>
                            <img src={item.img} alt={`Capa do podcast ${item.titulo}`}
                                className={StyleExterno.imgCard} draggable="false"
                            />
                            <div className={StyleExterno.divTextosProprio}>
                                <h1>{item.titulo}</h1>
                                <p>{item.descricao}</p>
                                <div className={StyleExterno.btnAssunto}>
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