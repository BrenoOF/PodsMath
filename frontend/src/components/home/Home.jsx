import React from "react";

import Style from "./home.module.css";

// Import de Componentes

export default function TelaHome() {
    return (
        <div className={Style.containerHome}>
            <h1>Home</h1>
            <p>Conteúdo da Home</p>
        </div>
    )
}