import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Style from "./explorar.module.css";

export default function TelaExplorar() {
    const navigate = useNavigate();
    const [dadosExplorar, setDadosExplorar] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const response = await axios.get("/dados/explorar.json");
                setDadosExplorar(response.data.assuntos);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        carregarDados();
    }, []);

    return (
        <div className={Style.containerExplorar}>
            <div className={Style.divTituloTopo}>
                <h1>
                    Explorar Categorias
                </h1>
                <p>
                    Descubra podcasts organizados por temas matemáticos
                </p>
            </div>
            <div className={Style.divCards}>
                {dadosExplorar.map(item => (
                    <div key={item.id} className={Style.card}
                        onClick={() => {
                            navigate(`/explorar/${item.slug}`);
                        }}
                    >
                        <div
                            className={Style.icon}
                            style={{ background: `linear-gradient(135deg,${item.bg})` || "transparent" }}
                        >
                            <i className={`fa-solid fa-${item.icon}`}></i>
                        </div>
                        <div className={Style.tituloCard}>
                            <h1>{item.titulo}</h1>
                            <p>{item.subTitulo}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}