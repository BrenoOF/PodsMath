import React, { useEffect, useState } from "react";

import Style from "./carrosseis.module.css";

// Import de Componentes
import { Carousel } from "primereact/carousel";

export default function CompPodcastDestaque() {
    const [novidades, setNovidades] = useState([]);

    useEffect(() => {
        const dadosSimulados = [
            {
                id: 1,
                titulo: "Funções do 1º Grau",
                descricao: "Aprenda os conceitos fundamentais das funções do primeiro grau.",
                img: require("../../../imgs/cardExemplo.jpg"),
                assunto: "algebra"
            },
            {
                id: 2,
                titulo: "Trigonometria",
                descricao: "Seno, cosseno e tangente explicados de forma simples.",
                img: require("../../../imgs/cardExemplo.jpg"),
                assunto: "calculo"
            },
            {
                id: 3,
                titulo: "Funções do 1º Grau",
                descricao: "Aprenda os conceitos fundamentais das funções do primeiro grau.",
                img: require("../../../imgs/cardExemplo.jpg"),
                assunto: "estatísticas"
            },
            {
                id: 4,
                titulo: "Trigonometria",
                descricao: "Seno, cosseno e tangente explicados de forma simples.",
                img: require("../../../imgs/cardExemplo.jpg"),
                assunto: "geometria"
            },
            {
                id: 5,
                titulo: "Funções do 1º Grau",
                descricao: "Aprenda os conceitos fundamentais das funções do primeiro grau.",
                img: require("../../../imgs/cardExemplo.jpg"),
                assunto: "algebra"
            },
            {
                id: 6,
                titulo: "Trigonometria",
                descricao: "Seno, cosseno e tangente explicados de forma simples.",
                img: require("../../../imgs/cardExemplo.jpg"),
                assunto: "algebra"
            },
            {
                id: 7,
                titulo: "Funções do 1º Grau",
                descricao: "Aprenda os conceitos fundamentais das funções do primeiro grau.",
                img: require("../../../imgs/cardExemplo.jpg"),
                assunto: "algebra"
            },
            {
                id: 8,
                titulo: "Trigonometria",
                descricao: "Seno, cosseno e tangente explicados de forma simples.",
                img: require("../../../imgs/cardExemplo.jpg"),
                assunto: "algebra"
            }
        ];

        setNovidades(dadosSimulados);
    }, []);

    const novidadesTemplate = (item) => {
        return (
            <div className={Style.cardNovidade}>
                <div className={Style.divImgCardNovidade}>
                    <img src={item.img} alt={item.titulo}
                        className={Style.imgCard} draggable="false"
                    />
                    <i className={`fa-solid fa-circle-play ${Style.iconPlay}`}></i>
                </div>
                <h1>{item.titulo}</h1>
                <p>
                    {item.descricao}
                </p>
                <div className={Style.btnAssunto}>
                    <p>
                        {item.assunto}
                    </p>
                </div>
            </div>
        );
    };

    const responsiveOptions = [
        {
            breakpoint: '1366px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '1024px',
            numVisible: 2,
            numScroll: 1
        }
    ];

    return (
        <div>
            <div className={Style.divTitulosDosPodcasts}>
                <i className="fa-solid fa-music"></i>
                <p>Novidades</p>
            </div>
            <Carousel
                value={novidades}
                itemTemplate={novidadesTemplate}
                numVisible={4}
                numScroll={2}
                circular
                autoplayInterval={5000}
                responsiveOptions={responsiveOptions}
            />
        </div>
    );
}