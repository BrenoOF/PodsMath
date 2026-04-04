import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

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
                if (cat.caminho_imagem) {
                    const nomeArquivo = cat.caminho_imagem.split('/').pop();
                    cat.caminho_imagem = `/api-user/imagens/file/${nomeArquivo}`;
                }
            });

            setCategorias(response.data);
        } catch (error) {
            console.error("Erro ao carregar dados", error);
        }
    }

    // Efetuar o Cadastro
    const salvarCategoria = async () => {
        if (!validarCampos()) return;
        const token = localStorage.getItem("token");
        try {
            const formData = new FormData();
            formData.append(
                "nome",
                isEditar.nome
            );
            // imagem (opcional)
            if (isEditar.imagem)
                formData.append(
                    "imagem",
                    isEditar.imagem
                );
            // EDITAR
            if (isEditar.idcategorias) {
                await axios.put(
                    `${API_BASE_URL}/categorias/${isEditar.idcategorias}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }/* CRIAR */ else {
                await axios.post(
                    `${API_BASE_URL}/categorias`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }
            setModal(false);
            setErrors({});
            carregarDados();
        }
        catch (error) {
            console.error("Erro ao salvar", error);
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
                        imagem: null
                    });
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
                        <InputText placeholder="Buscar categoria..." className={Style.input}
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
                                <img src="./imgs/podcast-default.jpg" alt={categoria.idcategorias}
                                    className={Style.tableImg}
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
                                    }}
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button>
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