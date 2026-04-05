import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

import Style from "./tabelas.module.css";

// Import de Componentes
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';

const API_BASE_URL = "/api-user";

export default function CompTema() {
    const [modal, setModal] = useState(false);
    const [isEditar, setIsEditar] = useState(null);
    const [temas, setTemas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [busca, setBusca] = useState("");
    const [previewImg, setPreviewImg] = useState("");

    // Array de Opções do Dropdown
    const categoriasOptions = categorias.map(cat => ({
        label: cat.nome,
        value: cat.idcategorias
    }));

    // filtro por texto
    const temasFiltrados = temas.filter(tema =>
        tema.titulo?.toLowerCase().includes(busca.toLowerCase())
    );

    // busca nome da categoria pelo id
    const getNomeCategoria = (idCategoria) => {
        const categoria = categorias.find(
            cat => cat.idcategorias === idCategoria
        );
        return categoria?.nome || "-";
    };

    // tratamento de erros
    const [errors, setErrors] = useState({});

    const limparErro = (campo) => {
        setErrors((prev) => ({ ...prev, [campo]: null }));
    };

    const validarCampos = () => {
        let novosErros = {};

        if (!isEditar.titulo?.trim()) novosErros.titulo = "Título é obrigatório";

        if (!isEditar.categorias_idcategorias) novosErros.categorias_idcategorias = "Categoria é obrigatória";

        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    // Carregar dados
    const carregarDados = async () => {
        const token = localStorage.getItem("token");
        try {
            const [response, resCategorias] = await Promise.all([
                axios.get(
                    `${API_BASE_URL}/temas`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                ),
                axios.get(
                    `${API_BASE_URL}/categorias`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
            ]);

            response.data.forEach(cat => {
                if (cat.idImagem) {
                    const nomeArquivo = cat.idImagem.split('/').pop();
                    cat.idImagem = `/api-user/imagens/file/${nomeArquivo}`;
                }
            });

            setTemas(response.data);
            setCategorias(resCategorias.data);
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
            title: `Tema "${isEditar.titulo}" ${isEditar.idtemas ? "editado" : "criado"}`,
            icon: "success",
            confirmButtonColor: "#012663"
        });
    }

    const alertCriarEditarErro = () => {
        Swal.fire({
            title: `Erro ao  ${isEditar.idtemas ? "editar" : "criar"} tema "${isEditar.titulo}"`,
            icon: "error",
            confirmButtonColor: "#012663"
        });
    }

    const salvarTema = async () => {
        if (!validarCampos()) return;
        const token = localStorage.getItem("token");
        try {
            const payload = {
                titulo: isEditar.titulo,
                categorias_idcategorias: isEditar.categorias_idcategorias,
                imagens_idimagens: isEditar?.idImagem || 1
            };
            // EDITAR
            if (isEditar.idtemas) {
                await axios.put(
                    `${API_BASE_URL}/temas/${isEditar.idtemas}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }/* CRIAR */ else {
                await axios.post(
                    `${API_BASE_URL}/temas`,
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

    // Excluir tema
    const alertExclusao = (id) => {
        Swal.fire({
            title: "Tem certeza que deseja excluir esse Tema?",
            text: "Essa ação não pode ser desfeita",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, Quero Excluir!",
            cancelButtonText: "Cancelar",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#012663"
        }).then((result) => {
            if (result.isConfirmed) {
                excluirTema(id);
            }
        });
    }

    const excluirTema = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(
                `${API_BASE_URL}/temas/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setTemas(prev => prev.filter(t => t.idtemas !== id));
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
                <h1>Gerenciar Temas</h1>
                <button ref={btnRef} onClick={() => {
                    setModal(true);
                    setIsEditar({
                        titulo: "",
                        categorias_idcategorias: "",
                        idImagem: null
                    });
                    setPreviewImg("");
                }}>
                    <p>
                        <i className="fa-solid fa-plus"></i>
                        Novo Tema
                    </p>
                </button>
            </div>
            {/* Pequenos filtros */}
            <div className={Style.divFiltros}>
                <div className={Style.divInputPesquisa}>
                    <IconField iconPosition="left" className={Style.ajusteInput}>
                        <InputIcon className="pi pi-search" />
                        <InputText placeholder="Buscar tema..." className={Style.inputPesquisa}
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
                        <th>
                            Categoria
                        </th>
                        <th className={Style.colunaCenter}>
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {temasFiltrados.map(tema => (
                        <tr
                            key={tema.idtemas}
                        >
                            <td>
                                <img src={tema?.imagens_idimagens || "/imgs/podcast-default.jpg"}
                                    alt={tema.titulo} className={Style.tableImg}
                                    draggable="false"
                                    onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                                />
                            </td>
                            <td>
                                {tema.titulo}
                            </td>
                            <td>
                                {getNomeCategoria(tema.categorias_idcategorias)}
                            </td>
                            <td className={Style.colunaCenter}>
                                <div className={Style.divBtns}>
                                    <button ref={btnRef} onClick={() => {
                                        setModal(true);
                                        setIsEditar({
                                            ...tema,
                                            categorias_idcategorias: tema.categorias_idcategorias
                                        });
                                        setPreviewImg(tema.idImagem || "");
                                    }}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button onClick={() => {
                                        alertExclusao(tema.idtemas);
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
                                {isEditar?.idtemas ? "Editar" : "Novo"} Tema
                            </h1>
                            <i className="fa-solid fa-xmark"
                                onClick={() => { setModal(false) }}
                            ></i>
                        </div>
                        <form className={Style.formModal} onSubmit={(e) => {
                            e.preventDefault();
                            salvarTema();
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
                                        alt="Imagem Tema"
                                        draggable="false"
                                        onError={(e) => (e.target.src = "/imgs/podcast-default.jpg")}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="inputImagemTema"
                                        onChange={trocarImagem}
                                        className={Style.inputFile}
                                    />
                                    <label
                                        htmlFor="inputImagemTema"
                                        className={Style.btnAlterarImagem}
                                    >
                                        <i className="fa-solid fa-camera"></i>
                                    </label>
                                </div>
                                <p>Imagem do Tema</p>
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
                                    placeholder="Título do Tema"
                                />
                                {errors.titulo && (
                                    <Message severity="error" text={errors.titulo} />
                                )}
                            </div>
                            <div className={Style.divInput}>
                                <label>Categoria</label>
                                <div className={Style.divDropdown}>
                                    <Dropdown appendTo="self" value={isEditar.categorias_idcategorias}
                                        onChange={(e) => {
                                            setIsEditar({
                                                ...isEditar,
                                                categorias_idcategorias: e.value
                                            });
                                            limparErro("categorias_idcategorias");
                                        }}
                                        options={categoriasOptions}
                                        placeholder="Selecione uma categoria"
                                        className={`
                                            ${Style.input}
                                            ${errors.categorias_idcategorias ? "p-invalid" : ""}
                                        `}
                                    />
                                </div>
                                {errors.categorias_idcategorias && (
                                    <Message severity="error" text={errors.categorias_idcategorias} />
                                )}
                            </div>
                        </form>
                        <div className={Style.modalFooter}>
                            <button onClick={() => setModal(false)}>
                                Cancelar
                            </button>
                            <button className={Style.btnCriar} onClick={salvarTema}>
                                {isEditar?.idtemas ? "Atualizar" : "Criar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}