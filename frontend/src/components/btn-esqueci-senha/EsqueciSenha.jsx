import React from "react";
import Swal from "sweetalert2";

import Style from "./esqueciSenha.module.css";

export default function CompEsqueciSenha({ tipo, dadosUser, onEsqueciSenha }) {
    const esqueceuSenha = async () => {
        Swal.fire({
            title: "Enviando email...",
            text: `Enviando para ${dadosUser}`,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        Swal.fire({
            title: "Email enviado!",
            text: `Email enviado para ${dadosUser}`,
            icon: "success"
        });
    };

    const handleClick  = async () => {
        if (tipo === "visitante") {
            const valido = onEsqueciSenha?.();

            if (valido !== true) return;

            await esqueceuSenha();
        } else {
            await esqueceuSenha();
        }
    }

    return (
        <div className={Style.divEsqueceuSenha} onClick={handleClick}>
            <p>Esqueceu a Senha? Clique Aqui!</p>
        </div>
    );
}