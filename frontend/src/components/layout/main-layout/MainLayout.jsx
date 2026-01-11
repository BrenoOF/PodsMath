import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Style from "./mainLayout.module.css";

// Import dos Componentes
import TopBar from "../top-bar/TopBar";
import SlideBar from "../slide-bar/SlideBar";

export default function TelaLayout() {

    const [slidebarAberta, setSlidebarAberta] = useState(true);

    return (
        <div className={Style.container}>
            {/* Sidebar à esquerda */}
            <SlideBar aberta={slidebarAberta} setAberta={setSlidebarAberta} />
            {/* Topo fixo */}
            <TopBar slidebarAberta={slidebarAberta} />
            {/* Conteúdo dinâmico */}
            <main className={`${Style.main} ${slidebarAberta ? Style.aberta : Style.fechada}`}>
                <Outlet />
            </main>
        </div>
    );
}