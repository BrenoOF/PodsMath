import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

import Style from "../configuracoes.module.css";

export default function CompConta({ dadosUser }) {
    const navigate = useNavigate();

    // Funções para a Parte de Conta
    const excluirConta = () => {
        try {
            localStorage.removeItem("usuarioId");
            navigate("/");
        } catch (error) {
            console.error("Erro ao Excluir conta ", error);
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
    );
}