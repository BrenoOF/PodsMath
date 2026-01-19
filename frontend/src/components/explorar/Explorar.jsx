import React, { useState } from "react";

import Style from "./explorar.module.css";

// Import de Componentes

export default function TelaExplorar() {
    const [dadosSimulados] = useState([
        {
            id: 1,
            titulo: "Álgebra",
            subTitulo: "Explore equações, fumções e estruturas algébricas",
            icon: "calculator",
            bg: "#a855f7, #ec4899"
        },
        {
            id: 2,
            titulo: "Geometria",
            subTitulo: "Formas, espaços e suas propriedades",
            icon: "shapes",
            bg: "#3b82f6, #06b6d4"
        },
        {
            id: 3,
            titulo: "Estatística",
            subTitulo: "Análise de dados e probalidade",
            icon: "chart-pie",
            bg: "#22c55e, #10b981"
        },
        {
            id: 4,
            titulo: "Cálculo",
            subTitulo: "Derivados, integrais e análise matemática",
            icon: "arrow-trend-up",
            bg: "#f97316, #ef4444"
        },
        {
            id: 5,
            titulo: "Trigonometria",
            subTitulo: "Relações entre ângulo e lados",
            icon: "ruler",
            bg: "#6366f1, #a855f7"
        },
        {
            id: 6,
            titulo: "Matemática Financeira",
            subTitulo: "Juros, investimentos e análise financeira",
            icon: "money-bill-wave",
            bg: "#eab308, #f97316"
        }
    ]);

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
                {dadosSimulados.map(item => (
                    <div key={item.id} className={Style.card}>
                        <div 
                            className={Style.icon} 
                            style={{ background: `linear-gradient(135deg,${item.bg})` || "transparent" }}
                        >
                            <i className={`fa-solid fa-${item.icon}`}></i>
                        </div>
                        <div className={Style.tituloCard}>
                            <h1>
                                {item.titulo}
                            </h1>
                            <p>
                                {item.subTitulo}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}