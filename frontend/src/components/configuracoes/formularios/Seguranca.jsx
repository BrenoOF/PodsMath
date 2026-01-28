import React, { useState } from "react";

import Style from "../configuracoes.module.css";

// Import de Componentes
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';

export default function CompSeguranca({ errors, setErrors, limparErro }) {
    // Funções para a Parte de Segurança
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const validarSenha = () => {
        let novosErros = {};

        if (!senha || senha.length < 6) {
            novosErros.senha = "Senha deve ter no mínimo 6 caracteres";
        }

        if (senha !== confirmarSenha) {
            novosErros.confirmarSenha = "As senhas não coincidem";
        }

        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const salvarSenha = () => {
        if (!validarSenha()) return;

        // aqui depois entra API / backend
        alert(`Senha válida, pode salvar: ${senha}`);
    };

    return (
        <div>
            <div className={Style.divTituloForm}>
                <h1>Alterar Senha</h1>
                <p>Mantenha sua conta segura com uma senha forte</p>
            </div>
            <div className={Style.divInputs}>
                <div className={Style.divInput}>
                    <label>Senha</label>
                    <Password value={senha}
                        onChange={(e) => {
                            setSenha(e.target.value);
                            limparErro("senha");
                        }}
                        toggleMask feedback={false}
                        inputClassName={`${Style.input} ${errors.senha ? "p-invalid" : ""}`}
                        placeholder="••••••••"
                    />
                    {errors?.senha && (
                        <Message severity="error" text={errors.senha} />
                    )}
                </div>
                <div className={Style.divInput}>
                    <label>Confirmar senha</label>
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
        </div>
    );
}