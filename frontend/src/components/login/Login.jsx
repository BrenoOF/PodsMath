import React, { useState } from "react";

import Style from "./login.module.css";

// Import de Componentes
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

export default function TelaLogin() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    return (
        <div className={Style.container}>
            <div className={Style.containerLogin}>
                <img src={require("../../imgs/Logo1.png")} alt="Podsmath Logo"
                    className={Style.imgLogo} />
                <p className={Style.textoLogin}>Aprenda matemática de forma envolvente através de podcasts</p>
                <div className={Style.divMudarForm}>
                    <p>Entrar</p>
                    <p>Criar Conta</p>
                </div>
                <div className={Style.containerForm}>
                    <div className={Style.divTituloLogin}>
                        <h1>Faça login</h1>
                        <p>Continue sua jornada de aprendizado</p>
                    </div>
                    <div className={Style.divInput}>
                        <label>Email</label>
                        <InputText keyfilter="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className={Style.input} placeholder="seu@email.com" />
                    </div>
                    <div className={Style.divInput}>
                        <label>Senha</label>
                        <Password value={senha} onChange={(e) => setSenha(e.target.value)}
                            toggleMask feedback={false} inputClassName={Style.input}
                            placeholder="••••••••" />
                    </div>
                    <div className={Style.btns + " " + Style.btnEntrar}>
                        <p>Entrar</p>
                    </div>
                    <div className={Style.ouContinue}>
                        <span>OU CONTINUE COM</span>
                    </div>
                    <div className={Style.btns + " " + Style.btnEntrarGoogle}>
                        <i className="fa-brands fa-google" style={{ fontSize: "0.875rem", color: "#0F172A", marginRight: "0.8rem" }}></i>
                        <p>Entrar com Google</p>
                    </div>
                </div>
            </div>
            <div className={Style.containerTexto}>
                <h1 className={Style.tituloTexto}>Matemática <span>em Áudio</span></h1>
                <h3 className={Style.subTituloTexto}>
                    Episódios cuidadosamente produzidos para tornar a<br />matemática acessível e fascinante
                </h3>
                <div className={Style.blocoTexto}>
                    <div className={Style.divIcon}>
                        <i className="fa-regular fa-headphones" style={{ fontSize: "1.5rem", color: "#FF851A" }}></i>
                    </div>
                    <div className={Style.divMensagem}>
                        <p>Aprenda no seu ritmo</p>
                        <span>
                            Ouça quando e onde quiser, no trajeto, em casa ou na<br />academia
                        </span>
                    </div>
                </div>
                <div className={Style.blocoTexto}>
                    <div className={Style.divIcon}>
                        <i class="fa-solid fa-book-open" style={{ fontSize: "1.5rem", color: "#FF851A" }}></i>
                    </div>
                    <div className={Style.divMensagem}>
                        <p>Conteúdo especializado</p>
                        <span>
                            Professores renomados explicam conceitos complexos de<br />forma simples
                        </span>
                    </div>
                </div>
                <div className={Style.blocoTexto}>
                    <div className={Style.divIcon}>
                        <i class="fa-regular fa-circle-check" style={{ fontSize: "1.5rem", color: "#FF851A" }}></i>
                    </div>
                    <div className={Style.divMensagem}>
                        <p>100% gratuito</p>
                        <span>
                            Acesso completo a todos os episódios sem custo algum
                        </span>
                    </div>
                </div>
                <div className={Style.ultimaMensagem}>
                    <hr />
                    <p>
                        "A matemática é a linguagem com a qual Deus escreveu o universo. Junte-se a nós
                        nessa jornada de descoberta."
                    </p>
                </div>
            </div>
        </div>
    );
}