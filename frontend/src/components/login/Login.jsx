import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import Style from "./login.module.css";

// Import de Componentes
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';

export default function TelaLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    const [trocar, setTrocar] = useState(() => {
        return location.state?.mode === "cadastro" ? false : true;
    });

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [tipoPessoa, setTipoPessoa] = useState("");
    const [grau, setGrau] = useState(null);
    const [ra, setRA] = useState("");
    const [escola, setEscola] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [errors, setErrors] = useState({});

    const trocarForm = (valor) => {
        setTrocar(valor);
        setErrors({});

        if (valor) {
            // indo para login
            setSenha("");
        } else {
            // indo para cadastro
            setGrau(null);
        }
    };

    // Puxar graus do json
    const [graus, setGraus] = useState([]);
    useEffect(() => {
        const carregarGrausEscolares = async () => {
            try {
                const response = await axios.get("/grausEscolar.json");
                setGraus(response.data);
            } catch (error) {
                console.error("Erro ao carregar dados do JSON", error);
            }
        }

        carregarGrausEscolares();
    }, []);

    // Validações
    const validarEmail = (value) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value ?? "").trim());
    }

    const limparErro = (campo) => {
        setErrors((prev) => ({ ...prev, [campo]: null }));
    };

    const validarLogin = () => {
        let novosErros = {};

        if (!email.trim()) {
            novosErros.email = "Email é obrigatório";
        } else if (!validarEmail(email)) {
            novosErros.email = "Email inválido";
        }

        if (!senha) {
            novosErros.senha = "Senha é obrigatória";
        }

        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const validarCadastro = () => {
        let novosErros = {};

        if (!nome.trim()) novosErros.nome = "Nome é obrigatório";

        if (!email.trim()) {
            novosErros.email = "Email é obrigatório";
        } else if (!validarEmail(email)) {
            novosErros.email = "Email inválido";
        }

        if (!tipoPessoa) novosErros.tipoPessoa = "Selecione uma opção";

        if (!grau) novosErros.grau = "Selecione o grau de escolaridade";

        if (!ra.trim()) {
            novosErros.ra = "R.A. é obrigatório";
        } else if (!/^\d{6}$/.test(ra)) {
            novosErros.ra = "R.A. deve conter 6 dígitos";
        }

        if (!escola.trim())
            novosErros.escola = "Escola é obrigatória";

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

            console.log("CADASTRO OK", {
                nome,
                email,
                tipoPessoa,
                grauEscolaridadeId: grau.id,
                ra,
                escola,
                senha
            });
        }
    };

    const logar = async () => {
        try {
            // Lê o JSON completo
            const response = await axios.get("/users.json");
            const usuarios = response.data;

            // Procura usuário que bate com email e senha
            const usuario = usuarios.find(u => u.email === email && u.senha === senha);

            if (usuario) {
                // Salva dados do usuário no localStorage
                localStorage.setItem("usuarioId", usuario.id);

                setErrors({});

                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                setErrors((prev) => ({
                    ...prev,
                    login: "Email ou senha inválidos"
                }));
            }
        } catch (error) {
            // console.error(error);

            setErrors((prev) => ({
                ...prev,
                login: "Erro interno. Tente novamente."
            }));
        }
    };

    // Troca de Logo caso o usuario esteja no modo dark
    const trocarLogo = () => {
        const tema = localStorage.getItem("theme-mode");

        if (tema === "dark") {
            return require("../../imgs/Logo2.png");
        }

        return require("../../imgs/Logo1.png");
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
                                <label>Você é</label>
                                <div className={Style.divRadio}>
                                    <div className={Style.inputRadio}>
                                        <RadioButton inputId="aluno" name="aluno"
                                            value="Aluno"
                                            onChange={(e) => {
                                                setTipoPessoa(e.value);
                                                limparErro("tipoPessoa");
                                            }}
                                            checked={tipoPessoa === 'Aluno'}
                                        />
                                        <label htmlFor="aluno">Aluno</label>
                                    </div>
                                    <div className={Style.inputRadio}>
                                        <RadioButton inputId="professor" name="professor"
                                            value="Professor"
                                            onChange={(e) => {
                                                setTipoPessoa(e.value);
                                                limparErro("tipoPessoa");
                                            }}
                                            checked={tipoPessoa === 'Professor'}
                                        />
                                        <label htmlFor="professor">Professor(a)</label>
                                    </div>

                                </div>
                                {errors.tipoPessoa && (
                                    <Message severity="error" text={errors.tipoPessoa} />
                                )}
                            </div>
                            <div className={Style.divInput}>
                                <label>Grau de Escolaridade</label>
                                <Dropdown value={grau}
                                    onChange={(e) => {
                                        setGrau(e.value);
                                        limparErro("grau");
                                    }}
                                    options={graus} optionLabel="name"
                                    placeholder="Selecione..."
                                    className={`${Style.input} ${errors.grau ? "p-invalid" : ""}`}
                                />
                                {errors.grau && (
                                    <Message severity="error" text={errors.grau} />
                                )}
                            </div>
                            <div className={Style.divInput}>
                                <label>R.A. (6 dígitos)</label>
                                <InputText keyfilter="num" maxLength={6}
                                    value={ra}
                                    onChange={(e) => {
                                        setRA(e.target.value);
                                        limparErro("ra");
                                    }}
                                    className={`${Style.input} ${errors.ra ? "p-invalid" : ""}`}
                                    placeholder="123456"
                                />
                                {errors.ra && (
                                    <Message severity="error" text={errors.ra} />
                                )}
                            </div>
                            <div className={Style.divInput}>
                                <label>Escola/Instituição</label>
                                <InputText value={escola}
                                    onChange={(e) => {
                                        setEscola(e.target.value);
                                        limparErro("escola");
                                    }}
                                    className={`${Style.input} ${errors.escola ? "p-invalid" : ""}`}
                                    placeholder="Escola Estadual..."
                                />
                                {errors.escola && (
                                    <Message severity="error" text={errors.escola} />
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
                    <div className={Style.btns + " " + Style.btnEntrar}
                        onClick={enviarForms}
                    >
                        <p>{trocar ? "Entrar" : "Criar conta grátis"}</p>
                    </div>
                    <div className={Style.ouContinue}>
                        <span>OU {trocar ? "CONTINUE" : "CADASTRE-SE"} COM</span>
                    </div>
                    <div className={Style.btns + " " + Style.btnEntrarGoogle}>
                        <i className={`fa-brands fa-google ${Style.googleIcon}`}></i>
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