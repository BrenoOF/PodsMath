import React, { useState } from "react";
import Swal from 'sweetalert2';
import axios from "axios";

import Style from "../configuracoes.module.css";

// Import de Componentes
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';

import BtnEsqueciSenha from "../../btn-esqueci-senha/EsqueciSenha";

export default function CompSeguranca({ dadosUser, errors, setErrors, limparErro }) {
    // Funções para a Parte de Segurança
    const [senhaAtual, setSenhaAtual] = useState("");
    const [senhaNova, setSenhaNova] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const validarSenha = () => {
        let novosErros = {};

        // senha atual
        if (!senhaAtual) {
            novosErros.senhaAtual = "Digite sua senha atual";
        }

        // nova senha
        if (!senhaNova) {
            novosErros.senhaNova = "Digite a nova senha";
        } else if (senhaNova.length < 6) {
            novosErros.senhaNova = "Senha deve ter no mínimo 6 caracteres";
        } else if (senhaNova === senhaAtual) {
            novosErros.senhaNova = "A nova senha deve ser diferente da atual";
        }

        // confirmar senha
        if (!confirmarSenha) {
            novosErros.confirmarSenha = "Confirme a nova senha";
        } else if (senhaNova !== confirmarSenha) {
            novosErros.confirmarSenha = "As senhas não coincidem";
        }


        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const salvarSenha = async () => {

        if (!validarSenha()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                title: "Erro de Autenticação",
                text: "Você precisa estar logado para alterar a senha",
                icon: "error",
            });
            return;
        }

        try {
            const response = await axios.put("/api-user/usuarios/me/senha", {
                senhaAtual,
                senhaNova
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire({
                title: response.data.message || "Senha Alterada com Sucesso",
                icon: "success",
            });

            setSenhaAtual("");
            setSenhaNova("");
            setConfirmarSenha("");
        } catch (error) {
            if (error.response) {
                // Erro do servidor (ex: senha atual incorreta)
                setErrors((prev) => ({ 
                    ...prev, 
                    senhaAtual: error.response.data.message.includes("atual") ? error.response.data.message : null 
                }));
                
                Swal.fire({
                    title: "Erro ao Alterar Senha",
                    text: error.response.data.message,
                    icon: "error",
                });
            } else {
                console.error("Erro de Conexão", error);
                Swal.fire({
                    title: "Erro de Conexão",
                    text: "Não foi possível conectar ao servidor",
                    icon: "error",
                });
            }
        }
    };

    return (
        <div>
            <div className={Style.divTituloForm}>
                <h1>Alterar Senha</h1>
                <p>Mantenha sua conta segura com uma senha forte</p>
            </div>
            <div className={Style.divInputs}>
                <div className={Style.divInput}>
                    <label>Senha Atual</label>
                    <Password value={senhaAtual}
                        onChange={(e) => {
                            setSenhaAtual(e.target.value);
                            limparErro("senhaAtual");
                        }}
                        toggleMask feedback={false}
                        inputClassName={`${Style.input} ${errors.senhaAtual ? "p-invalid" : ""}`}
                        placeholder="••••••••"
                    />
                    {errors?.senhaAtual && (
                        <Message severity="error" text={errors.senhaAtual} />
                    )}
                </div>
                <div className={Style.divInput}>
                    <label>Nova Senha</label>
                    <Password value={senhaNova}
                        onChange={(e) => {
                            setSenhaNova(e.target.value);
                            limparErro("senhaNova");
                        }}
                        toggleMask feedback={false}
                        inputClassName={`${Style.input} ${errors.senhaNova ? "p-invalid" : ""}`}
                        placeholder="••••••••"
                    />
                    {errors?.senhaNova && (
                        <Message severity="error" text={errors.senhaNova} />
                    )}
                </div>
                <div className={Style.divInput}>
                    <label>Confirmar Nova Senha</label>
                    <Password value={confirmarSenha}
                        onChange={(e) => {
                            setConfirmarSenha(e.target.value);
                            limparErro("confirmarSenha");
                        }}
                        toggleMask feedback={false}
                        inputClassName={`${Style.input} ${errors.confirmarSenha ? "p-invalid" : ""}`}
                        placeholder="••••••••"
                    />
                    {errors?.confirmarSenha && (
                        <Message severity="error" text={errors.confirmarSenha} />
                    )}
                </div>
            </div>
            <div className={Style.btnEnviarForm} onClick={() => { salvarSenha() }}>
                <p>Alterar Senha</p>
            </div>
            <BtnEsqueciSenha tipo="logado" dadosUser={dadosUser?.email || ""} />
        </div>
    );
}