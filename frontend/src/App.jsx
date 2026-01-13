import React from "react";
import { BrowserRouter as Routers, Routes, Route } from "react-router-dom"

// Import Telas
import MainLayout from "./components/layout/main-layout/MainLayout";
import Home from "./components/home/Home";
import Login from "./components/login/Login";

export default function App() {
    return (
        <Routers>
            <Routes>
                {/* Rotas SEM layout */}
                <Route path="/login" element={<Login />} />
                {/* Rotas com Layout fixo */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/explorar" element={<h1>Olá Mundo</h1>} />
                </Route>
            </Routes>
        </Routers>
    );
}