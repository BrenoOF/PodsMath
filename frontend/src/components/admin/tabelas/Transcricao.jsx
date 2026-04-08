import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

import Style from "./tabelas.module.css";

// Import de Componentes
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

const API_BASE_URL = "/api-transcription";
const API_USER_URL = "/api-user";

export default function CompTranscricao() {
    const [modal, setModal] = useState(false);
    const [isEditar, setIsEditar] = useState(null);
    const [transcricoes, setTranscricoes] = useState([]);
    const [busca, setBusca] = useState("");

    // filtro por texto
    const transcricoesFiltradas = transcricoes.filter(t =>
        t.titulo?.toLowerCase().includes(busca.toLowerCase())
    );

    // Carregar dados
    const carregarDados = useCallback(async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${API_BASE_URL}/transcricao/status`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTranscricoes(response.data);
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    }, []);

    // Efetuar o Cadastro
    const alertCriarEditarSucesso = () => {
        Swal.fire({
            title: `Transcrição "${isEditar.titulo}" ${isEditar.idTranscricao ? "editada" : "criada"}`,
            icon: "success",
            confirmButtonColor: "#012663"
        });
    }

    const alertCriarEditarErro = () => {
        Swal.fire({
            title: `Erro ao  ${isEditar.idTranscricao ? "editar" : "criar"} Transcrição "${isEditar.titulo}"`,
            icon: "error",
            confirmButtonColor: "#012663"
        });
    }

    const salvarTranscricao = async () => {
        const token = localStorage.getItem("token");
        try {
            const payload = {
                textoTranscricao: isEditar.textoTranscricao,
                titulo: isEditar.titulo,
                idioma: isEditar.idioma,
                audioId: isEditar.audioId
            };
            // EDITAR
            if (isEditar.idTranscricao) {
                await axios.put(
                    `${API_USER_URL}/transcricoes/${isEditar.idTranscricao}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }/* CRIAR */ else {
                // Sem Função por enquanto
            }

            alertCriarEditarSucesso();
            setModal(false);
            carregarDados();
        }
        catch (error) {
            console.error("Erro ao salvar", error);
            alertCriarEditarErro();
        }
    };

    // Excluir Instituição
    /*
    const alertExclusao = (id) => {
        Swal.fire({
            title: "Tem certeza que deseja excluir esta transcrição?",
            text: "Essa ação não pode ser desfeita",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, Quero Excluir!",
            cancelButtonText: "Cancelar",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#012663"
        }).then((result) => {
            if (result.isConfirmed) {
                excluirTranscricao(id);
            }
        });
    }

    const excluirTranscricao = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(
                `${API_BASE_URL}/instituicoes/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setInstituicoes(prev => prev.filter(inst => inst.idinstituicoes !== id));
        }
        catch (error) {
            console.error("Erro ao excluir instituição", error);
        }
    };
    */

    // Carregar dados quando a pagina carrega
    useEffect(() => {
        carregarDados();
    }, [carregarDados]);

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

    // Deixar o Progresso suave
    useEffect(() => {
        const interval = setInterval(() => {
            carregarDados();
        }, 1000);

        return () => clearInterval(interval);
    }, [carregarDados]);

    return (
        <div className={Style.containerTabela}>
            <div className={Style.tituloTabela}>
                <h1>Gerenciar Transcrições</h1>
                {/* <button ref={btnRef} onClick={() => {
                    setModal(true);
                    setIsEditar({
                        nome: "",
                        idImagem: null
                    });
                    setPreviewImg("");
                }}>
                    <p>
                        <i className="fa-solid fa-plus"></i>
                        Nova Transcrição
                    </p>
                </button> */}
            </div>
            {/* Pequenos filtros */}
            <div className={Style.divFiltros}>
                <div className={Style.divInputPesquisa}>
                    <IconField iconPosition="left" className={Style.ajusteInput}>
                        <InputIcon className="pi pi-search" />
                        <InputText placeholder="Buscar transcrição..." className={Style.inputPesquisa}
                            value={busca} onChange={(e) => setBusca(e.target.value)}
                        />
                    </IconField>
                </div>
            </div>
            {/* Tabela em si */}
            <table className={Style.tabelaUsuarios}>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Idioma</th>
                        <th className={Style.colunaCenter}>Status</th>
                        <th className={Style.colunaCenter}>Progresso</th>
                        <th className={Style.colunaCenter}>
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {transcricoesFiltradas.map(transcricao => (
                        <tr
                            key={transcricao.idTranscricao}
                        >
                            <td>
                                {transcricao.titulo}
                            </td>
                            <td>
                                {transcricao.idioma}
                            </td>
                            <td className={Style.colunaCenter}>
                                <span className={`
                                    ${Style.badgeStatus}
                                    ${transcricao.status === "Transcrito" ? Style.transcrito : transcricao.status === "Na fila" ? Style.nafila : Style.transcrevendo}
                                `}>
                                    {transcricao.status === "Transcrito" ? (
                                        <i className="fa-regular fa-circle-check"></i>
                                    ) : transcricao.status === "Na fila" ? (
                                        <i className="fa-regular fa-clock"></i>
                                    ) : (
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    )}
                                    {transcricao?.status || "Não Transcrito"}
                                </span>
                            </td>
                            <td className={Style.colunaCenter}>
                                {transcricao.progresso}%
                            </td>
                            <td className={Style.colunaCenter}>
                                <div className={Style.divBtns}>
                                    <button ref={btnRef} onClick={() => {
                                        setModal(true);
                                        setIsEditar(transcricao);
                                    }}
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    {/* <button onClick={() => {
                                        alertExclusao(instituicao.idinstituicoes);
                                    }}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button> */}
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
                                {isEditar?.idTranscricao ? "Editar" : "Nova"} Transcrição
                            </h1>
                            <i className="fa-solid fa-xmark"
                                onClick={() => { setModal(false) }}
                            ></i>
                        </div>
                        <form className={Style.formModal} onSubmit={(e) => {
                            e.preventDefault();
                            salvarTranscricao();
                        }}>
                            <div className={Style.divInput}>
                                <label>Texto da Transcrição</label>
                                <InputTextarea value={isEditar.textoTranscricao || ""}
                                    onChange={(e) => {
                                        setIsEditar({
                                            ...isEditar,
                                            textoTranscricao: e.target.value
                                        });
                                    }}
                                    rows={12}
                                    className={Style.input}
                                    placeholder="Transcrição do Podcast"
                                    style={{ resize: "none" }}
                                />
                            </div>
                        </form>
                        <div className={Style.modalFooter}>
                            <button onClick={() => setModal(false)}>
                                Cancelar
                            </button>
                            <button className={Style.btnCriar} onClick={salvarTranscricao}>
                                {isEditar?.idTranscricao ? "Atualizar" : "Criar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}