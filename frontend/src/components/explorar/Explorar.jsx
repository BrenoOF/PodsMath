import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Style from "./explorar.module.css";

const API_BASE_URL = "http://localhost:3001";

export default function TelaExplorar() {
    const navigate = useNavigate();
    const [dadosExplorar, setDadosExplorar] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${API_BASE_URL}/categorias`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDadosExplorar(response.data);
            } catch (error) {
                console.error("Erro ao carregar dados", error);
            }
        }
        carregarDados();
    }, []);

    // Mapeamento de cores e ícones (visto que o banco pode não ter esses dados visuais)
    const getVisuals = (index) => {
        const visuals = [
            { icon: "calculator", bg: "#a855f7, #ec4899" },
            { icon: "shapes", bg: "#3b82f6, #06b6d4" },
            { icon: "chart-pie", bg: "#22c55e, #10b981" },
            { icon: "arrow-trend-up", bg: "#f97316, #ef4444" },
            { icon: "ruler", bg: "#6366f1, #a855f7" },
            { icon: "money-bill-wave", bg: "#eab308, #f97316" }
        ];
        return visuals[index % visuals.length];
    };

    return (
        <div className={Style.containerExplorar}>
            <div className={Style.divTituloTopo}>
                <h1>
                    Explorar Categorias
                </h1>
                <p>
                    Descubra podcasts organizados por temas matemáticos
                </p>
            </div>
            <div className={Style.divCards}>
                {dadosExplorar.map((item, index) => {
                    const visual = getVisuals(index);
                    return (
                        <div key={item.idcategorias} className={Style.card}
                            onClick={() => {
                                navigate(`/explorar/${item.idcategorias}`);
                            }}
                        >
                            <div
                                className={Style.icon}
                                style={{ background: `linear-gradient(135deg,${visual.bg})` }}
                            >
                                <i className={`fa-solid fa-${visual.icon}`}></i>
                            </div>
                            <div className={Style.tituloCard}>
                                <h1>{item.nome}</h1>
                                <p>Explore podcasts de {item.nome}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}