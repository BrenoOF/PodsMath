import React, { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";

import Style from "./login.module.css";

// Import de Componentes
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';

// Import de Imagens
import LogoLight from "../../imgs/Logo1.png";
import LogoDark from "../../imgs/Logo2.png";

export default function TelaNovaSenha() {
    const navigate = useNavigate();

    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [errors, setErrors] = useState({});

    // Validações
    const limparErro = (campo) => {
        setErrors((prev) => ({ ...prev, [campo]: null }));
    };

    const validarSenha = () => {
        let novosErros = {};

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
        if (!validarSenha()) return;
        
        // Função para trocar senha
        alert("Form enviado");
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
                <p className={Style.textoLogin} style={{ marginBottom: "2rem" }}>
                    Aprenda matemática de forma envolvente através de podcasts
                </p>
                <form className={Style.containerForm} onSubmit={enviarForms}>
                    <div className={Style.divTituloLogin}>
                        <h1>Trocar a Senha</h1>
                        <p>Continue sua jornada de aprendizado</p>
                    </div>
                    <div>
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
                    <button type="submit" className={Style.btns + " " + Style.btnEntrar}>
                        <p>Trocar Senha</p>
                    </button>
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