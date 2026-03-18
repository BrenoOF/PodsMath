import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Style from "./explorar.module.css";

const API_BASE_URL = "http://localhost:3001";

export default function TelaExplorar() {
    const navigate = useNavigate();
    const [dadosExplorar, setDadosExplorar] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${API_BASE_URL}/categorias`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                response.data.forEach(cat => {
                    if (cat.caminho_imagem) {
                        const nomeArquivo = cat.caminho_imagem.split('/').pop();
                        cat.caminho_imagem = `http://localhost:3001/imagens/file/${nomeArquivo}`;
                    }
                });

                setDadosExplorar(response.data);
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
                {dadosExplorar.map((item) => (
                    <div key={item.idcategorias} className={Style.card}
                        onClick={() => {
                            navigate(`/explorar/${item.idcategorias}`);
                        }}
                    >
                        <div className={Style.divImgCardNovidade}>
                            <img src={item.caminho_imagem || "/imgs/podcast-default.jpg"} alt={item.nome}
                                className={Style.imgCard} draggable="false"
                                onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                            />
                        </div>
                        <div className={Style.tituloCard}>
                            <h1>{item.nome}</h1>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}