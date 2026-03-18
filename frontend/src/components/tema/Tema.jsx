import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import Style from "./tema.module.css";
import StyleExterno from "../home/carrosseis/carrosseis.module.css";

const API_BASE_URL = "http://localhost:3001";

export default function TelaTema() {
    const navigate = useNavigate();
    const { idTema } = useParams(); // idTema aqui representa o id da categoria
    const [tituloAssunto, setTituloAssunto] = useState("");
    const [dadosTemas, setDadosTemas] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            const token = localStorage.getItem("token");
            try {
                
                const resCategoria = await axios.get(`${API_BASE_URL}/categorias/${idTema}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTituloAssunto(resCategoria.data.nome);

                const resTemas = await axios.get(`${API_BASE_URL}/temas/categoria/${idTema}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                resTemas.data.forEach(tema => {
                    if (tema.caminho_imagem) {
                        const nomeArquivo = tema.caminho_imagem.split('/').pop();
                        tema.caminho_imagem = `http://localhost:3001/imagens/file/${nomeArquivo}`;
                    }
                });

                setDadosTemas(resTemas.data);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        carregarDados();
    }, [idTema]);

    return (
        <div className={Style.containerTemas}>
            <div className={Style.btnVoltar} onClick={() => { navigate(-1) }}>
                <i className="fa-solid fa-angle-left"></i>
                <p>Voltar</p>
            </div>
            <div className={Style.divTitulo}>
                <h1>{tituloAssunto}</h1>
                <p>
                    Explore todos os podcasts desta categoria
                </p>
            </div>
            <div className={Style.divCardNovidade}>
                {dadosTemas.map(item => (
                    <div className={StyleExterno.cardNovidade} key={item.idtemas}
                        onClick={() => {
                            navigate(`/explorar/${idTema}/${item.idtemas}`);
                        }}
                    >
                        <div className={StyleExterno.divImgCardNovidade}>
                            <img src={item.caminho_imagem || "/imgs/podcast-default.jpg"} alt={item.titulo}
                                className={StyleExterno.imgCard} draggable="false"
                                onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                            />
                        </div>
                        <h1>{item.titulo}</h1>
                    </div>
                ))}
            </div>
        </div>
    );
}