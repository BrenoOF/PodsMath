import React, { useState } from "react";
import Swal from 'sweetalert2';

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
        } else if (senhaAtual !== dadosUser?.senha) {
            novosErros.senhaAtual = "Senha atual incorreta";
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

    const salvarSenha = () => {

        if (!validarSenha()) return;

        Swal.fire({
            title: "Senha Alterada com Sucesso",
            icon: "success",
        });

        setSenhaAtual("");
        setSenhaNova("");
        setConfirmarSenha("");
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