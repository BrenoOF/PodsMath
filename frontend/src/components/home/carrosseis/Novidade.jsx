import React, { useEffect, useState } from "react";

import Style from "./carrosseis.module.css";

// Import de Componentes
import { Carousel } from "primereact/carousel";

export default function CompPodcastNovidades({ podcasts }) {
    const [numVisible, setNumVisible] = useState(4);

    // Atualiza quantidade de cards conforme tamanho da fonte
    const atualizarNumVisible = (e) => {
        const tamanhoFont = e?.datail || localStorage.getItem("font-size");

        if (tamanhoFont === "xlarge") {
            setNumVisible(3);
        } else {
            setNumVisible(4);
        }
    };

    useEffect(() => {
        // Aplica regra inicial para fonts
        atualizarNumVisible();
        // Escutador para mudanças no localStorage
        window.addEventListener("fontChange", atualizarNumVisible);
        return () => {
            window.removeEventListener("fontChange", atualizarNumVisible);
        };
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
                <p>{item.descricao}</p>
                <div className={Style.btnAssunto}>
                    <p>{item.assunto}</p>
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
                value={podcasts}
                itemTemplate={novidadesTemplate}
                numVisible={numVisible}
                numScroll={2}
                circular
                autoplayInterval={5000}
                responsiveOptions={responsiveOptions}
            />
        </div>
    );
}