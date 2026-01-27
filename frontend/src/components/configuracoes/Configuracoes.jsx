import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

import Style from "./configuracoes.module.css";

// Import de Componentes
import FormPerfil from "./perfil/Perfil.jsx";
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';

export default function TelaConfiguracoes() {
    const navigate = useNavigate();
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

    // Funções para a Parte de Conta
    const excluirConta = () => {
        try {
            localStorage.removeItem("usuarioId");
            navigate("/");
        } catch (error) {
            console.error("Erro ao Realizar Excluir conta ", error);
        }
    }
    const alertExclusao = () => {
        Swal.fire({
            title: "Quer Realmente Excluir a Conta?",
            text: "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sim, Quero Excluir!",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#012663"
        }).then((result) => {
            if (result.isConfirmed) {
                excluirConta();
            }
        });
    }

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
                        <FormPerfil />
                    )}
                    {controle === "seguranca" && (
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
                                    {errors.senha && (
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
                                    {errors.confirmarSenha && (
                                        <Message severity="error" text={errors.confirmarSenha} />
                                    )}
                                </div>
                            </div>
                            <div className={Style.btnEnviarForm} onClick={() => { salvarSenha() }}>
                                <p>Alterar Senha</p>
                            </div>
                        </div>
                    )}
                    {controle === "conta" && (
                        <div>
                            <div className={Style.divTituloForm}>
                                <h1>Informações da Conta</h1>
                                <p>Detalhes sobre sua conta no PodsMath</p>
                            </div>
                            <div className={Style.divInformacoesConta}>
                                <div className={Style.divInformacao}>
                                    <h1>Email</h1>
                                    <p>{dadosUser?.email}</p>
                                </div>
                                <hr />
                                <div className={Style.divInformacao}>
                                    <h1>Nível de Acesso</h1>
                                    <p>{dadosUser?.nivelAcesso}</p>
                                </div>
                                <hr />
                                <div className={Style.divInformacao}>
                                    <h1>Membro desde</h1>
                                    <p>{dadosUser?.membroDesde}</p>
                                </div>
                                <hr />
                            </div>
                            <div className={Style.textosPerigo}>
                                <h1>Zona de Perigo</h1>
                                <p>Ações irreversíveis relacionadas à sua conta</p>
                            </div>
                            <div className={Style.btnExcluirConta} onClick={() => { alertExclusao() }}>
                                <p>Excluir Conta</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}