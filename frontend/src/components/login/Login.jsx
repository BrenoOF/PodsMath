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
                    <div className={Style.btns+" "+Style.btnEntrar}>
                        <p>Entrar</p>
                    </div>
                    <div className={Style.ouContinue}>
                        <span>OU CONTINUE COM</span>
                    </div>
                    <div className={Style.btns+" "+Style.btnEntrarGoogle}>
                        <i className="fa-brands fa-google" style={{ fontSize: "0.875rem", color: "#0F172A", marginRight: "0.8rem" }}></i>
                        <p>Entrar com Google</p>
                    </div>
                </div>
            </div>
            <div className={Style.containerTexto}>
                <h1>Transforme sua relação com a matemática</h1>
                <h3>
                    Episódios cuidadosamente produzidos para tornar a matemática acessível e fascinante
                </h3>
                <div>
                    <div>
                        <i></i>
                    </div>
                    <div>
                        <p>Aprenda no seu ritmo</p>
                        <p>
                            Ouça quando e onde quiser, no trajeto, em casa ou na academia
                        </p>
                    </div>
                </div>
                <div>
                    <div>
                        <i></i>
                    </div>
                    <div>
                        <p>Conteúdo especializado</p>
                        <p>
                            Professores renomados explicam conceitos complexos de forma simples
                        </p>
                    </div>
                </div>
                <div>
                    <div>
                        <i></i>
                    </div>
                    <div>
                        <p>100% gratuito</p>
                        <p>
                            Acesso completo a todos os episódios sem custo algum
                        </p>
                    </div>
                </div>
                <hr />
                <p>"A matemática é a linguagem com a qual Deus escreveu o universo. Junte-se a nós nessa jornada de descoberta."</p>
            </div>
        </div>
    );
}