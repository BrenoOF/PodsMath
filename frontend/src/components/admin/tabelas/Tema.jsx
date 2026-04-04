import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./tabelas.module.css";

// Import de Componentes
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from "primereact/inputtext";

const API_BASE_URL = "/api-user";

export default function CompTema() {
    const [modal, setModal] = useState(false);
    const [temas, setTemas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [busca, setBusca] = useState("");

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

    useEffect(() => {
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
                    if (cat.caminho_imagem) {
                        const nomeArquivo = cat.caminho_imagem.split('/').pop();
                        cat.caminho_imagem = `/api-user/imagens/file/${nomeArquivo}`;
                    }
                });

                setTemas(response.data);
                setCategorias(resCategorias.data);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        carregarDados();
    }, []);

    return (
        <div className={Style.containerTabela}>
            <div className={Style.tituloTabela}>
                <h1>Gerenciar Temas</h1>
                <button onClick={() => { setModal(!modal) }}>
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
                                <img src="./imgs/podcast-default.jpg" alt={tema.idtemas}
                                    className={Style.tableImg}
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