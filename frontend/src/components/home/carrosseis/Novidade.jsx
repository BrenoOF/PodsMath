import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Style from "./carrosseis.module.css";

// Import de Componentes
import { Carousel } from "primereact/carousel";

export default function CompPodcastNovidades({ podcasts }) {
    const navigate = useNavigate();
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

    const novidadesTemplate = (item) => {
        return (
            <div className={Style.cardNovidade} key={item.idaudios}
                onClick={() => {
                    navigate(`/explorar/${item.categorias_idcategorias}/${item.temas_idtemas}/${item.idaudios}`);
                }}
            >
                <div className={Style.divImgCardNovidade}>
                    <img src={item.imagem_caminho || "/imgs/podcast-default.jpg"} alt={item.titulo}
                        className={Style.imgCard} draggable="false"
                        onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                    />
                </div>
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
        },
        {
            breakpoint: '768px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    useEffect(() => {
        // Aplica regra inicial para fonts
        atualizarNumVisible();
        // Escutador para mudanças no localStorage
        window.addEventListener("fontChange", atualizarNumVisible);
        return () => {
            window.removeEventListener("fontChange", atualizarNumVisible);
        };
    }, []);

    return (
        <div className={Style.limitarWidthNovidade}>
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