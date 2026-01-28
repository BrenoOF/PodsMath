import React, { useState, useEffect } from "react";
import axios from "axios";

import Style from "../configuracoes.module.css";

// Import de Componentes
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';

export default function CompPerfil({ dadosUser, errors, setErrors, limparErro }) {
    const [imagem, setImagem] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [grau, setGrau] = useState(null);
    const [ra, setRa] = useState("");
    const [escola, setEscola] = useState("");

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

    // Ajustar dados do usuário
    useEffect(() => {
        if (!dadosUser || graus.length === 0) return;

        setImagem(dadosUser.img);
        setNome(dadosUser.nome);
        setEmail(dadosUser.email);
        setRa(dadosUser.ra);
        setEscola(dadosUser.escola);

        const grauEncontrado = graus.find(
            (g) => g.id === dadosUser.grauEscolaridadeId
        );

        setGrau(grauEncontrado || null);
    }, [dadosUser, graus]);

    // Validações e Envio de Form
    const validarEdicao = () => {
        let novosErros = {};

        if (!nome.trim()) novosErros.nome = "Nome é obrigatório";

        if (!grau) novosErros.grau = "Selecione o grau de escolaridade";

        if (!ra.trim()) {
            novosErros.ra = "R.A. é obrigatório";
        } else if (!/^\d{6}$/.test(ra)) {
            novosErros.ra = "R.A. deve conter 6 dígitos";
        }

        if (!escola.trim())
            novosErros.escola = "Escola é obrigatória";

        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const editarDados = () => {
        if (!validarEdicao()) return;

        console.log("EDIÇÃO OK", {
            nome,
            email,
            grauEscolaridadeId: grau.id,
            ra,
            escola
        });
    }

    return (
        <div>
            <div className={Style.divTituloForm}>
                <h1>Informações Pessoais</h1>
                <p>Atualize suas informações de perfil</p>
            </div>
            <div className={Style.divFotoPerfil}>
                <div className={Style.divImagemPerfil}>
                    <img src={imagem || "/imgs/img-perfil/avatar-default.png"} 
                        alt="Imagem de Perfil"
                    />
                </div>
                <div className={Style.divTextoFotoPerfil}>
                    <h1>Foto de Perfil</h1>
                    <p>Clique no ícone para alterar</p>
                </div>
            </div>
            <div>
                <div className={Style.divInput}>
                    <label>Nome Completo</label>
                    <InputText value={nome}
                        onChange={(e) => {
                            setNome(e.target.value);
                            limparErro("nome");
                        }}
                        inputClassName={`${Style.input} ${errors.nome ? "p-invalid" : ""}`}
                        placeholder="Seu nome completo"
                    />
                    {errors?.nome && (
                        <Message severity="error" text={errors.nome} />
                    )}
                </div>
                <div className={Style.divInput}>
                    <label>Email</label>
                    <InputText value={email}
                        inputClassName={Style.input}
                        placeholder="Seu nome completo"
                        disabled
                    />
                    <p>O email não pode ser alterado</p>
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
                    <label>R.A.</label>
                    <InputText keyfilter="num" maxLength={6}
                        value={ra}
                        onChange={(e) => {
                            setRa(e.target.value);
                            limparErro("ra");
                        }}
                        inputClassName={`${Style.input} ${errors.ra ? "p-invalid" : ""}`}
                        placeholder="Registro Acadêmico"
                    />
                    {errors?.ra && (
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
                        inputClassName={`${Style.input} ${errors.escola ? "p-invalid" : ""}`}
                        placeholder="Nome da escola ou instituição"
                    />
                    {errors?.escola && (
                        <Message severity="error" text={errors.escola} />
                    )}
                </div>
            </div>
            <div className={Style.btnEnviarForm} onClick={() => { editarDados() }}>
                <p>Salvar Alterações</p>
            </div>
        </div>
    )
}