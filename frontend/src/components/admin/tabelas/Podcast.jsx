import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

import Style from "./tabelas.module.css";

// Import de Componentes
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from "primereact/inputtextarea";
import { Message } from 'primereact/message';

const API_BASE_URL = "/api-user";

export default function CompPodcast() {
    const [modal, setModal] = useState(false);
    const [isEditar, setIsEditar] = useState(null);
    const [audios, setAudios] = useState([]);
    const [temas, setTemas] = useState([]);
    const [instituicoes, setInstituicoes] = useState([]);
    const [busca, setBusca] = useState("");
    const [previewImg, setPreviewImg] = useState("");
    const [audioFile, setAudioFile] = useState(null);

    // Array de Opções do Dropdown
    const temasOptions = temas.map(t => ({
        label: t.titulo,
        value: t.idtemas
    }));

    const instituicaoOptions = instituicoes.map(inst => ({
        label: inst.nome,
        value: inst.idinstituicoes
    }));

    // filtro por texto
    const audiosFiltrados = audios.filter(audio =>
        audio.titulo?.toLowerCase().includes(busca.toLowerCase())
    );

    // busca nome do tema e instituição pelo id
    const getNomeTema = (id) => {
        const tema = temas.find(
            t => t.idtemas === id
        );
        return tema?.titulo || "-";
    };

    const getNomeInstituicao = (id) => {
        const inst = instituicoes.find(
            i => i.idinstituicoes === id
        );
        return inst?.nome || "-";
    };

    // tratamento de erros
    const [errors, setErrors] = useState({});

    const limparErro = (campo) => {
        setErrors((prev) => ({ ...prev, [campo]: null }));
    };

    const validarCampos = () => {
        let novosErros = {};

        if (!isEditar.titulo?.trim()) novosErros.titulo = "Título é obrigatório";

        if (!isEditar.descricao?.trim()) novosErros.descricao = "Descrição é obrigatória";

        if (!isEditar.temas_idtemas) novosErros.temas_idtemas = "Tema é obrigatório";

        if (!isEditar.instituicoes_idinstituicoes)
            novosErros.instituicoes_idinstituicoes = "Instuituição é obrigatória";

        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    // Carregar dados
    const carregarDados = async () => {
        const token = localStorage.getItem("token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const [resAudios, resTemas, resInstituicoes] = await Promise.all([
                axios.get(`${API_BASE_URL}/audios`, { headers }),
                axios.get(`${API_BASE_URL}/temas`, { headers }),
                axios.get(`${API_BASE_URL}/instituicoes`, { headers })
            ]);

            resAudios.data.forEach(aud => {
                if (aud.idImagem) {
                    const nomeArquivo = aud.idImagem.split('/').pop();
                    aud.idImagem = `/api-user/imagens/file/${nomeArquivo}`;
                }
            });

            setAudios(resAudios.data);
            setTemas(resTemas.data);
            setInstituicoes(resInstituicoes.data);
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    }

    // Funções para Imagem e Audio
    const trocarImagem = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreviewImg(URL.createObjectURL(file));
        setIsEditar({
            ...isEditar,
            idImagem: isEditar?.idImagem || 1
        });
    };

    const trocarAudio = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAudioFile(file);
        setIsEditar({
            ...isEditar,
            arquivoAudio: file?.name || 1
        });
    };

    // Efetuar o Cadastro
    const alertCriarEditarSucesso = () => {
        Swal.fire({
            title: `Podcast "${isEditar.titulo}" ${isEditar.idaudios ? "editado" : "criado"}`,
            icon: "success",
            confirmButtonColor: "#012663"
        });
    }

    const alertCriarEditarErro = () => {
        Swal.fire({
            title: `Erro ao  ${isEditar.idaudios ? "editar" : "criar"} podcast "${isEditar.titulo}"`,
            icon: "error",
            confirmButtonColor: "#012663"
        });
    }

    const salvarAudio = async () => {
        if (!validarCampos()) return;
        const token = localStorage.getItem("token");
        try {
            const payload = {
                titulo: isEditar.titulo,
                descricao: isEditar.descricao || "",
                temas_idtemas: isEditar.temas_idtemas,
                instituicoes_idinstituicoes: isEditar.instituicoes_idinstituicoes,
                imagens_idimagens: isEditar?.idImagem || 1
            };
            // EDITAR
            if (isEditar.idaudios) {
                await axios.put(
                    `${API_BASE_URL}/audios/${isEditar.idaudios}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }/* CRIAR */ else {
                await axios.post(
                    `${API_BASE_URL}/audios`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }
            alertCriarEditarSucesso();
            setModal(false);
            setErrors({});
            setPreviewImg("");
            carregarDados();
        }
        catch (error) {
            console.error("Erro ao salvar", error);
            alertCriarEditarErro();
        }
    };

    // Excluir Podcast
    const alertExclusao = (id) => {
        Swal.fire({
            title: "Tem certeza que deseja excluir esse Podcast?",
            text: "Essa ação não pode ser desfeita",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, Quero Excluir!",
            cancelButtonText: "Cancelar",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#012663"
        }).then((result) => {
            if (result.isConfirmed) {
                excluirAudio(id);
            }
        });
    }

    const excluirAudio = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(
                `${API_BASE_URL}/audios/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setAudios(prev => prev.filter(a => a.idaudios !== id));
        }
        catch (error) {
            console.error("Erro ao excluir podcast", error);
        }
    };

    // Carregar dados quando a pagina carrega
    useEffect(() => {
        carregarDados();
    }, []);

    // Clicar fora do modal fecha-lo
    const btnRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                btnRef.current &&
                !btnRef.current.contains(event.target)
            ) {
                setModal(false);
            }
        };
        document.addEventListener("pointerdown", handleClickOutside);
        return () => { document.removeEventListener("pointerdown", handleClickOutside) };
    }, []);

    return (
        <div className={Style.containerTabela}>
            <div className={Style.tituloTabela}>
                <h1>Gerenciar Podcasts</h1>
                <button ref={btnRef} onClick={() => {
                    setModal(true);
                    setIsEditar({
                        titulo: "",
                        descricao: "",
                        temas_idtemas: "",
                        instituicoes_idinstituicoes: "",
                        imagens_idimagens: null
                    });
                    setPreviewImg("");
                }}>
                    <p>
                        <i className="fa-solid fa-plus"></i>
                        Novo Podcast
                    </p>
                </button>
            </div>
            {/* Pequenos filtros */}
            <div className={Style.divFiltros}>
                <div className={Style.divInputPesquisa}>
                    <IconField iconPosition="left" className={Style.ajusteInput}>
                        <InputIcon className="pi pi-search" />
                        <InputText placeholder="Buscar podcast..." className={Style.inputPesquisa}
                            value={busca} onChange={(e) => setBusca(e.target.value)}
                        />
                    </IconField>
                </div>
            </div>
            {/* Tabela em si */}
            <table className={Style.tabelaUsuarios}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Título</th>
                        <th>Instituição</th>
                        <th>Tema</th>
                        <th className={Style.colunaCenter}>Visualizações</th>
                        <th className={Style.colunaCenter}>
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {audiosFiltrados.map(audio => (
                        <tr
                            key={audio.idaudios}
                        >
                            <td>
                                <img src={audio?.imagens_idimagens || "/imgs/podcast-default.jpg"}
                                    alt={audio.titulo} className={Style.tableImg}
                                    draggable="false"
                                    onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                                />
                            </td>
                            <td>
                                {audio.titulo}
                            </td>
                            <td>{getNomeInstituicao(audio.instituicoes_idinstituicoes)}</td>
                            <td>
                                {getNomeTema(audio.temas_idtemas)}
                            </td>
                            <td className={Style.colunaCenter}>
                                {audio.visualizacoes || 0}
                            </td>
                            <td className={Style.colunaCenter}>
                                <div className={Style.divBtns}>
                                    <button ref={btnRef} onClick={() => {
                                        setModal(true);
                                        setIsEditar({
                                            ...audio
                                        });
                                        setPreviewImg(audio.idImagem || "");
                                    }}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button onClick={() => {
                                        alertExclusao(audio.idaudios);
                                    }}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Modal de Cadastro */}
            {modal && (
                <div className={Style.modalOverlay}>
                    <div className={Style.modal} ref={menuRef}>
                        <div className={Style.divTituloModal}>
                            <h1>
                                {isEditar?.idaudios ? "Editar" : "Novo"} Podcast
                            </h1>
                            <i className="fa-solid fa-xmark"
                                onClick={() => { setModal(false) }}
                            ></i>
                        </div>
                        <form className={Style.formModal} onSubmit={(e) => {
                            e.preventDefault();
                            salvarAudio();
                        }}>
                            <div className={Style.divInputImagem}>
                                <div className={Style.previewImagem}>
                                    <img
                                        src={
                                            previewImg
                                            ||
                                            isEditar?.idImagem
                                            ||
                                            "/imgs/podcast-default.jpg"
                                        }
                                        alt="Imagem Podcast"
                                        draggable="false"
                                        onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="inputImagemPodcast"
                                        onChange={trocarImagem}
                                        className={Style.inputFile}
                                    />
                                    <label
                                        htmlFor="inputImagemPodcast"
                                        className={Style.btnAlterarImagem}
                                    >
                                        <i className="fa-solid fa-camera"></i>
                                    </label>
                                </div>
                                <p>Imagem do Podcast</p>
                            </div>
                            <div className={Style.divInputAudio}>
                                <label htmlFor="inputAudioPodcast" className={Style.labelAudio}>
                                    <i className="fa-solid fa-music"></i>
                                    Selecionar áudio
                                </label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    id="inputAudioPodcast"
                                    onChange={trocarAudio}
                                    className={Style.inputFile}
                                />
                                {audioFile && (
                                    <small>{audioFile.name}</small>
                                )}
                            </div>
                            <div className={Style.divInput}>
                                <label>Título</label>
                                <InputText value={isEditar.titulo}
                                    onChange={(e) => {
                                        setIsEditar({
                                            ...isEditar,
                                            titulo: e.target.value
                                        });
                                        limparErro("titulo");
                                    }}
                                    className={`${Style.input} ${errors.titulo ? "p-invalid" : ""}`}
                                    placeholder="Título do Podcast"
                                />
                                {errors.titulo && (
                                    <Message severity="error" text={errors.titulo} />
                                )}
                            </div>
                            <div className={Style.divInput}>
                                <label>Descrição</label>
                                <InputTextarea value={isEditar.descricao || ""}
                                    onChange={(e) => {
                                        setIsEditar({
                                            ...isEditar,
                                            descricao: e.target.value
                                        });
                                        limparErro("descricao");
                                    }}
                                    rows={5}
                                    className={`
                                        ${Style.input}
                                        ${errors.descricao ? "p-invalid" : ""}
                                    `}
                                    placeholder="Descrição do Podcast"
                                />
                                {errors.descricao && (
                                    <Message severity="error" text={errors.descricao} />
                                )}
                            </div>
                            <div className={Style.divInput}>
                                <label>Instituição</label>
                                <div className={Style.divDropdown}>
                                    <Dropdown appendTo="self" value={isEditar.instituicoes_idinstituicoes}
                                        onChange={(e) => {
                                            setIsEditar({
                                                ...isEditar,
                                                instituicoes_idinstituicoes: e.value
                                            });
                                            limparErro("instituicoes_idinstituicoes");
                                        }}
                                        options={instituicaoOptions}
                                        placeholder="Selecione uma Instituição"
                                        className={`
                                            ${Style.input}
                                            ${errors.instituicoes_idinstituicoes ? "p-invalid" : ""}
                                        `}
                                    />
                                </div>
                                {errors.temas_idtemas && (
                                    <Message severity="error" text={errors.temas_idtemas} />
                                )}
                            </div>
                            <div className={Style.divInput}>
                                <label>Tema</label>
                                <div className={Style.divDropdown}>
                                    <Dropdown appendTo="self" value={isEditar.temas_idtemas}
                                        onChange={(e) => {
                                            setIsEditar({
                                                ...isEditar,
                                                temas_idtemas: e.value
                                            });
                                            limparErro("temas_idtemas");
                                        }}
                                        options={temasOptions}
                                        placeholder="Selecione um Tema"
                                        className={`
                                            ${Style.input}
                                            ${errors.temas_idtemas ? "p-invalid" : ""}
                                        `}
                                    />
                                </div>
                                {errors.temas_idtemas && (
                                    <Message severity="error" text={errors.temas_idtemas} />
                                )}
                            </div>
                        </form>
                        <div className={Style.modalFooter}>
                            <button onClick={() => setModal(false)}>
                                Cancelar
                            </button>
                            <button className={Style.btnCriar} onClick={salvarAudio}>
                                {isEditar?.idaudios ? "Atualizar" : "Criar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}