import React from "react";
import { BrowserRouter as Routers, Routes, Route } from "react-router-dom"

// Import Telas
import Login from "./components/login/Login";

export default function App() {
    return (
        <Routers>
            <Routes>
                {/* Rotas Padrões */}
                <Route path="/" element={<Login />} />
            </Routes>
        </Routers>
    );
}