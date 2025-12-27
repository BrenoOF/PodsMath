import React from "react";
import { BrowserRouter as Routers, Routes, Route } from "react-router-dom"

// Import Telas
import Home from "./components/home/Home";
import Login from "./components/login/Login";

export default function App() {
    return (
        <Routers>
            <Routes>
                {/* Rotas Padrões */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Routers>
    );
}