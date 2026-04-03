import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./tabelas.module.css";

// Import de Componentes
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";

const API_BASE_URL = "/api-user";

export default function CompCategoria() {
    const [modal, setModal] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [busca, setBusca] = useState("");

    // filtro por texto
    const categoriasFiltradas = categorias.filter(categoria => 
        categoria.nome?.toLowerCase().includes(busca.toLowerCase())
    );

    useEffect(() => {
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
        carregarDados();
    }, []);

    return (
        <div className={Style.containerTabela}>
            <div className={Style.tituloTabela}>
                <h1>Gerenciar Categorias</h1>
                <button onClick={() => { setModal(!modal) }}>
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
                            className={Style.linhaTabela}
                        >
                            <td>
                                {categoria.nome}
                            </td>
                            <td className={Style.colunaCenter}>
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