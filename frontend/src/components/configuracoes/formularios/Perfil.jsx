import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

import Style from "../configuracoes.module.css";

// Import de Componentes
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';

export default function CompPerfil({ dadosUser, errors, setErrors, limparErro }) {
    const [imagem, setImagem] = useState("");
    const [nome, setNome] = useState("");
    const [arquivoImagem, setArquivoImagem] = useState(null);
    const [previewImg, setPreviewImg] = useState("");

    const navigate = useNavigate();

    // Validações e Envio de Form
    const validarEdicao = () => {
        let novosErros = {};

        if (!nome.trim()) novosErros.nome = "Nome é obrigatório";

        setErrors(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const editarDados = async () => {
        if (!validarEdicao()) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            if (nome !== dadosUser.nome) {
                await axios.put("/api-user/usuarios/me", {
                    ...dadosUser,
                    nome: nome
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            if (arquivoImagem) {
                const formData = new FormData();
                formData.append("imagem", arquivoImagem);

                await axios.put("/api-user/usuarios/me/image", formData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                });
            }

            Swal.fire({
                title: "Sucesso!",
                text: "Perfil atualizado com sucesso.",
                icon: "success",
                confirmButtonColor: "#012663"
            }).then(() => {
                window.location.reload();
            });

        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            const mensagem = error.response?.data?.message || "Erro ao conectar com o servidor";
            
            Swal.fire({
                title: "Erro!",
                text: mensagem,
                icon: "error",
                confirmButtonColor: "#012663"
            });
        }
    }

    const trocarImagem = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setArquivoImagem(file);
        const preview = URL.createObjectURL(file);
        setPreviewImg(preview);
    };


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

    useEffect(() => {
        if (!dadosUser) return;

        // Garante que o caminho tenha o prefixo uploads/ se for relativo e não o tiver
        let caminhoRelativo = dadosUser.caminho_imagem || "";
        if (caminhoRelativo && !caminhoRelativo.startsWith("uploads/") && !caminhoRelativo.startsWith("/uploads/")) {
            caminhoRelativo = "uploads/" + caminhoRelativo.replace(/^\//, "");
        }

        const urlImagem = caminhoRelativo 
            ? `/api-user/${caminhoRelativo.replace(/^\//, "")}`
            : "";

        setImagem(urlImagem);
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
                        onError={(e) => (e.target.src = "/imgs/avatar-default.png")}
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
                        <p>{dadosUser?.nome_nivel_acesso}</p>
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