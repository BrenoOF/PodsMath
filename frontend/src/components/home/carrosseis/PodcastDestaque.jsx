import React, { useEffect, useState } from "react";

import Style from "./carrosseis.module.css";

export default function CompPodcastDestaque() {

    const [podcastsDestaque, setPodcastsDestaque] = useState([]);

    useEffect(() => {
        const dadosSimulados = [
            {
                id: 1,
                titulo: "Geometria Básica",
                episodios: 8,
                img: require("../../../imgs/cardExemplo.jpg")
            },
            {
                id: 2,
                titulo: "Geometria Básica",
                episodios: 8,
                img: require("../../../imgs/cardExemplo.jpg")
            },
            {
                id: 3,
                titulo: "Geometria Básica",
                episodios: 8,
                img: require("../../../imgs/cardExemplo.jpg")
            },
            {
                id: 4,
                titulo: "Geometria Básica",
                episodios: 8,
                img: require("../../../imgs/cardExemplo.jpg")
            },
            {
                id: 5,
                titulo: "Geometria Básica",
                episodios: 8,
                img: require("../../../imgs/cardExemplo.jpg")
            },
            {
                id: 6,
                titulo: "Geometria Básica",
                episodios: 8,
                img: require("../../../imgs/cardExemplo.jpg")
            },
            {
                id: 7,
                titulo: "Geometria Básica",
                episodios: 8,
                img: require("../../../imgs/cardExemplo.jpg")
            },
            {
                id: 8,
                titulo: "Geometria Básica",
                episodios: 1,
                img: require("../../../imgs/cardExemplo.jpg")
            }
        ]

        setPodcastsDestaque(dadosSimulados);
        
    }, []);

    return (
        <div>
            <div className={Style.divTitulosDosPodcasts}>
                <i className="fa-solid fa-music"></i>
                <p>Podcasts em destaque</p>
            </div>
            <div className={Style.divCardsDestaque}>
                {podcastsDestaque.map(index => (
                    <div className={Style.cardsDestaque} key={index.id}>
                        <img src={require("../../../imgs/cardExemplo.jpg")}
                            alt={`Capa do podcast ${index.titulo}`}
                            className={Style.imgCardDestaque} draggable="false"
                        />
                        <div>
                            <h2>{index.titulo}</h2>
                            <p>{index.episodios} {index.episodios > 1 ? "episódios" : "episódio"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}