import React, { useState, useEffect } from "react";

import Style from "./configuracoes.module.css";

// Import de Componentes
import FormPerfil from "./formularios/Perfil.jsx";
import FormSeguranca from "./formularios/Seguranca.jsx";

export default function TelaConfiguracoes() {
    const [controle, setControle] = useState("perfil");
    const [errors, setErrors] = useState({});

    const [dadosUser, setDadosUser] = useState(null);

    const limparErro = (campo) => {
        setErrors((prev) => ({ ...prev, [campo]: null }));
    };

    // Buscar dados do Usuário
    useEffect(() => {
        const buscarDadosUsuario = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const response = await fetch("/api-user/usuarios/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setDadosUser(data);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
            }
        };
        buscarDadosUsuario();
    }, []);

    return (
        <div className={Style.containerConfig}>
            <div className={Style.divConfig}>
                {/* Título */}
                <div className={Style.divTituloTop}>
                    <h1>Configurações</h1>
                    <p>Gerencie suas informações pessoais e preferências</p>
                </div>
                {/* Menu */}
                <div className={Style.menuTop}>
                    <div className={`
                        ${Style.opcoesMenuTop}
                        ${controle === "perfil" ? Style.opcaoSelecionada : ""}
                    `}
                        onClick={() => { setControle("perfil") }}
                    >
                        <i className="fa-solid fa-user"></i>
                        <p>Perfil</p>
                    </div>
                    <div className={`
                        ${Style.opcoesMenuTop}
                        ${controle === "seguranca" ? Style.opcaoSelecionada : ""}
                    `}
                        onClick={() => { setControle("seguranca") }}
                    >
                        <i className="fa-solid fa-lock"></i>
                        <p>Segurança</p>
                    </div>
                </div>
                {/* Formulário / Informações */}
                <div className={Style.divForm}>
                    {controle === "perfil" && (
                        <FormPerfil
                            dadosUser={dadosUser}
                            errors={errors}
                            setErrors={setErrors}
                            limparErro={limparErro}
                        />
                    )}
                    {controle === "seguranca" && (
                        <FormSeguranca
                            dadosUser={dadosUser}
                            errors={errors}
                            setErrors={setErrors}
                            limparErro={limparErro}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}