import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Style from "./home.module.css";

// Import de Componentes
import Destaque from "./carrosseis/PodcastDestaque";
import Novidades from "./carrosseis/Novidade";
import Proprio from "./carrosseis/PodcastProprio";

export default function TelaHome() {
    const navigate = useNavigate();
    const [dadosHome, setDadosHome] = useState(null);
    const API_URL = "/api-user";

    useEffect(() => {
        const carregarDados = async () => {
            const token = localStorage.getItem("token");
            const headers = token ? {
                Authorization: `Bearer ${token}`
            } : {};

            try {
               
                const destaquePromise = axios.get(`${API_URL}/temas/destaque?limit=8`, { headers });
                const recentesPromise = axios.get(`${API_URL}/audios/recentes`, { headers });
                
                const propriosPromise = axios.get(`${API_URL}/audios/proprios?limit=3`, { headers })
                    .catch(error => {
                        console.warn("Áudios próprios não puderam ser carregados:", error.response?.data?.message || error.message);
                        return { data: [] };
                    });

                const [destaqueRes, recentesRes, propriosRes] = await Promise.all([
                    destaquePromise,
                    recentesPromise,
                    propriosPromise
                ]);

                const formatarImagem = (caminhoOriginal) => {
                    if (!caminhoOriginal) return "";
                    const nomeArquivo = caminhoOriginal.split('/').pop();
                    return `${API_URL}/imagens/file/${nomeArquivo}`;
                };

                const tratarLista = (lista) => {
                    if (!Array.isArray(lista)) return [];
                    return lista.map(item => ({
                        ...item,
                        imagem_caminho: formatarImagem(item.imagem_caminho)
                    }));
                };

                setDadosHome({
                    podcastsDestaque: tratarLista(destaqueRes.data),
                    novidades: tratarLista(recentesRes.data),
                    podcastsProprios: tratarLista(propriosRes.data)
                });
            } catch (error) {
                if (error.response) {
                    console.error("Erro do Servidor ao carregar Home:", error.response.data.message);
                } else {
                    console.error("Erro de Conexão ao carregar Home");
                }
            }
        }
        carregarDados();
    }, []);

    if (!dadosHome) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={Style.containerHome}>
            {/* Primeiro bloco onde tem um "Bem Vindo" */}
            <div className={Style.divBoasVindas}>
                <div className={Style.pequenaMensagem}>
                    <i className="fa-regular fa-star" style={{ color: "#ff5724" }}></i>
                    <p>Plataforma Educacional</p>
                </div>
                <h1 className={Style.tituloBoasVindas}>
                    <span>Aprenda Matemática</span>
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
            <Destaque podcasts={dadosHome.podcastsDestaque} />
            {/* */}
            <hr className={Style.hrDeSeparacao} />
            {/* Novidades */}
            <Novidades podcasts={dadosHome.novidades} />
            {/* */}
            {dadosHome.podcastsProprios && dadosHome.podcastsProprios.length > 0 && (
                <>
                    <hr className={Style.hrDeSeparacao} />
                    {/* Podcasts Proprios */}
                    <Proprio podcasts={dadosHome.podcastsProprios} />
                </>
            )}
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
                    <div className={Style.btnLerMais} onClick={() => { navigate("/sobre-o-projeto") }}>
                        <p>Ler mais sobre esse projeto</p>
                    </div>
                </div>
                <div className={Style.divImgProf}>
                    <img src={require("../../imgs/prof.jpg")} alt="Imagem Professora"
                        className={Style.imgProfessora}
                        draggable="false"
                    />
                </div>
            </div>
        </div>
    )
}