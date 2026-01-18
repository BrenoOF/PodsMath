import React from "react";

import Style from "./carrosseis.module.css";

export default function CompPodcastProprio({ podcasts }) {
    return (
        <div>
            <div className={Style.divTituloProprio}>
                <div className={Style.divTitulosDosPodcasts}>
                    <i className="fa-solid fa-music"></i>
                    <p>Podcasts Próprios</p>
                </div>
                <div className={Style.divTitulosDosPodcasts + " " + Style.divTituloMostrar}>
                    <p>Mostrar tudo</p>
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </div>
            </div>
            <div className={Style.divPodcastsProprio}>
                {podcasts.map(index => (
                    <div className={Style.cardProprio} key={index.id}>
                        <img src={index.img} alt={`Capa do podcast ${index.titulo}`}
                            className={Style.imgCard} draggable="false"
                        />
                        <div className={Style.divTextosProprio}>
                            <h1>{index.titulo}</h1>
                            <p>{index.descricao}</p>
                            <div className={Style.btnAssunto}>
                                <p>{index.assunto}</p>
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