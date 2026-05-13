import React from "react";
import { BrowserRouter as Routers, Routes, Route } from "react-router-dom"

// Import Telas
import Login from "./components/login/Login";
import NovaSenha from "./components/login/NovaSenha";

import MainLayout from "./components/layout/main-layout/MainLayout";

import Home from "./components/home/Home";
import Sobre from "./components/sobre-projeto/SobreProjeto";

import Configuracoes from "./components/configuracoes/Configuracoes";
import Favoritos from "./components/favoritos/Favoritos";
import Historico from "./components/historico/Historico";

import Explorar from "./components/explorar/Explorar";
import Temas from "./components/tema/Tema";
import Playlist from "./components/playlist/Playlist";
import Player from "./components/player/Player";

import Admin from "./components/admin/Admin";

export default function App() {
    return (
        <Routers>
            <Routes>
                {/* Rotas SEM layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/novaSenha" element={<NovaSenha />} />

                {/* Rotas com Layout fixo */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/sobre-o-projeto" element={<Sobre />} />

                    <Route path="/perfil" element={<Configuracoes />} />
                    <Route path="/favoritos" element={<Favoritos />} />
                    <Route path="/historico" element={<Historico />} />

                    <Route path="/explorar" element={<Explorar />} />
                    <Route path="/explorar/:idTema" element={<Temas />} />
                    <Route path="/explorar/:idTema/:playlistTema" element={<Playlist />} />
                    <Route path="/explorar/:idTema/:playlistTema/:idPodcast" element={<Player />} />
                    
                    <Route path="/admin" element={<Admin />} />
                </Route>
            </Routes>
        </Routers>
    );
}