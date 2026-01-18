import React from "react";

import Style from "./carrosseis.module.css";

export default function CompPodcastDestaque({ podcasts }) {
    return (
        <div>
            <div className={Style.divTitulosDosPodcasts}>
                <i className="fa-solid fa-music"></i>
                <p>Podcasts em destaque</p>
            </div>
            <div className={Style.divCardsDestaque}>
                {podcasts.map(index => (
                    <div className={Style.cardsDestaque} key={index.id}>
                        <img src={index.img}
                            alt={`Capa do podcast ${index.titulo}`}
                            className={Style.imgCardDestaque} draggable="false"
                        />
                        <div>
                            <h2>{index.titulo}</h2>
                            <p>
                                {index.episodios} 
                                {index.episodios > 1 ? "episódios" : "episódio"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}