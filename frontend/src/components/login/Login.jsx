import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Style from "./login.module.css";

// Import de Componentes
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';

export default function TelaLogin() {
    const navigate = useNavigate();
    const [trocar, setTrocar] = useState(true);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [tipoPessoa, setTipoPessoa] = useState("");
    const [grau, setGrau] = useState("");
    const [ra, setRA] = useState("");
    const [escola, setEscola] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const graus = [
        { name: 'Fundamental I (1° ao 5° ano)', code: 'F1' },
        { name: 'Fundamental II (6° ao 9° ano)', code: 'F2' },
        { name: 'Ensino Médio', code: 'EM' },
        { name: 'Técnico', code: 'T' },
        { name: 'Ensino Superior', code: 'ES' },
        { name: 'Pós-graduação (Lato Sensu)', code: 'PG' },
        { name: 'Mestrado', code: 'M' },
        { name: 'Doutorado', code: 'D' },
        { name: 'Pós-Doutorado', code: 'PD' }
    ];

    return (
        <div className={Style.container}>
            <div className={Style.containerLogin}>
                <img src={require("../../imgs/Logo1.png")} alt="Podsmath Logo"
                    className={Style.imgLogo} onClick={() => { navigate("/") }} 
                    draggable="false" />
                <p className={Style.textoLogin}>Aprenda matemática de forma envolvente através de podcasts</p>
                <div className={Style.divMudarForm}>
                    <p onClick={(e) => { setTrocar(true) }}
                        style={{ color: trocar ? "" : "#64748b" }}
                    >
                        Entrar
                    </p>
                    <p onClick={(e) => { setTrocar(false) }}
                        style={{ color: trocar ? "#64748b" : "" }}
                    >
                        Criar Conta
                    </p>
                </div>
                <div className={Style.containerForm}>
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
                                <InputText keyfilter="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    className={Style.input} placeholder="seu@email.com" />
                            </div>
                            <div className={Style.divInput}>
                                <label>Senha</label>
                                <Password value={senha} onChange={(e) => setSenha(e.target.value)}
                                    toggleMask feedback={false} inputClassName={Style.input}
                                    placeholder="••••••••" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={Style.divInput}>
                                <label>Nome Completo</label>
                                <InputText value={nome} onChange={(e) => setNome(e.target.value)}
                                    className={Style.input} placeholder="Maria Silva" />
                            </div>
                            <div className={Style.divInput}>
                                <label>Email</label>
                                <InputText keyfilter="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    className={Style.input} placeholder="seu@email.com" />
                            </div>
                            <div className={Style.divInput}>
                                <label>Você é</label>
                                <div className={Style.divRadio}>
                                    <div className={Style.inputRadio}>
                                        <RadioButton inputId="aluno" name="aluno"
                                            value="Aluno" onChange={(e) => setTipoPessoa(e.value)} checked={tipoPessoa === 'Aluno'} />
                                        <label htmlFor="aluno">Aluno</label>
                                    </div>
                                    <div className={Style.inputRadio}>
                                        <RadioButton inputId="professor" name="professor"
                                            value="Professor" onChange={(e) => setTipoPessoa(e.value)} checked={tipoPessoa === 'Professor'} />
                                        <label htmlFor="professor">Professor(a)</label>
                                    </div>
                                </div>
                            </div>
                            <div className={Style.divInput}>
                                <label>Grau de Escolaridade</label>
                                <Dropdown value={grau} onChange={(e) => setGrau(e.value)} options={graus} optionLabel="name"
                                    placeholder="Selecione..." className={Style.input} />
                            </div>
                            <div className={Style.divInput}>
                                <label>R.A. (6 dígitos)</label>
                                <InputText keyfilter="num" maxLength={6}
                                    value={ra} onChange={(e) => setRA(e.target.value)}
                                    className={Style.input} placeholder="123456" />
                            </div>
                            <div className={Style.divInput}>
                                <label>Escola/Instituição</label>
                                <InputText value={escola} onChange={(e) => setEscola(e.target.value)}
                                    className={Style.input} placeholder="Escola Estadual..." />
                            </div>
                            <div className={Style.divInput}>
                                <label>Senha</label>
                                <Password value={senha} onChange={(e) => setSenha(e.target.value)}
                                    toggleMask feedback={false} inputClassName={Style.input}
                                    placeholder="••••••••" />
                            </div>
                            <div className={Style.divInput}>
                                <label>Confirmar senha</label>
                                <Password value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)}
                                    toggleMask feedback={false} inputClassName={Style.input}
                                    placeholder="••••••••" />
                            </div>
                        </>
                    )}
                    <div className={Style.btns + " " + Style.btnEntrar}>
                        <p>{trocar ? "Entrar" : "Criar conta grátis"}</p>
                    </div>
                    <div className={Style.ouContinue}>
                        <span>OU {trocar ? "CONTINUE" : "CADASTRE-SE"} COM</span>
                    </div>
                    <div className={Style.btns + " " + Style.btnEntrarGoogle}>
                        <i className="fa-brands fa-google" style={{ fontSize: "0.875rem", color: "#0F172A", marginRight: "0.8rem" }}></i>
                        <p>{trocar ? "Entrar" : "Cadastrar"} com Google</p>
                    </div>
                </div>
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
                            <i className="fa-regular fa-headphones" style={{ fontSize: "1.5rem", color: "#FF851A" }}></i>
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
                            <i className="fa-solid fa-book-open" style={{ fontSize: "1.5rem", color: "#FF851A" }}></i>
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
                            <i className="fa-regular fa-circle-check" style={{ fontSize: "1.5rem", color: "#FF851A" }}></i>
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