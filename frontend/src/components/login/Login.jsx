import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import Style from "./login.module.css";

// Import de Componentes
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';

import BtnEsqueciSenha from "../btn-esqueci-senha/EsqueciSenha";

// Import de Imagens
import LogoLight from "../../imgs/Logo1.png";
import LogoDark from "../../imgs/Logo2.png";

export default function TelaLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [trocar, setTrocar] = useState(() => {
        return location.state?.mode === "cadastro" ? false : true;
    });

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [errors, setErrors] = useState({});

    const trocarForm = (valor) => {
        setTrocar(valor);
        setErrors({});

        if (valor) {
            // indo para login
            setSenha("");
        }
    };

    // Validações
    const validarEmail = (value) => {
        if (!value || !value.trim()) {
            return "Email é Obrigatório";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value ?? "").trim())) {
            return "Email inválido";
        }

        return null;
    }

    const limparErro = (campo) => {
        setErrors((prev) => ({ ...prev, [campo]: null }));
    };

    const validarLogin = () => {
        let novosErros = {};

        const erroEmail = validarEmail(email);
        if (erroEmail) {
            novosErros.email = erroEmail;
        }

        if (!senha) {
            novosErros.senha = "Senha é obrigatória";
        }

        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const validarEmailEsqueciSenha = async () => {
        const erroEmail = validarEmail(email);

        if (erroEmail) {
            setErrors(prev => ({
                ...prev,
                email: erroEmail
            }));

            return false;
        }
        return true;
    };

    const validarCadastro = () => {
        let novosErros = {};

        if (!nome.trim()) novosErros.nome = "Nome é obrigatório";

        const erroEmail = validarEmail(email);
        if (erroEmail) {
            novosErros.email = erroEmail;
        }

        if (!senha || senha.length < 6)
            novosErros.senha = "Senha deve ter no mínimo 6 caracteres";

        if (senha !== confirmarSenha)
            novosErros.confirmarSenha = "As senhas não coincidem";

        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    // Parte de Ligar Frontend com o Backend
    const enviarForms = async (e) => {
        e.preventDefault();

        if (trocar) {
            if (!validarLogin()) return;

            await logar();
        } else {
            if (!validarCadastro()) return;

            await cadastrar();
        }
    };

    const logar = async () => {
        try {
            const response = await axios.post("/api-user/auth/login", {
                email: email,
                senha: senha
            });

            const { token } = response.data;

            localStorage.setItem("token", token);

            setErrors({});
            navigate("/");
        } catch (error) {
            if (error.response) {
                setErrors((prev) => ({
                    ...prev,
                    login: "Email ou senha inválidos"
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    login: "Erro interno. Tente novamente."
                }));
            }
        }
    };

    const cadastrar = async () => {
        try {
            const response = await axios.post("/api-user/auth/register", {
                nome: nome,
                email: email,
                senha: senha
            });

            const { token } = response.data;

            localStorage.setItem("token", token);

            setErrors({});
            navigate("/");
        } catch (error) {
            if (error.response) {
                setErrors((prev) => ({
                    ...prev,
                    cadastro: error.response.data.message || "Erro ao cadastrar"
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    cadastro: "Erro ao conectar com o servidor"
                }));
            }
        }
    };

    // Troca de Logo caso o usuario esteja no modo dark
    const trocarLogo = () => {
        return localStorage.getItem("theme-mode") === "dark" ? LogoDark : LogoLight;
    }

    return (
        <div className={Style.container}>
            <div className={Style.containerLogin}>
                <img src={trocarLogo()} alt="Podsmath Logo"
                    className={Style.imgLogo} onClick={() => { navigate("/") }}
                    draggable="false"
                />
                <p className={Style.textoLogin}>Aprenda matemática de forma envolvente através de podcasts</p>
                <div className={Style.divMudarForm}>
                    <p onClick={(e) => { trocarForm(true) }}
                        style={{ color: trocar ? "" : "#64748b" }}
                    >
                        Entrar
                    </p>
                    <p onClick={(e) => { trocarForm(false) }}
                        style={{ color: trocar ? "#64748b" : "" }}
                    >
                        Criar Conta
                    </p>
                </div>
                <form className={Style.containerForm} onSubmit={enviarForms}>
                    <div className={Style.divTituloLogin}>
                        <h1>{trocar ? "Faça login" : "Crie sua conta"}</h1>
                        <p>
                            {trocar ?
                                "Continue sua jornada de aprendizado"
                                :
                                "Comece a explorar o mundo da matemática hoje"
                            }
                        </p>
                    </div>
                    {trocar ? (
                        <>
                            <div className={Style.divInput}>
                                <label>Email</label>
                                <InputText value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        limparErro("email");
                                        limparErro("login");
                                    }}
                                    className={`${Style.input} ${errors.email ? "p-invalid" : ""}`}
                                    placeholder="seu@email.com" />
                                {errors.email && (
                                    <Message severity="error" text={errors.email} />
                                )}
                            </div>
                            <div className={Style.divInput}>
                                <label>Senha</label>
                                <Password value={senha}
                                    onChange={(e) => {
                                        setSenha(e.target.value);
                                        limparErro("senha");
                                        limparErro("login");
                                    }}
                                    toggleMask feedback={false}
                                    inputClassName={`${Style.input} ${errors.senha ? "p-invalid" : ""}`}
                                    placeholder="••••••••"
                                />
                                {errors.senha && (
                                    <Message severity="error" text={errors.senha} />
                                )}
                            </div>
                            {errors.login && (
                                <Message severity="error" text={errors.login} />
                            )}
                        </>
                    ) : (
                        <>
                            <div className={Style.divInput}>
                                <label>Nome Completo</label>
                                <InputText value={nome}
                                    onChange={(e) => {
                                        setNome(e.target.value);
                                        limparErro("nome");
                                    }}
                                    className={`${Style.input} ${errors.nome ? "p-invalid" : ""}`}
                                    placeholder="Maria Silva"
                                />
                                {errors.nome && (
                                    <Message severity="error" text={errors.nome} />
                                )}
                            </div>
                            <div className={Style.divInput}>
                                <label>Email</label>
                                <InputText value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        limparErro("email");
                                    }}
                                    className={`${Style.input} ${errors.email ? "p-invalid" : ""}`}
                                    placeholder="seu@email.com"
                                />
                                {errors.email && (
                                    <Message severity="error" text={errors.email} />
                                )}
                            </div>
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
                        </>
                    )}
                    <button
                        type="submit" className={Style.btns + " " + Style.btnEntrar}
                    >
                        <p>{trocar ? "Entrar" : "Criar conta grátis"}</p>
                    </button>
                    {trocar && (
                        <BtnEsqueciSenha tipo="visitante" dadosUser={email} onEsqueciSenha={validarEmailEsqueciSenha} />
                    )}
                </form>
            </div>
            {/* Parte da Direita da Tela */}
            <div className={Style.containerTexto}>
                <div className={Style.divTexto}>
                    <h1 className={Style.tituloTexto}>Matemática <span>em Áudio</span></h1>
                    <h3 className={Style.subTituloTexto}>
                        Episódios cuidadosamente produzidos para tornar a matemática acessível e fascinante
                    </h3>
                    <div className={Style.blocoTexto}>
                        <div className={Style.divIcon}>
                            <i className="fa-regular fa-headphones" style={{ fontSize: "1.5rem" }}></i>
                        </div>
                        <div className={Style.divMensagem}>
                            <p>Aprenda no seu ritmo</p>
                            <span>
                                Ouça quando e onde quiser, no trajeto, em casa ou na academia
                            </span>
                        </div>
                    </div>
                    <div className={Style.blocoTexto}>
                        <div className={Style.divIcon}>
                            <i className="fa-solid fa-book-open" style={{ fontSize: "1.5rem" }}></i>
                        </div>
                        <div className={Style.divMensagem}>
                            <p>Conteúdo especializado</p>
                            <span>
                                Professores renomados explicam conceitos complexos de forma simples
                            </span>
                        </div>
                    </div>
                    <div className={Style.blocoTexto}>
                        <div className={Style.divIcon}>
                            <i className="fa-regular fa-circle-check" style={{ fontSize: "1.5rem" }}></i>
                        </div>
                        <div className={Style.divMensagem}>
                            <p>100% gratuito</p>
                            <span>
                                Acesso completo a todos os episódios sem custo algum
                            </span>
                        </div>
                    </div>
                    <hr />
                    <div className={Style.ultimaMensagem}>
                        <p>
                            "A matemática é a linguagem com a qual Deus escreveu o universo. Junte-se a nós
                            nessa jornada de descoberta."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}