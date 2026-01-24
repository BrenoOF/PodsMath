import React from "react";
import { BrowserRouter as Routers, Routes, Route } from "react-router-dom"

// Import Telas
import Login from "./components/login/Login";
import MainLayout from "./components/layout/main-layout/MainLayout";
import Home from "./components/home/Home";
import Explorar from "./components/explorar/Explorar";
import Sobre from "./components/sobre-projeto/SobreProjeto";
import Configuracoes from "./components/configuracoes/Configuracoes";

export default function App() {
    return (
        <Routers>
            <Routes>
                {/* Rotas SEM layout */}
                <Route path="/login" element={<Login />} />
                {/* Rotas com Layout fixo */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/sobre-o-projeto" element={<Sobre />} />

                    <Route path="/explorar" element={<Explorar />} />
                    <Route path="/historico" element={<h1>Tela Para Histórico será Construida</h1>} />
                    <Route path="/favoritos" element={<h1>Tela Para Favoritos será Construida</h1>} />
                    <Route path="/configuracoes" element={<Configuracoes />} />
                </Route>
            </Routes>
        </Routers>
    );
}