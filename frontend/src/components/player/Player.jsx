import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import Style from "./player.module.css";

export default function TelaPlayer() {
    const navigate = useNavigate();
    const { idTema, playlistTema, idPodcast } = useParams();
    const [dadosPlayer, setDadosPlayer] = useState(null);

    // States para o Player em si
    const [pause, setPause] = useState(false);
    const [favoritar, setFavoritar] = useState(false);
    const [tempoAtual, setTempoAtual] = useState(0);
    const [duracaoTotal, setDuracaoTotal] = useState(477);
    const [arrastando, setArrastando] = useState(false);

    const progresso = (tempoAtual / duracaoTotal) * 100;

    const formatarTempo = (segundos) => {
        const min = Math.floor(segundos / 60);
        const sec = segundos % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    }

    const duracaoParaSegundos = (tempo) => {
        const [min, sec] = tempo.split(":").map(Number);
        return min * 60 + sec;
    }

    const barraRef = useRef(null);

    const handleClickBarra = (e) => {
        const barra = barraRef.current;
        const rect = barra.getBoundingClientRect();

        const clickX = e.clientX - rect.left;
        const largura = rect.width;

        const porcentagem = clickX / largura;

        const novoTempo = Math.floor(porcentagem * duracaoTotal);

        setTempoAtual(novoTempo);
    };

    const atualizarTempo = React.useCallback((clientX) => {
        const barra = barraRef.current;
        const rect = barra.getBoundingClientRect();

        let posicao = clientX - rect.left;
        let porcentagem = posicao / rect.width;

        if (porcentagem < 0) porcentagem = 0;
        if (porcentagem > 1) porcentagem = 1;

        const novoTempo = Math.floor(porcentagem * duracaoTotal);
        setTempoAtual(novoTempo);
    }, [duracaoTotal]);

    // Código para Fazer a parte da transcrição
    const [menuAberto, setMenuAberto] = useState(false);
    const [linguaSelecionada, setLinguaSelecionada] = useState("pt-br");

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
                    setDuracaoTotal(duracaoParaSegundos(episodio.duracao));
                }
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        carregarDados();
    }, [idTema, playlistTema, idPodcast]);

    // Simular passagem de tempo
    useEffect(() => {
        let intervalo;

        if (pause) {
            intervalo = setInterval(() => {
                setTempoAtual((prev) => {
                    if (prev >= duracaoTotal) {
                        clearInterval(intervalo);
                        setPause(false);
                        return duracaoTotal;
                    }
                    return prev + 1;
                });
            }, 1000);
        }

        return () => clearInterval(intervalo);
    }, [pause, duracaoTotal]);

    useEffect(() => {
        const moverMouse = (e) => {
            if (!arrastando) return;
            atualizarTempo(e.clientX);
        };

        const pararArrastar = () => {
            setArrastando(false);
        };

        document.addEventListener("mousemove", moverMouse);
        document.addEventListener("mouseup", pararArrastar);

        return () => {
            document.removeEventListener("mousemove", moverMouse);
            document.removeEventListener("mouseup", pararArrastar);
        };
    }, [arrastando, atualizarTempo]);

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
                <div>
                    <p>{formatarTempo(tempoAtual)}</p>
                    {/* Barra de Progresso */}
                    <div className={Style.barraProgresso} onClick={handleClickBarra}
                        ref={barraRef}
                    >
                        {/* Barra em si */}
                        <div className={Style.progresso} style={{ width: `${progresso}%` }}></div>
                        {/* Bolinha da Barra */}
                        <div className={Style.thumb} style={{ left: `${progresso}%` }}
                            onMouseDown={() => setArrastando(true)}
                        ></div>
                    </div>
                    {/*  */}
                    <p>{formatarTempo(duracaoTotal)}</p>
                </div>
                <div>
                    <div>
                        <i className="fa-solid fa-backward"
                            onClick={() => setTempoAtual((t) => Math.max(t - 10, 0))}
                        ></i>
                        <div className={Style.divIconPlay}
                            onClick={() => { setPause(!pause) }}
                        >
                            {!pause ? (
                                <i className="fa-solid fa-play"></i>
                            ) : (
                                <i className="fa-solid fa-pause"></i>
                            )}
                        </div>
                        <i className="fa-solid fa-forward"
                            onClick={() => setTempoAtual((t) => Math.min(t + 10, duracaoTotal))}
                        ></i>
                    </div>
                    <div>
                        <i className="fa-solid fa-gear"></i>
                        <div>
                            <i className="fa-solid fa-volume"></i>
                            <i className="fa-solid fa-volume-low"></i>
                            <i className="fa-solid fa-volume-xmark"></i>
                        </div>
                        <i className="fa-solid fa-repeat"></i>
                        <div>
                            {!favoritar ? (
                                <i className="fa-regular fa-heart"
                                    onClick={() => { setFavoritar(!favoritar) }}
                                ></i>
                            ) : (
                                <i className="fa-solid fa-heart"
                                    onClick={() => { setFavoritar(!favoritar) }}
                                ></i>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}