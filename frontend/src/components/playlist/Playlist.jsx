import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import Style from "./playlist.module.css";

export default function TelaPlaylist() {
    const navigate = useNavigate();
    const { idTema, playlistTema } = useParams();
    const [tituloTema, setTituloTema] = useState("");
    const [subTitulo, setSubTitulo] = useState("");
    const [dadosPlaylist, setDadosPlaylist] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const response = await axios.get("/dados/explorar.json");
                const assunto = response.data.assuntos.find(
                    item => item.id === parseInt(idTema)
                );
                const tema = assunto?.temas.find(
                    item => item.id === parseInt(playlistTema)
                );
                if (tema) {
                    setTituloTema(tema.titulo);
                    setSubTitulo(tema.subTitulo);
                    setDadosPlaylist(tema.playlists);
                }
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        carregarDados();
    }, [idTema, playlistTema]);

    return (
        <div className={Style.containerPlaylist}>
            {/* Parte que Aparece no Topo */}
            <div className={Style.divApresentacao}>
                <div className={Style.btnVoltar} onClick={() => { navigate(-1) }}>
                    <i className="fa-solid fa-angle-left"></i>
                    <p>Voltar</p>
                </div>
                <div className={Style.divOrganizarTextos}>
                    <img src="/imgs/cardExemplo.jpg" alt="teste"
                        className={Style.imgTitulo} draggable="false"
                        onError={(e) => (e.target.src = "/imgs/cardExemplo.jpg")}
                    />
                    <div className={Style.divTextos}>
                        <div className={Style.semiBtn}>
                            <p>Playlist</p>
                        </div>
                        <h1>{tituloTema}</h1>
                        <p>{subTitulo}</p>
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
                        navigate(`/explorar/${idTema}/${playlistTema}/${dadosPlaylist[0].id}`);
                    }}
                >
                    <i className="fa-solid fa-play"></i>
                </div>
                <i className="fa-solid fa-share-nodes"></i>
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
                            key={item.id}
                            className={Style.linhaTabela}
                            onClick={() => {
                                navigate(`/explorar/${idTema}/${playlistTema}/${item.id}`);
                            }}
                        >
                            <td className={Style.colunaNumero}>
                                <span className={Style.idPodcast}>{index + 1}</span>
                                <i className={`fa-solid fa-play ${Style.playIcon}`}></i>
                            </td>
                            <td className={Style.celulaTitulo}>
                                <img src={item.img} alt={item.titulo}
                                    className={Style.imgTabela} draggable="false"
                                    onError={(e) => (e.target.src = "/imgs/cardExemplo.jpg")}
                                />
                                <div className={Style.divTextoTituloPodcast}>
                                    <h1>{item.titulo}</h1>
                                    <p>Feito por: {item.autor}</p>
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