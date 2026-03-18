import React from "react";
import { useNavigate } from "react-router-dom";

import Style from "./carrosseis.module.css";

export default function CompPodcastDestaque({ podcasts }) {
    const navigate = useNavigate();

    return (
        <div>
            <div className={Style.divTitulosDosPodcasts}>
                <i className="fa-solid fa-music"></i>
                <p>Playlists em destaque</p>
            </div>
            <div className={Style.divCardsDestaque}>
                {podcasts.map(item => (
                    <div className={Style.cardsDestaque} key={item.id}
                        onClick={() => {
                            navigate(`/explorar/${item.idTema}/${item.playlistTema}`);
                        }}
                    >
                        <img src={item.img || "/imgs/podcast-default.jpg"}
                            alt={`Capa do podcast ${item.titulo}`}
                            className={Style.imgCardDestaque} draggable="false"
                            onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                        />
                        <div className={Style.textosCardDestaque}>
                            <h2>{item.titulo}</h2>
                            <p>{item.episodios}{item.episodios > 1 ? " episódios" : " episódio"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}