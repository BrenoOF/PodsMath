import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import Style from "./player.module.css";

export default function TelaPlayer() {
    const navigate = useNavigate();
    const { idTema, playlistTema, idPodcast } = useParams();
    const [dadosPlayer, setDadosPlayer] = useState(null);

    const [menuAberto, setMenuAberto] = useState(false);
    const [linguaSelecionada, setLinguaSelecionada] = useState("pt-br");
    // Código para Fazer a parte da transcrição
    const linguas = [
        { label: "Português", value: "pt-br", icon: "br" },
        { label: "Inglês", value: "us", icon: "us" },
        { label: "Espanhol", value: "es", icon: "es" }
    ];

    const menuRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuAberto &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                btnRef.current &&
                !btnRef.current.contains(event.target)
            ) {
                setMenuAberto(false);
            }
        };

        document.addEventListener("pointerdown", handleClickOutside);
        return () => { document.removeEventListener("pointerdown", handleClickOutside) };
    }, [menuAberto]);

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
                const episodio = tema?.playlists.find(
                    item => item.id === parseInt(idPodcast)
                );
                if (episodio) {
                    setDadosPlayer(episodio);
                }
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        carregarDados();
    }, [idTema, playlistTema, idPodcast]);

    return (
        <div className={Style.containerPlayer}>
            <div className={Style.btnVoltar} onClick={() => { navigate(-1) }}>
                <i className="fa-solid fa-angle-left"></i>
                <p>Voltar</p>
            </div>
            <div className={Style.divApresentacaoPodcast}>
                <img src={dadosPlayer?.img} alt={dadosPlayer?.titulo}
                    className={Style.imgApresentacaoPodcast}
                />
                <div className={Style.divTextosApresentacao}>
                    <h1>{dadosPlayer?.titulo}</h1>
                    <p>{dadosPlayer?.subTitulo}</p>
                    <div className={Style.ultimaDivApresentacao}>
                        <p>
                            <i className="fa-regular fa-clock"></i>
                            {" " + dadosPlayer?.duracao}
                        </p>
                        <p>{dadosPlayer?.dt_adicao}</p>
                    </div>
                </div>
            </div>
            <hr className={Style.hrSeparacao} />
            <div className={Style.divDescricao}>
                <h1>Sobre este episódio</h1>
                <p>{dadosPlayer?.descricao}</p>
            </div>
            <hr className={Style.hrSeparacao} />
            <div className={Style.divTranscricao}>
                <div className={Style.divTranscricaoTitulo}>
                    <h1>Transcrição</h1>
                    <div ref={btnRef}
                        onClick={() => setMenuAberto(!menuAberto)}
                        className={Style.btnTranscricao}
                    >
                        <i className="fa-solid fa-language"></i>
                        {linguas.find(l => l.value === linguaSelecionada)?.label}
                    </div>
                    {/* Modal Troca de Transcrição */}
                    {menuAberto && (
                        <div
                            ref={menuRef}
                            className={Style.menuIdiomas}
                        >
                            {linguas.map((item) => (
                                <div
                                    key={item.value}
                                    className={Style.opcaoIdioma}
                                    onClick={() => {
                                        setLinguaSelecionada(item.value);
                                        setMenuAberto(false);
                                    }}
                                >
                                    <span className={`fi fi-${item.icon}`}></span>
                                    {item.label}
                                    {item.value === linguaSelecionada &&
                                        <i className="fa-solid fa-check"></i>
                                    }
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    {/* Parte onde aparecerá a transcrição */}
                </div>
            </div>
            <div>
                {/* Player */}
            </div>
        </div >
    );
}