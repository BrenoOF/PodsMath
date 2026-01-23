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
                {podcasts.map(item => (
                    <div className={Style.cardsDestaque} key={item.id}>
                        <img src={item.img}
                            alt={`Capa do podcast ${item.titulo}`}
                            className={Style.imgCardDestaque} draggable="false"
                        />
                        <div>
                            <h2>{item.titulo}</h2>
                            <p>
                                {item.episodios}
                                {item.episodios > 1 ? " episódios" : " episódio"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}