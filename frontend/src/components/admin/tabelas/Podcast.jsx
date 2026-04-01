import React from "react";

import Style from "./tabelas.module.css";

export default function CompPodcast() {
    return (
        <div className={Style.containerTabela}>
            <div className={Style.tituloTabela}>
                <h1>Gerenciar Podcasts</h1>
                <button>
                    <p>
                        <i className="fa-solid fa-plus"></i>
                        Novo Podcast
                    </p>
                </button>
            </div>
        </div>
    );
}