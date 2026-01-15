import React, { useEffect, useState } from "react";

import Style from "./carrosseis.module.css";

export default function CompPodcastDestaque() {
    const [podcastsProprio, setPodcastsProprio] = useState([]);

    useEffect(() => {
        const dadosSimulados = [
            {
                id: 1,
                titulo: "Trigonometria no Cotidiano: Aplicações Práticas",
                descricao: "Descubra como a trigonometria está presente em mapas, construções e até em apps de navegação.",
                img: require("../../../imgs/cardExemplo.jpg"),
                assunto: "Trigonometria"
            },
            {
                id: 2,
                titulo: "Álgebra Essencial: Fundamentos e Aplicações",
                descricao: "Domine os conceitos básicos de álgebra e aprenda como aplicar expressões e equações no dia a dia.",
                img: require("../../../imgs/cardExemplo.jpg"),
                assunto: "Estatística"
            },
            {
                id: 3,
                titulo: "Matemática Financeira: Juros Simples e Compostos",
                descricao: "Aprenda a calcular juros e entender como eles impactam empréstimos, investimentos e o dia a dia.",
                img: require("../../../imgs/cardExemplo.jpg"),
                assunto: "Matemática Financeira"
            }
        ]

        setPodcastsProprio(dadosSimulados);

    }, []);

    return (
        <div>
            <div className={Style.divTituloProprio}>
                <div className={Style.divTitulosDosPodcasts}>
                    <i className="fa-solid fa-music"></i>
                    <p>Podcasts Próprios</p>
                </div>
                <div className={Style.divTitulosDosPodcasts + " "+ Style.divTituloMostrar}>
                    <p>Mostrar tudo</p>
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </div>
            </div>
            <div className={Style.divPodcastsProprio}>
                {podcastsProprio.map(index => (
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