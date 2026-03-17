import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

import Style from "../configuracoes.module.css";

// Import de Componentes
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';

export default function CompPerfil({ dadosUser, errors, setErrors, limparErro }) {
    const [imagem, setImagem] = useState("");
    const [nome, setNome] = useState("");

    // Validações e Envio de Form
    const validarEdicao = () => {
        let novosErros = {};

        if (!nome.trim()) novosErros.nome = "Nome é obrigatório";

        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const editarDados = () => {
        if (!validarEdicao()) return;

        console.log("EDIÇÃO OK", {
            nome,
            previewImg
        });
    }

    // Função para fingir upload de imagem
    const [previewImg, setPreviewImg] = useState("");

    const trocarImagem = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        setPreviewImg(preview);
    };

    const navigate = useNavigate();

    // Funções para a Parte de Conta
    const excluirConta = () => {
        try {
            localStorage.removeItem("token");
            navigate("/");
        } catch (error) {
            console.error("Erro ao Excluir conta ", error);
        }
    }

    const alertExclusao = () => {
        Swal.fire({
            title: "Quer Realmente Excluir a Conta?",
            text: "Esta ação não pode ser desfeita.",
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

    // Ajustar dados do usuário
    useEffect(() => {
        if (!dadosUser) return;

        setImagem(dadosUser.img || "");
        setNome(dadosUser.nome);
    }, [dadosUser]);

    return (
        <div>
            <div className={Style.divTituloForm}>
                <h1>Informações Pessoais</h1>
                <p>Atualize suas informações de perfil</p>
            </div>
            <div className={Style.divFotoPerfil}>
                <div className={Style.ajusteImgPerfil}>
                    <img src={previewImg || imagem || "/imgs/avatar-default.png"}
                        alt="Imagem de Perfil" className={Style.imgPerfil}
                        draggable="false"
                    />
                    {/* Input escondido */}
                    <input
                        type="file"
                        accept="image/*"
                        id="inputImagemPerfil"
                        onChange={trocarImagem}
                        className={Style.inputFile}
                    />
                    {/* Ícone clicável */}
                    <label
                        htmlFor="inputImagemPerfil"
                        className={Style.iconeAlterarImg}
                    >
                        <i className="fa-regular fa-camera"></i>
                    </label>
                </div>
                <div className={Style.divTextoFotoPerfil}>
                    <h1>Foto de Perfil</h1>
                    <p>Clique no ícone para alterar</p>
                </div>
            </div>
            <hr className={Style.linhaSeparacao} />
            <div className={Style.divInputs}>
                <div className={Style.divInput}>
                    <label>Nome Completo</label>
                    <InputText value={nome}
                        onChange={(e) => {
                            setNome(e.target.value);
                            limparErro("nome");
                        }}
                        className={`${Style.input} ${errors.nome ? "p-invalid" : ""}`}
                        placeholder="Seu nome completo"
                    />
                    {errors?.nome && (
                        <Message severity="error" text={errors.nome} />
                    )}
                </div>
            </div>
            <div className={Style.btnEnviarForm} onClick={() => { editarDados() }}>
                <p>Salvar Alterações</p>
            </div>
            <div>
                <div className={Style.divInformacoesConta}>
                    <div className={Style.divInformacao}>
                        <h1>Email</h1>
                        <p>{dadosUser?.email}</p>
                    </div>
                    <hr className={Style.linhaSeparacao} />
                    <div className={Style.divInformacao}>
                        <h1>Nível de Acesso</h1>
                        <p>{dadosUser?.nivel_acesso_idnivel_acesso}</p>
                    </div>
                    <hr className={Style.linhaSeparacao} />
                    <div className={Style.divInformacao}>
                        <h1>Membro desde</h1>
                        <p>{dadosUser?.membroDesde}</p>
                    </div>
                    <hr className={Style.linhaSeparacao} />
                </div>
                <div className={Style.textosPerigo}>
                    <h1>Zona de Perigo</h1>
                    <p>Ações irreversíveis relacionadas à sua conta</p>
                </div>
                <div className={Style.btnExcluirConta} onClick={() => { alertExclusao() }}>
                    <p>Excluir Conta</p>
                </div>
            </div>
        </div>
    )
}