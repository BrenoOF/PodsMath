import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import Style from "./player.module.css";

const API_TRANSCRIPTION_URL = "http://localhost:3002";

const tempoParaSegundos = (tempo) => {
    const [hms, ms] = tempo.split(",");
    const [h, m, s] = hms.split(":").map(Number);

    return h * 3600 + m * 60 + s + Number(ms) / 1000;
}

const tempoHistoricoParaSegundos = (tempo) => {
    if (!tempo) return 0;
    // Se não tiver ":", tenta converter direto para float (caso venha em segundos)
    if (!String(tempo).includes(":")) return parseFloat(tempo) || 0;
    
    // Se vier no formato "HH:MM:SS"
    const [h, m, s] = String(tempo).split(":").map(Number);
    return h * 3600 + m * 60 + s;
};

// Nova função para converter segundos de volta para o formato do banco (HH:MM:SS)
const segundosParaTempoHistorico = (segundosTotais) => {
    const horas = Math.floor(segundosTotais / 3600).toString().padStart(2, "0");
    const minutos = Math.floor((segundosTotais % 3600) / 60).toString().padStart(2, "0");
    const segundos = Math.floor(segundosTotais % 60).toString().padStart(2, "0");
    
    return `${horas}:${minutos}:${segundos}`;
};

const parseTranscricao = (texto) => {
    const regex = /\[(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\]\s*([\s\S]*?)(?=\s*\[\d{2}:\d{2}:\d{2},\d{3} -->|$)/g;

    const resultado = [];
    let match;

    while ((match = regex.exec(texto)) !== null) {
        resultado.push({
            start: tempoParaSegundos(match[1]),
            end: tempoParaSegundos(match[2]),
            text: match[3].trim()
        });
    }

    return resultado;
};

export default function TelaPlayer() {
    const navigate = useNavigate();
    const { idTema, playlistTema, idPodcast } = useParams();
    const [dadosPlayer, setDadosPlayer] = useState(null);

    // Código para Fazer a parte da transcrição
    const [transcricao, setTranscricao] = useState([]);
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

    const [loop, setLoop] = useState(false);
    const [favoritar, setFavoritar] = useState(false);
    const [tocando, setTocando] = useState(false);
    const [volume, setVolume] = useState(1);

    const [tempoAtual, setTempoAtual] = useState(0);
    const [duracaoTotal, setDuracaoTotal] = useState(0);
    const tempoInicialRef = useRef(0);
    const tempoSalvoRef = useRef(0); // Referência para saber o último tempo salvo no banco em segundos

    const [arrastando, setArrastando] = useState(false);

    const audioRef = useRef(null);
    const barraRef = useRef(null);

    const progresso = (tempoAtual / (duracaoTotal || 1)) * 100 || 0;

    const formatarTempo = (s) => {
        if (!s) return "0:00";
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60).toString().padStart(2, "0");
        return `${m}:${sec}`;
    };

    // Função centralizada para salvar o histórico no banco de dados
    const salvarHistorico = React.useCallback(async (tempoParaSalvar) => {
        const token = localStorage.getItem("token");
        if (!token || !idPodcast) return;

        const tempoInteiro = Math.floor(tempoParaSalvar);
        const tempoFormatadoBanco = segundosParaTempoHistorico(tempoInteiro);

        try {
            await axios.post("http://localhost:3001/historicos/save", {
                audios_idaudios: idPodcast,
                tempo_audio: tempoFormatadoBanco // Mandando no formato "HH:MM:SS" para o banco aceitar
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            tempoSalvoRef.current = tempoInteiro; // Guardamos em segundos para a nossa lógica interna
        } catch (error) {
            console.error("Erro ao salvar histórico", error);
        }
    }, [idPodcast]);

    // Pause
    const togglePlay = () => {
        const audio = audioRef.current;
        if (audio.paused) {
            audio.play().catch(err => console.error("Erro ao tocar áudio", err));
            setTocando(true);
        } else {
            audio.pause();
            setTocando(false);
        }
    };
    // Volume
    const iconeVolume = () => {
        if (volume === 0) return "fa-volume-xmark";
        if (volume <= 0.5) return "fa-volume-low";
        return "fa-volume-high";
    };
    const alterarVolume = (valor) => {
        const novoVolume = Math.min(Math.max(valor, 0), 1);
        setVolume(novoVolume);
    };

    // Avançar pela Barra
    const handleClickBarra = (e) => {
        const rect = barraRef.current.getBoundingClientRect();

        const porcentagem = (e.clientX - rect.left) / rect.width;
        const novoTempo = porcentagem * duracaoTotal;

        audioRef.current.currentTime = novoTempo;
        setTempoAtual(novoTempo);
        
        // Salva imediatamente ao clicar na barra
        salvarHistorico(novoTempo);
    };

    const atualizarTempo = React.useCallback((clientX) => {
        const barra = barraRef.current;
        const rect = barra.getBoundingClientRect();

        let posicao = clientX - rect.left;
        let porcentagem = posicao / rect.width;

        if (porcentagem < 0) porcentagem = 0;
        if (porcentagem > 1) porcentagem = 1;

        const novoTempo = Math.floor(porcentagem * duracaoTotal);
        audioRef.current.currentTime = novoTempo;
        setTempoAtual(novoTempo);
    }, [duracaoTotal]);

    const toggleFavorito = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            if (favoritar) {
                await axios.delete(`http://localhost:3001/favoritos/${idPodcast}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFavoritar(false);
            } else {
                await axios.post(`http://localhost:3001/favoritos`, 
                { audios_idaudios: idPodcast },
                { headers: { Authorization: `Bearer ${token}` } });
                setFavoritar(true);
            }
        } catch (error) {
            console.error("Erro ao alternar favorito", error);
        }
    };

    // Carregar dados do Podcast
    useEffect(() => {
        const carregarDados = async () => {
            const token = localStorage.getItem("token");
            try {
                // Busca dados e transcrição
                const headers = {};
                if (token && token !== "null" && token !== "undefined") {
                    headers.Authorization = `Bearer ${token}`;
                }

                const response = await axios.get(`${API_TRANSCRIPTION_URL}/transcricao/${idPodcast}`, {
                    headers
                });
                const caminhoOriginal = response.data.imagem_caminho || "";
                let urlImagem = "";

                if (caminhoOriginal) {
                    const nomeArquivo = caminhoOriginal.split('/').pop();
                    urlImagem = `http://localhost:3001/imagens/file/${nomeArquivo}`;
                }

                response.data.imagem_caminho = urlImagem;
                setDadosPlayer(response.data);

                if (response.data.transcricao && response.data.transcricao.texto) {
                    const transcricaoConvertida = parseTranscricao(response.data.transcricao.texto);
                    setTranscricao(transcricaoConvertida);
                }

                // Busca se está favoritado
                const favResponse = await axios.get("http://localhost:3001/favoritos/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const isFavorito = favResponse.data.some(fav => String(fav.id) === String(idPodcast));
                setFavoritar(isFavorito);

                // Busca Histórico (Tempo salvo)
                try {
                    const histResponse = await axios.get(`http://localhost:3001/historicos/audio/${idPodcast}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (histResponse.data && histResponse.data.tempo_audio) {
                        const tempoSalvo = tempoHistoricoParaSegundos(histResponse.data.tempo_audio);
                        
                        if (audioRef.current && audioRef.current.readyState >= 1) {
                            audioRef.current.currentTime = tempoSalvo;
                            setTempoAtual(tempoSalvo);
                        } else {
                            tempoInicialRef.current = tempoSalvo;
                        }
                        tempoSalvoRef.current = tempoSalvo;
                    }
                } catch (err) {
                    console.log("Não possui histórico para este áudio ainda.");
                }

            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        carregarDados();
    }, [idTema, playlistTema, idPodcast]);

    // Salvar Histórico periodicamente
    useEffect(() => {
        if (!tocando) return;

        const interval = setInterval(() => {
            if (!audioRef.current) return;
            
            const tempoAgora = Math.floor(audioRef.current.currentTime);
            // Só salva se mudou o tempo significativamente e se o usuário não está arrastando a barra no momento
            if (Math.abs(tempoAgora - tempoSalvoRef.current) >= 5 && !arrastando) {
                salvarHistorico(tempoAgora);
            }
        }, 5000); 

        return () => clearInterval(interval);
    }, [tocando, arrastando, salvarHistorico]);

    // Scroll acompanhar a Transcrição
    const linhaAtivaRef = useRef(null);
    const indexAtualRef = useRef(-1);

    useEffect(() => {
        const indexAtual = transcricao.findIndex(
            (linha) =>
                tempoAtual >= linha.start &&
                tempoAtual <= linha.end
        );

        if (indexAtual !== indexAtualRef.current) {
            indexAtualRef.current = indexAtual;

            if (linhaAtivaRef.current) {
                linhaAtivaRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        }
    }, [tempoAtual, transcricao]);

    // Tocar Audio
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const atualizarTempoAudio = () => {
            setTempoAtual(audio.currentTime);
        };

        const carregarDuracao = () => {
            setDuracaoTotal(Math.floor(audio.duration));
            
            if (tempoInicialRef.current > 0) {
                audio.currentTime = tempoInicialRef.current;
                setTempoAtual(tempoInicialRef.current);
                tempoInicialRef.current = 0; 
            }
        };

        const terminouAudio = () => {
            setTocando(false);
        };

        if (audio.readyState >= 1) {
            carregarDuracao();
        }

        audio.addEventListener("timeupdate", atualizarTempoAudio);
        audio.addEventListener("loadedmetadata", carregarDuracao);
        audio.addEventListener("ended", terminouAudio);

        return () => {
            audio.removeEventListener("timeupdate", atualizarTempoAudio);
            audio.removeEventListener("loadedmetadata", carregarDuracao);
            audio.removeEventListener("ended", terminouAudio);
        };
    }, []);

    // Controle de Volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Fazer o click arrastar do mouse na barra de progresso funcione
    useEffect(() => {
        if (!arrastando) return;

        const moverMouse = (e) => atualizarTempo(e.clientX);
        const pararArrastar = () => {
            setArrastando(false);
            if (audioRef.current) {
                salvarHistorico(audioRef.current.currentTime);
            }
        };

        document.addEventListener("mousemove", moverMouse);
        document.addEventListener("mouseup", pararArrastar);

        return () => {
            document.removeEventListener("mousemove", moverMouse);
            document.removeEventListener("mouseup", pararArrastar);
        };
    }, [arrastando, atualizarTempo, salvarHistorico]);

    // Deixar a Barra de Progresso em 60fps
    useEffect(() => {
        let frame;

        const atualizar = () => {
            if (audioRef.current && tocando) {
                setTempoAtual(audioRef.current.currentTime);
            }
            frame = requestAnimationFrame(atualizar);
        };

        frame = requestAnimationFrame(atualizar);

        return () => cancelAnimationFrame(frame);
    }, [tocando]);

    // Controle de Velocidade do Audio
    const [menuAbertoVelocidade, setMenuAbertoVelocidade] = useState(false);
    const [velocidadeSelecionada, setVelocidadeSelecionada] = useState(1);

    const velocidades = [
        { label: "0.5x", value: 0.5 },
        { label: "0.75x", value: 0.75 },
        { label: "1x", value: 1 },
        { label: "1.5x", value: 1.5 },
        { label: "1.75x", value: 1.75 },
        { label: "2x", value: 2 }
    ];

    const menuVelocidadeRef = useRef(null);
    const btnVelocidadeRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuAbertoVelocidade &&
                menuVelocidadeRef.current &&
                !menuVelocidadeRef.current.contains(event.target) &&
                btnVelocidadeRef.current &&
                !btnVelocidadeRef.current.contains(event.target)
            ) {
                setMenuAbertoVelocidade(false);
            }
        };

        document.addEventListener("pointerdown", handleClickOutside);
        return () => { document.removeEventListener("pointerdown", handleClickOutside) };
    }, [menuAbertoVelocidade]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = velocidadeSelecionada;
        }
    }, [velocidadeSelecionada]);

    const audioUrl = idPodcast ?
        `${API_TRANSCRIPTION_URL}/transcricao/${idPodcast}/audio?token=${localStorage.getItem("token")}`
        : "";

    return (
        <div className={Style.containerPlayer}>
            {/* Audio do Podcast */}
            {audioUrl && (
                <audio ref={audioRef} src={audioUrl} loop={loop}></audio>
            )}
            {/* Apresentação do Podcast */}
            <div className={Style.btnVoltar} onClick={() => { navigate(-1) }}>
                <i className="fa-solid fa-angle-left"></i>
                <p>Voltar</p>
            </div>
            <div className={Style.divApresentacaoPodcast}>
                <img src={dadosPlayer?.imagem_caminho || "/imgs/podcast-default.jpg"} alt={dadosPlayer?.titulo}
                    className={Style.imgApresentacaoPodcast}
                    onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                />
                <div className={Style.divTextosApresentacao}>
                    <h1>{dadosPlayer?.titulo}</h1>
                    <p>Feito por: {dadosPlayer?.usuario_nome || "PodsMath"}</p>
                    <div className={Style.ultimaDivApresentacao}>
                        <p>
                            <i className="fa-regular fa-clock"></i>
                            {" " + formatarTempo(duracaoTotal)}
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
                                    className={Style.opcaoMenu}
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
                <div className={Style.transcricao}>
                    {transcricao.length === 0 ? (
                        <p>Esse Podcast não possui uma Transcrição ainda.</p>
                    ) : (
                        transcricao.map((linha, index) => {
                            const ativo =
                                tempoAtual >= linha.start &&
                                tempoAtual <= linha.end;
                            return (
                                <span
                                    key={index}
                                    ref={ativo ? linhaAtivaRef : null}
                                    className={ativo ? Style.ativa : ""}
                                    onClick={() => {
                                        audioRef.current.currentTime = linha.start;
                                        salvarHistorico(linha.start);
                                    }}
                                >
                                    {linha.text}
                                </span>
                            );
                        })
                    )}
                </div>
            </div>
            <div className={Style.containerTocador}>
                <div className={Style.barraAudio}>
                    <p>{formatarTempo(tempoAtual)}</p>
                    {/* Barra de Progresso */}
                    <div className={Style.barraProgresso} onClick={handleClickBarra}
                        ref={barraRef}
                    >
                        {/* Barra em si */}
                        <div className={Style.progresso} style={{ width: `${progresso}%` }}></div>
                        {/* Bolinha da Barra */}
                        <div className={Style.thumb} style={{ left: `${progresso}%` }}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                setArrastando(true);
                            }}
                        ></div>
                    </div>
                    <p>{formatarTempo(duracaoTotal)}</p>
                </div>
                {/* Parte de Baixo do Tocador */}
                <div className={Style.divParteBaixoTocador}>
                    <div></div>
                    <div className={Style.menuManipulacaoAudio}>
                        <i className="fa-solid fa-backward"
                            onClick={() => {
                                const novoTempo = Math.max(audioRef.current.currentTime - 10, 0);
                                audioRef.current.currentTime = novoTempo;
                                salvarHistorico(novoTempo);
                            }}
                        ></i>
                        <div className={Style.divIconPlay}
                            onClick={togglePlay}
                        >
                            {!tocando ? (
                                <i className="fa-solid fa-play"></i>
                            ) : (
                                <i className="fa-solid fa-pause"></i>
                            )}
                        </div>
                        <i className="fa-solid fa-forward"
                            onClick={() => {
                                const novoTempo = Math.min(audioRef.current.currentTime + 10, duracaoTotal);
                                audioRef.current.currentTime = novoTempo;
                                salvarHistorico(novoTempo);
                            }}
                        ></i>
                    </div>
                    <div className={Style.divConfigsPlus}>
                        <div className={Style.divVolume}>
                            <i className={`fa-solid ${iconeVolume()}`}></i>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => alterarVolume(parseFloat(e.target.value))}
                            />
                        </div>
                        <div ref={btnVelocidadeRef}
                            onClick={() => setMenuAbertoVelocidade(!menuAbertoVelocidade)}
                            className={`${Style.divVelocidade} ${menuAbertoVelocidade ? Style.selecionado : ""}`}
                        >
                            <i className="fa-solid fa-gear"></i>
                            {/* Modal Troca de Velocidade */}
                            {menuAbertoVelocidade && (
                                <div
                                    ref={menuVelocidadeRef}
                                    className={Style.menuVelocidade}
                                >
                                    {velocidades.map((item) => (
                                        <div
                                            key={item.value}
                                            className={Style.opcaoMenu}
                                            onClick={() => {
                                                setVelocidadeSelecionada(item.value);
                                                setMenuAbertoVelocidade(false);
                                            }}
                                        >
                                            {item.label}
                                            {item.value === velocidadeSelecionada &&
                                                <i className="fa-solid fa-check"></i>
                                            }
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={`${loop ? Style.selecionado : ""}`}>
                            <i className="fa-solid fa-repeat"
                                onClick={() => { setLoop(!loop) }}
                            ></i>
                        </div>
                        <div className={`${favoritar ? Style.selecionado : ""}`}>
                            {!favoritar ? (
                                <i className="fa-regular fa-heart"
                                    onClick={toggleFavorito}
                                ></i>
                            ) : (
                                <i className="fa-solid fa-heart"
                                    onClick={toggleFavorito}
                                ></i>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}