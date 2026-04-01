import React from "react";

import Style from "./tabelas.module.css";

export default function CompTranscricao() {
    return (
        <div className={Style.containerTabela}>
            <div className={Style.tituloTabela}>
                <h1>Gerenciador de Transcrições</h1>
            </div>
        </div>
    );
}