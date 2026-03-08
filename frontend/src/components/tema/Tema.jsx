import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import Style from "./tema.module.css";
import StyleExterno from "../home/carrosseis/carrosseis.module.css";

export default function TelaTemas() {
    const navigate = useNavigate();
    const { nomeTema } = useParams();
    const [tituloAssunto, setTituloAssunto] = useState("");
    const [dadosTemas, setDadosTemas] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const response = await axios.get("/dados/explorar.json");
                const assuntoSelecionado = response.data.assuntos.find(
                    assunto => assunto.slug === nomeTema
                );
                if (assuntoSelecionado) {
                    setDadosTemas(assuntoSelecionado.temas);
                    setTituloAssunto(assuntoSelecionado.titulo);
                } else {
                    console.warn("Assunto não encontrado:", nomeTema);
                }
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        carregarDados();
    }, [nomeTema]);

    return (
        <div className={Style.containerTemas}>
            <div className={Style.divTitulo}>
                <h1>{tituloAssunto}</h1>
                <p>
                    Explore todos os podcasts desta categoria
                </p>
            </div>
            <div className={Style.divCardNovidade}>
                {dadosTemas.map(item => (
                    <div className={StyleExterno.cardNovidade} key={item.id}
                        onClick={() => {
                            navigate(`/explorar/${nomeTema}/${item.slug}`);
                        }}
                    >
                        <div className={StyleExterno.divImgCardNovidade}>
                            <img src={item.img} alt={item.titulo}
                                className={StyleExterno.imgCard} draggable="false"
                                onError={(e) => (e.target.src = "/imgs/cardExemplo.jpg")}
                            />
                        </div>
                        <h1>{item.titulo}</h1>
                        <p>{item.subTitulo}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}