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
                {podcasts.map(item => (
                    <div className={Style.cardProprio} key={item.id}>
                        <img src={item.img} alt={`Capa do podcast ${item.titulo}`}
                            className={Style.imgCard} draggable="false"
                        />
                        <div className={Style.divTextosProprio}>
                            <h1>{item.titulo}</h1>
                            <p>{item.descricao}</p>
                            <div className={Style.btnAssunto}>
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