import React from "react";

import Style from "./home.module.css";

// Import de Componentes
import Destaque from "./carrosseis/PodcastDestaque";
import Novidades from "./carrosseis/Novidade";
import Proprio from "./carrosseis/PodcastProprio";

export default function TelaHome() {
    return (
        <div className={Style.containerHome}>
            {/* Primeiro bloco onde tem um "Bem Vindo" */}
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
            {/* */}
            <hr className={Style.hrDeSeparacao} />
            {/* Podcasts em Destaque */}
            <Destaque />
            {/* */}
            <hr className={Style.hrDeSeparacao} />
            {/* Novidades */}
            <Novidades />
            {/* */}
            <hr className={Style.hrDeSeparacao} />
            {/* Podcasts Proprios */}
            <Proprio />
            {/* Bloco de Footer onde terá "Sobre esse Projeto" */}
            <div className={Style.sobreOProjeto}>
                <div className={Style.divTextosProjeto}>
                    <h1 className={Style.tituloProjeto}>Sobre este projeto</h1>
                    <h1 className={Style.subTituloProjeto}>
                        O PodsMath nasceu com o propósito de transformar o ensino da
                        matemática em uma experiência acessível, dinâmica e envolvente.
                    </h1>
                    <div className={Style.divParagrafoProjeto}>
                        <p className={Style.paragrafosProjeto}>
                            Por meio de podcasts educativos, unimos conhecimento, tecnologia e
                            praticidade para que estudantes, professores e entusiastas pela matemática
                            possam aprender quando e onde quiserem.
                        </p>
                        <p className={Style.paragrafosProjeto}>
                            Este projeto foi desenvolvido em parceria com a professora Adriana de
                            Bortoli, docente de Ensino Superior da Faculdade de Tecnologia Professor
                            Antônio Seabra - FATEC de Lins SP e seus alunos.
                        </p>
                    </div>
                    <div className={Style.btnLerMais}
                        onClick={() => { alert("Cliclou") }}
                    >
                        <p>Ler mais sobre esse projeto</p>
                    </div>
                </div>
                <div className={Style.divImgProf}>
                    <img src={require("../../imgs/prof.jpg")} alt="imagem de um microfone"
                        className={Style.imgProfessora}
                        draggable="false"
                    />
                </div>
            </div>
        </div>
    )
}