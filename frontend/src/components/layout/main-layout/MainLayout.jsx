import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Style from "./mainLayout.module.css";

// Import dos Componentes
import TopBar from "../top-bar/TopBar";
import SlideBar from "../slide-bar/SlideBar";

export default function TelaLayout() {
    const [slidebarAberta, setSlidebarAberta] = useState(true);
    const [mostrarBtnTopo, setMostrarBtnTopo] = useState(false);
    const mainRef = useRef(null);

    const { pathname } = useLocation();

    const partesUrl = pathname.split("/").filter(Boolean);
    const estaNaPaginaPlayer = partesUrl[0] === "explorar" && partesUrl.length === 4;

    // Função que leva o scroll para o topo
    const voltarAoTopo = () => {
        mainRef.current.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Seta como padrão o scroll no topo quando muda de tela
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo({
                top: 0,
                behavior: "auto"
            });
        }
    }, [pathname]);

    // Controle do Btn para aparecer dps que abaixar um pouco a tela
    useEffect(() => {
        const elemento = mainRef.current;
        if (!elemento) return;
        const handleScroll = () => {
            setMostrarBtnTopo(elemento.scrollTop > 200);
        };
        elemento.addEventListener("scroll", handleScroll);
        return () => elemento.removeEventListener("scroll", handleScroll);
    });

    return (
        <div className={Style.container}>
            {/* Sidebar à esquerda */}
            <SlideBar aberta={slidebarAberta} setAberta={setSlidebarAberta} />
            {/* Topo fixo */}
            <TopBar slidebarAberta={slidebarAberta} />
            {/* Conteúdo dinâmico */}
            <main className={`${Style.main} ${slidebarAberta ? Style.aberta : Style.fechada}`}>
                <div ref={mainRef} className={Style.scrollArea}>
                    <Outlet />
                </div>
            </main>
            {mostrarBtnTopo && !estaNaPaginaPlayer && (
                <div
                    className={Style.btnVoltarTopo}
                    onClick={() => voltarAoTopo()}
                >
                    <i className="fa-solid fa-angle-up"></i>
                </div>
            )}
        </div>
    );
}