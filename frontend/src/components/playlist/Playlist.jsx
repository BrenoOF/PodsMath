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
                <div className={Style.divIconPlay}>
                    <i className="fa-solid fa-play"></i>
                </div>
                {/* perguntar para o breno */}
                <i className="fa-solid fa-heart" style={{ color: "#f00"}}></i>
                <i className="fa-solid fa-share-nodes"></i>
            </div>
            <hr className={Style.hrSeparacao}/>
            {/* Tabela para colocar podcasts */}
            <table className={Style.tabelaPlaylist}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Título</th>
                        <th>Data de adição</th>
                        <th><i className="fa-regular fa-clock"></i></th>
                    </tr>
                </thead>
                <tbody>
                    {dadosPlaylist.map((item, index) => (
                        <tr
                            key={item.id}
                            onClick={() => {
                                navigate(`/explorar/${idTema}/${playlistTema}/${item.id}`);
                            }}
                        >
                            <td>{index + 1}</td>
                            <td className={Style.celulaTitulo}>
                                <img src="/imgs/cardExemplo.jpg" alt={item.titulo}
                                    className={Style.imgTabela} draggable="false"
                                    onError={(e) => (e.target.src = "/imgs/cardExemplo.jpg")}
                                />
                                <div>
                                    <p className={Style.titulo}>{item.titulo}</p>
                                    <p className={Style.subTitulo}>{item.subTitulo}</p>
                                </div>
                            </td>
                            <td>{item.dt_adicao}</td>
                            <td>{item.duracao}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}