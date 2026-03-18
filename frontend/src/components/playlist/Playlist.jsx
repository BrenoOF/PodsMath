import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import Style from "./playlist.module.css";

// Import de Componentes
import { Toast } from 'primereact/toast';

const API_BASE_URL = "http://localhost:3001";

export default function TelaPlaylist() {
    const navigate = useNavigate();
    const { idTema, playlistTema } = useParams();
    const [tituloTema, setTituloTema] = useState("");
    const [imagemTema, setImagemTema] = useState("");
    const [dadosPlaylist, setDadosPlaylist] = useState([]);

    // Função para copiar a URL
    const toast = useRef(null);
    const copiarUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            if (toast.current) {
                toast.current.show({
                    severity: 'success',
                    summary: 'URL copiada',
                    life: 2000
                });
            }
        } catch (err) {
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Algo deu Errado',
                    life: 2000
                });
            }
        }
    };

    useEffect(() => {
        const carregarDados = async () => {
            const token = localStorage.getItem("token");
            try {

                const resTema = await axios.get(`${API_BASE_URL}/temas/${playlistTema}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setTituloTema(resTema.data.titulo);

                const caminhoOriginal = resTema.data.caminho_imagem || "";
                let urlImagem = "";

                if (caminhoOriginal) {
                    const nomeArquivo = caminhoOriginal.split('/').pop();
                    urlImagem = `http://localhost:3001/imagens/file/${nomeArquivo}`;
                }

                setImagemTema(urlImagem);


                const resAudios = await axios.get(`${API_BASE_URL}/audios/tema/${playlistTema}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const audiosFormatados = resAudios.data.map(audio => {
                    let caminhoRelativo = audio.imagem_caminho || "";

                    if (caminhoRelativo && !caminhoRelativo.startsWith("uploads/") && !caminhoRelativo.startsWith("/uploads/")) {
                        caminhoRelativo = "uploads/" + caminhoRelativo.replace(/^\//, "");
                    }

                    const urlImagem = caminhoRelativo
                        ? `${API_BASE_URL}/${caminhoRelativo.replace(/^\//, "")}`
                        : "";

                    return {
                        ...audio,
                        imagem_caminho: urlImagem
                    };
                });

                setDadosPlaylist(audiosFormatados);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        carregarDados();
    }, [idTema, playlistTema]);

    return (
        <div className={Style.containerPlaylist}>
            <Toast ref={toast} position="bottom-right" />
            {/* Parte que Aparece no Topo */}
            <div className={Style.divApresentacao}>
                <div className={Style.btnVoltar} onClick={() => { navigate(-1) }}>
                    <i className="fa-solid fa-angle-left"></i>
                    <p>Voltar</p>
                </div>
                <div className={Style.divOrganizarTextos}>
                    {/* Aqui mudamos de dadosPlaylist[0]?.imagem_caminho para imagemTema */}
                    <img src={imagemTema || "/imgs/podcast-default.jpg"} alt="capa do tema"
                        className={Style.imgTitulo} draggable="false"
                        onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                    />
                    <div className={Style.divTextos}>
                        <div className={Style.semiBtn}>
                            <p>Playlist</p>
                        </div>
                        <h1>{tituloTema}</h1>
                        <p>
                            <b>
                                {`
                                    ${dadosPlaylist.length} 
                                    ${" "}
                                    ${dadosPlaylist.length > 1 ? " episódios" : " episódio"}`
                                }
                            </b>
                        </p>
                    </div>
                </div>
            </div>
            {/* Menuzinho Básico */}
            <div className={Style.divMenu}>
                <div className={Style.divIconPlay}
                    onClick={() => {
                        if (dadosPlaylist.length > 0) {
                            navigate(`/explorar/${idTema}/${playlistTema}/${dadosPlaylist[0].idaudios}`);
                        }
                    }}
                >
                    <i className="fa-solid fa-play"></i>
                </div>
                <i className="fa-solid fa-share-nodes"
                    onClick={copiarUrl}
                ></i>
            </div>
            {/* Tabela para colocar podcasts */}
            <table className={Style.tabelaPlaylist}>
                <thead>
                    <tr>
                        <th className={Style.colunaNumero}>#</th>
                        <th className={Style.colunaTitulo}>Título</th>
                        <th className={Style.colunaDataAdicao}>Data de adição</th>
                        <th className={Style.colunaDuracao}><i className="fa-regular fa-clock"></i></th>
                    </tr>
                </thead>
                <tbody>
                    {dadosPlaylist.map((item, index) => (
                        <tr
                            key={item.idaudios}
                            className={Style.linhaTabela}
                            onClick={() => {
                                navigate(`/explorar/${idTema}/${playlistTema}/${item.idaudios}`);
                            }}
                        >
                            <td className={Style.colunaNumero}>
                                <span className={Style.idPodcast}>{index + 1}</span>
                                <i className={`fa-solid fa-play ${Style.playIcon}`}></i>
                            </td>
                            <td className={Style.celulaTitulo}>
                                <img src={item.imagem_caminho || "/imgs/podcast-default.jpg"} alt={item.titulo}
                                    className={Style.imgTabela} draggable="false"
                                    onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                                />
                                <div className={Style.divTextoTituloPodcast}>
                                    <h1>{item.titulo}</h1>
                                    <p>Feito por: {item.autor || "PodsMath"}</p>
                                </div>
                            </td>
                            <td className={Style.colunaDataAdicao}>{item.dt_adicao}</td>
                            <td className={Style.colunaDuracao}>{item.duracao}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}