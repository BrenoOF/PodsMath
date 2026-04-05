import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

import Style from "./tabelas.module.css";

// Import de Componentes
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { Message } from 'primereact/message';

const API_BASE_URL = "/api-user";

export default function CompCategoria() {
    const [modal, setModal] = useState(false);
    const [isEditar, setIsEditar] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [busca, setBusca] = useState("");
    const [previewImg, setPreviewImg] = useState("");

    // filtro por texto
    const categoriasFiltradas = categorias.filter(categoria =>
        categoria.nome?.toLowerCase().includes(busca.toLowerCase())
    );

    // tratamento de erros
    const [errors, setErrors] = useState({});

    const limparErro = (campo) => {
        setErrors((prev) => ({ ...prev, [campo]: null }));
    };

    const validarCampos = () => {
        let novosErros = {};

        if (!isEditar.nome?.trim()) novosErros.nome = "Nome é obrigatório";

        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    // Carregar dados
    const carregarDados = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`${API_BASE_URL}/categorias`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            response.data.forEach(cat => {
                if (cat.idImagem) {
                    const nomeArquivo = cat.idImagem.split('/').pop();
                    cat.idImagem = `/api-user/imagens/file/${nomeArquivo}`;
                }
            });

            setCategorias(response.data);
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    }

    // Funções para Imagem
    const trocarImagem = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreviewImg(URL.createObjectURL(file));
        setIsEditar({
            ...isEditar,
            idImagem: isEditar?.idImagem || 1
        });
    };

    // Efetuar o Cadastro
    const alertCriarEditarSucesso = () => {
        Swal.fire({
            title: `Categoria "${isEditar.nome}" ${isEditar.idcategorias ? "editada" : "criada"}`,
            icon: "success",
            confirmButtonColor: "#012663"
        });
    }

    const alertCriarEditarErro = () => {
        Swal.fire({
            title: `Erro ao  ${isEditar.idcategorias ? "editar" : "criar"} categoria "${isEditar.nome}"`,
            icon: "error",
            confirmButtonColor: "#012663"
        });
    }

    const salvarCategoria = async () => {
        if (!validarCampos()) return;
        const token = localStorage.getItem("token");
        try {
            const payload = {
                nome: isEditar.nome,
                imagens_idimagens: isEditar?.idImagem || 1
            };
            // EDITAR
            if (isEditar.idcategorias) {
                await axios.put(
                    `${API_BASE_URL}/categorias/${isEditar.idcategorias}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }/* CRIAR */ else {
                await axios.post(
                    `${API_BASE_URL}/categorias`,
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

    // Excluir Categoria
    const alertExclusao = (id) => {
        Swal.fire({
            title: "Tem certeza que deseja excluir esta categoria?",
            text: "Essa ação não pode ser desfeita",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, Quero Excluir!",
            cancelButtonText: "Cancelar",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#012663"
        }).then((result) => {
            if (result.isConfirmed) {
                excluirCategoria(id);
            }
        });
    }

    const excluirCategoria = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(
                `${API_BASE_URL}/categorias/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setCategorias(prev => prev.filter(cat => cat.idcategorias !== id));
        }
        catch (error) {
            console.error("Erro ao excluir categoria", error);
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
                <h1>Gerenciar Categorias</h1>
                <button ref={btnRef} onClick={() => {
                    setModal(true);
                    setIsEditar({
                        nome: "",
                        idImagem: null
                    });
                    setPreviewImg("");
                }}>
                    <p>
                        <i className="fa-solid fa-plus"></i>
                        Nova Categoria
                    </p>
                </button>
            </div>
            {/* Pequenos filtros */}
            <div className={Style.divFiltros}>
                <div className={Style.divInputPesquisa}>
                    <IconField iconPosition="left" className={Style.ajusteInput}>
                        <InputIcon className="pi pi-search" />
                        <InputText placeholder="Buscar categoria..." className={Style.inputPesquisa}
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
                        <th>Nome</th>
                        <th className={Style.colunaCenter}>
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {categoriasFiltradas.map(categoria => (
                        <tr
                            key={categoria.idcategorias}
                        >
                            <td>
                                <img src={categoria?.imagens_idimagens || "/imgs/podcast-default.jpg"} 
                                    alt={categoria.nome} className={Style.tableImg}
                                    draggable="false"
                                    onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                                />
                            </td>
                            <td>
                                {categoria.nome}
                            </td>
                            <td className={Style.colunaCenter}>
                                <div className={Style.divBtns}>
                                    <button ref={btnRef} onClick={() => {
                                        setModal(true);
                                        setIsEditar(categoria);
                                        setPreviewImg(categoria.idImagem || "");
                                    }}
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button onClick={() => {
                                        alertExclusao(categoria.idcategorias);
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
                                {isEditar?.idcategorias ? "Editar" : "Nova"} Categoria
                            </h1>
                            <i className="fa-solid fa-xmark"
                                onClick={() => { setModal(false) }}
                            ></i>
                        </div>
                        <form className={Style.formModal} onSubmit={(e) => {
                            e.preventDefault();
                            salvarCategoria();
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
                                        alt="Imagem categoria"
                                        draggable="false"
                                        onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="inputImagemCategoria"
                                        onChange={trocarImagem}
                                        className={Style.inputFile}
                                    />
                                    <label
                                        htmlFor="inputImagemCategoria"
                                        className={Style.btnAlterarImagem}
                                    >
                                        <i className="fa-solid fa-camera"></i>
                                    </label>
                                </div>
                                <p>Imagem da categoria</p>
                            </div>
                            <div className={Style.divInput}>
                                <label>Nome</label>
                                <InputText value={isEditar.nome}
                                    onChange={(e) => {
                                        setIsEditar({
                                            ...isEditar,
                                            nome: e.target.value
                                        });
                                        limparErro("nome");
                                    }}
                                    className={`${Style.input} ${errors.nome ? "p-invalid" : ""}`}
                                    placeholder="Nome da categoria"
                                />
                                {errors.nome && (
                                    <Message severity="error" text={errors.nome} />
                                )}
                            </div>
                        </form>
                        <div className={Style.modalFooter}>
                            <button onClick={() => setModal(false)}>
                                Cancelar
                            </button>
                            <button className={Style.btnCriar} onClick={salvarCategoria}>
                                {isEditar?.idcategorias ? "Atualizar" : "Criar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}