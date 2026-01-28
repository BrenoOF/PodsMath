import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "./configuracoes.module.css";

// Import de Componentes
import FormPerfil from "./formularios/Perfil.jsx";
import FormSeguranca from "./formularios/Seguranca.jsx";
import FormConta from "./formularios/Conta.jsx";

export default function TelaConfiguracoes() {
    const [controle, setControle] = useState("perfil");
    const [errors, setErrors] = useState({});

    const [dadosUser, setDadosUser] = useState(null);

    const limparErro = (campo) => {
        setErrors((prev) => ({ ...prev, [campo]: null }));
    };

    // Buscar dados do Usuário
    useEffect(() => {
        const carregarUsuario = async () => {
            try {
                const usuarioId = Number(localStorage.getItem("usuarioId"));
                if (!usuarioId) return;

                const response = await axios.get("/users.json");
                const usuarios = response.data;

                const usuarioEncontrado = usuarios.find((u)=>u.id === usuarioId);

                if(usuarioEncontrado){
                    setDadosUser(usuarioEncontrado);
                }
            } catch (error) {
                console.error("Erro ao carregar dados do Usuário", error);
            }
        }

        carregarUsuario();
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
                    <div className={`
                        ${Style.opcoesMenuTop}
                        ${controle === "conta" ? Style.opcaoSelecionada : ""}
                    `}
                        onClick={() => { setControle("conta") }}
                    >
                        <i className="fa-solid fa-circle-info"></i>
                        <p>Conta</p>
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
                            errors={errors}
                            setErrors={setErrors}
                            limparErro={limparErro}
                        />
                    )}
                    {controle === "conta" && (
                        <FormConta dadosUser={dadosUser} />
                    )}
                </div>
            </div>
        </div>
    )
}