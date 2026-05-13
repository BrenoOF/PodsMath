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
                    <div className={Style.cardProprio} key={item.idaudios}
                        onClick={() => {
                            navigate(`/explorar/${item.categorias_idcategorias}/${item.temas_idtemas}/${item.idaudios}`);
                        }}
                    >
                        <img src={item.imagem_caminho || "/imgs/podcast-default.jpg"} alt={`Capa do podcast ${item.titulo}`}
                            className={Style.imgCard} draggable="false"
                            onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                        />
                        <div className={Style.divTextosProprio}>
                            <h1>{item.titulo}</h1>
                            <p>{item.descricao}</p>
                            <div className={Style.btnAssunto}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/explorar/${item.categorias_idcategorias}`);
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