import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./favoritos.module.css";

export default function TelaFavoritos() {
    const [podcastsFavoritos, setPodcastsFavoritos] = useState(null);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const response = await axios.get("/podcasts.json");
                setPodcastsFavoritos(response.data.novidades);
            } catch (error) {
                console.error("Erro ao carregar dados da home", error);
            }
        }
        carregarDados();
    }, []);

    if (!podcastsFavoritos) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={Style.containerFavoritos}>
            <div className={Style.divTitulo}>
                <div className={Style.titulo}>
                    <i className="fa-solid fa-heart"></i>
                    <h1>Meus Favoritos</h1>
                </div>
                <p>3 podcasts salvos</p>
            </div>
            <div className={Style.divCardNovidade}>
                {podcastsFavoritos.map(item => (
                    <div className={Style.cardNovidade} key={item.id}>
                        <div className={Style.divImgCardNovidade}>
                            <img src={item.img} alt={item.titulo}
                                className={Style.imgCard} draggable="false"
                            />
                            <i className={`fa-solid fa-circle-play ${Style.iconPlay}`}></i>
                        </div>
                        <h1>{item.titulo}</h1>
                        <p>{item.descricao}</p>
                        <div className={Style.btnAssunto}>
                            <p>{item.assunto}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}