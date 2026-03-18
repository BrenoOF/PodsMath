import React from "react";
import { useNavigate } from "react-router-dom";

import Style from "./carrosseis.module.css";

export default function CompPodcastProprio({ podcasts }) {
    const navigate = useNavigate();

    return (
        <div>
            <div className={Style.divTitulosDosPodcasts}>
                <i className="fa-solid fa-music"></i>
                <p>Podcasts Próprios</p>
            </div>
            <div className={Style.divPodcastsProprio}>
                {podcasts.map(item => (
                    <div className={Style.cardProprio} key={item.id}
                        onClick={() => {
                            navigate(`/explorar/${item.idTema}/${item.playlistTema}/${item.idPodcast}`);
                        }}
                    >
                        <img src={item.img || "/imgs/podcast-default.jpg"} alt={`Capa do podcast ${item.titulo}`}
                            className={Style.imgCard} draggable="false"
                            onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                        />
                        <div className={Style.divTextosProprio}>
                            <h1>{item.titulo}</h1>
                            <p>Feito por: {item.autor}</p>
                            <div className={Style.btnAssunto}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/explorar/${item.idTema}`);
                                }}
                            >
                                <p>{item.assunto}</p>
                            </div>
                        </div>
                        <div className={Style.divIconProprio}>
                            <i className={`fa-solid fa-circle-play ${Style.iconPlayProprio}`}></i>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}