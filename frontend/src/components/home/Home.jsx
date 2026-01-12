import React from "react";

import Style from "./home.module.css";

// Import de Componentes

export default function TelaHome() {
    return (
        <div className={Style.containerHome}>
            <div className={Style.divBoasVindas}>
                <div className={Style.pequenaMensagem}>
                    <i className="fa-regular fa-star" style={{ color: "#ff5724" }}></i>
                    <p>Plataforma Educacional</p>
                </div>
                <h1 className={Style.tituloBoasVindas}>
                    <span>
                        Aprenda Matemática
                    </span>
                    <br />
                    quando e onde quiser
                </h1>    
                <p className={Style.subTitulo}>
                    Transforme seu aprendizado com podcasts educacionais de matemática.
                    <br />
                    Conteúdo de qualidade para estudantes e professores.
                </p>
                <img src={require("../../imgs/microfone.png")} alt="imagem de um microfone"
                    className={Style.imgMicrofone}
                    draggable="false"
                />
            </div>
        </div>
    )
}