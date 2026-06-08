import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

import Style from "./tabelas.module.css";

// Import de Componentes
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';

const API_BASE_URL = "/api-user";

export default function CompUsuario() {
    const [modal, setModal] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [niveis, setNiveis] = useState([]);
    const [isEditar, setIsEditar] = useState(null);
    const [busca, setBusca] = useState("");
    const [instituicoes, setInstituicoes] = useState([]);

    const [menuConfigsAberto, setMenuConfigsAberto] = useState(false);
    const [nivelSelecionado, setNivelSelecionado] = useState("todos");

    // Array de Opções do Dropdown
    const niveisOptions = niveis.map(nv => ({
        label: nv.nome,
        value: nv.idnivel_acesso
    }));

    const instituicaoOptions = [
        { label: "Nenhuma", value: null },
        ...instituicoes.map(inst => ({
            label: inst.nome,
            value: inst.idinstituicoes
        }))
    ];

    const mudarNivel = (valor) => {
        setNivelSelecionado(valor);
        setMenuConfigsAberto(false);
    };

    // filtro por texto + nivel
    const niveisFiltro = [
        { value: "todos", label: "Todos" },
        ...niveis.map(nv => ({
            value: nv.idnivel_acesso,
            label: nv.nome
        }))
    ];

    const usuariosFiltrados = usuarios.filter(usuario => {
        const matchBusca =
            usuario.nome?.toLowerCase().includes(busca.toLowerCase()) ||
            usuario.email?.toLowerCase().includes(busca.toLowerCase());

        const matchNivel =
            nivelSelecionado === "todos" ||
            usuario.nivel_acesso_idnivel_acesso === nivelSelecionado;

        return matchBusca && matchNivel;
    });

    // buscar usuarios
    const carregarDados = async () => {
        const token = localStorage.getItem("token");
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const [resUsuarios, resNiveis, resInstituicoes] = await Promise.all([
                axios.get(`${API_BASE_URL}/usuarios`, { headers }),
                axios.get(`${API_BASE_URL}/niveis-acesso`, { headers }),
                axios.get(`${API_BASE_URL}/instituicoes`, { headers })
            ]);

            setUsuarios(resUsuarios.data);
            setNiveis(resNiveis.data);
            setInstituicoes(resInstituicoes.data);
        } catch (erro) {
            console.error("erro ao buscar usuarios", erro);
        }
    }

    // Efetuar o Editar
    const salvarUsuario = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                `${API_BASE_URL}/usuarios/${isEditar.idusuarios}/nivel-acesso`,
                { nivel_acesso_idnivel_acesso: isEditar.nivel_acesso_idnivel_acesso },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                // Ver Api do Backend para fazer edição de instituição tb
            );

            Swal.fire({
                title: `Nível de acesso de "${isEditar.nome}" alterado`,
                icon: "success",
                confirmButtonColor: "#012663"
            });

            setModal(false);
            carregarDados();
        }
        catch (error) {
            console.error("Erro ao salvar", error);
            Swal.fire({
                title: `Erro ao  editar usuário "${isEditar.nome}`,
                icon: "error",
                confirmButtonColor: "#012663"
            });
        }
    };

    // Excluir Usuario
    const alertExclusao = (id) => {
        Swal.fire({
            title: "Tem certeza que deseja excluir este Usuário?",
            text: "Essa ação não pode ser desfeita",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, Quero Excluir!",
            cancelButtonText: "Cancelar",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#012663"
        }).then((result) => {
            if (result.isConfirmed) {
                excluirUsuario(id);
            }
        });
    }

    const excluirUsuario = async (id) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(
                `${API_BASE_URL}/usuarios/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setUsuarios(prev => prev.filter(user => user.idusuarios !== id));
        }
        catch (error) {
            console.error("Erro ao excluir instituição", error);
        }
    };

    // Carregar dados quando a pagina carrega
    useEffect(() => {
        carregarDados();
    }, []);

    // fechar menu ao clicar fora no filtro
    const btnConfigsRef = useRef(null);
    const menuConfigsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuConfigsRef.current &&
                !menuConfigsRef.current.contains(event.target) &&
                !btnConfigsRef.current.contains(event.target)
            ) {
                setMenuConfigsAberto(false);
            }
        };
        document.addEventListener("pointerdown", handleClickOutside);
        return () => { document.removeEventListener("pointerdown", handleClickOutside) };
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
                <h1>Gerenciar Usuários</h1>
            </div>
            {/* Pequenos filtros */}
            <div className={Style.divFiltros}>
                <div className={Style.divInputPesquisa}>
                    <IconField iconPosition="left" className={Style.ajusteInput}>
                        <InputIcon className="pi pi-search" />
                        <InputText placeholder="Buscar por Nome ou Email..." className={Style.inputPesquisa}
                            value={busca} onChange={(e) => setBusca(e.target.value)}
                        />
                    </IconField>
                </div>
                {/* botão que abre menu */}
                <div
                    ref={btnConfigsRef}
                    className={Style.btnConfigs}
                    onClick={() => setMenuConfigsAberto(!menuConfigsAberto)}
                >
                    {niveisFiltro.find(n => n.value === nivelSelecionado)?.label}
                    <i className="fa-solid fa-angle-down"></i>
                </div>
                {/* menu */}
                {menuConfigsAberto && (
                    <div
                        ref={menuConfigsRef}
                        className={Style.menuConfigs}
                    >
                        {niveisFiltro.map((item) => (
                            <div
                                key={item.value}
                                className={Style.btnOpcao}
                                onClick={() => mudarNivel(item.value)}
                            >
                                {item.label}
                                {item.value === nivelSelecionado && (
                                    <i className="fa-solid fa-check"></i>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Tabela em si */}
            <table className={Style.tabelaUsuarios}>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th className={Style.colunaCenter}>Nível</th>
                        <th className={Style.colunaCenter}>
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {usuariosFiltrados.map(usuario => (
                        <tr
                            key={usuario.idusuarios}
                        >
                            <td>
                                {usuario.nome}
                            </td>
                            <td>
                                {usuario.email}
                            </td>
                            <td className={Style.colunaCenter}>
                                <span className={Style.badgeNivel}>
                                    {usuario?.nome_nivel_acesso || "não definido"}
                                </span>
                            </td>
                            <td className={Style.colunaCenter}>
                                <div className={Style.divBtns}>
                                    <button ref={btnRef} onClick={() => {
                                        setModal(true);
                                        setIsEditar({
                                            ...usuario,
                                            nivel_acesso_idnivel_acesso: usuario.nivel_acesso_idnivel_acesso
                                        });
                                    }}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <button onClick={() => {
                                        alertExclusao(usuario.idusuarios);
                                    }}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Modal de Editar */}
            {modal && (
                <div className={Style.modalOverlay}>
                    <div className={Style.modal} ref={menuRef}>
                        <div className={Style.divTituloModal}>
                            <h1>
                                Editar Usuário
                            </h1>
                            <i className="fa-solid fa-xmark"
                                onClick={() => { setModal(false) }}
                            ></i>
                        </div>
                        <form className={Style.formModal} onSubmit={(e) => {
                            e.preventDefault();
                            salvarUsuario();
                        }}>
                            <div className={Style.divInput}>
                                <label>Nível de acesso</label>
                                <div className={Style.divDropdown}>
                                    <Dropdown appendTo="self" value={isEditar?.nivel_acesso_idnivel_acesso}
                                        onChange={(e) => {
                                            setIsEditar({
                                                ...isEditar,
                                                nivel_acesso_idnivel_acesso: e.value
                                            });
                                        }}
                                        options={niveisOptions}
                                        placeholder="Selecione um Nível"
                                        className={Style.input}
                                    />
                                </div>
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
                                        }}
                                        options={instituicaoOptions}
                                        placeholder="Selecione uma Instituição"
                                        className={Style.input}
                                    />
                                </div>
                            </div>
                        </form>
                        <div className={Style.modalFooter}>
                            <button onClick={() => setModal(false)}>
                                Cancelar
                            </button>
                            <button className={Style.btnCriar} onClick={salvarUsuario}>
                                Atualizar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}