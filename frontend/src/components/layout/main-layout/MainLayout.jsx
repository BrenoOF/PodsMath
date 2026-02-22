import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Style from "./mainLayout.module.css";

// Import dos Componentes
import TopBar from "../top-bar/TopBar";
import SlideBar from "../slide-bar/SlideBar";

export default function TelaLayout() {
    const [slidebarAberta, setSlidebarAberta] = useState(true);
    const mainRef = useRef(null);

    const { pathname } = useLocation();

    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo({
                top: 0,
                behavior: "instant"
            });
        }
    }, [pathname]);

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
        </div>
    );
}