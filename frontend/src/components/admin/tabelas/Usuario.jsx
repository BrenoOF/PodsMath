import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import Style from "./tabelas.module.css";

// Import de Componentes
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";

const API_BASE_URL = "/api-user";

export default function CompUsuario() {
    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState("");

    const [menuConfigsAberto, setMenuConfigsAberto] = useState(false);
    const [nivelSelecionado, setNivelSelecionado] = useState("todos");

    const btnConfigsRef = useRef(null);
    const menuConfigsRef = useRef(null);

    const formatarData = (data) => {
        if (!data) return "-";
        return new Date(data).toLocaleDateString("pt-BR");
    }

    // Fazer o btn para filtrar por nivel de acesso
    const niveis = [
        { value: "todos", label: "Todos" },
        { value: "admin", label: "Admin" },
        { value: "editor", label: "Editor" },
        { value: "revisor", label: "Revisor" }
    ];

    const mudarNivel = (valor) => {
        setNivelSelecionado(valor);
        setMenuConfigsAberto(false);
    };

    // filtro por texto + nivel
    const usuariosFiltrados = usuarios.filter(usuario => {
        const matchBusca =
            usuario.nome?.toLowerCase().includes(busca.toLowerCase()) ||
            usuario.email?.toLowerCase().includes(busca.toLowerCase());

        const matchNivel =
            nivelSelecionado === "todos" ||
            usuario.nivel === nivelSelecionado;

        return matchBusca && matchNivel;
    });

    // buscar usuarios
    useEffect(() => {
        async function carregarUsuarios() {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(`${API_BASE_URL}/usuarios`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsuarios(res.data);
            } catch (erro) {
                console.error("erro ao buscar usuarios", erro);
            }
        }
        carregarUsuarios();
    }, []);

    // fechar menu ao clicar fora
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
                        <InputText placeholder="Buscar por Nome ou Email..." className={Style.input}
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
                    {niveis.find(n => n.value === nivelSelecionado)?.label}
                    <i className="fa-solid fa-angle-down"></i>
                </div>
                {/* menu */}
                {menuConfigsAberto && (
                    <div
                        ref={menuConfigsRef}
                        className={Style.menuConfigs}
                    >
                        {niveis.map((item) => (
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
                        <th>Nível</th>
                        <th>Cadastro</th>
                        <th className={Style.colAcoes}>
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {usuariosFiltrados.map(usuario => (
                        <tr
                            key={usuario.idusuarios}
                            className={Style.linhaTabela}
                        >
                            <td>
                                {usuario.nome}
                            </td>
                            <td className={Style.email}>
                                {usuario.email}
                            </td>
                            <td>
                                <span className={Style.badgeNivel}>
                                    {usuario.nivel || "não definido"}
                                </span>
                            </td>
                            <td>
                                {formatarData(usuario.dataCadastro)}
                            </td>
                            <td className={Style.colAcoes}>
                                <div className={Style.divBtns}>
                                    <button>
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
        </div>
    );
}