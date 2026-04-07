import React from "react";
import axios from "axios";
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

    try {
      await axios.post("/api-user/auth/forgot-password", { email: dadosUser });

      Swal.fire({
        title: "Email enviado!",
        text: `Email enviado para ${dadosUser}`,
        icon: "success"
      });
    } catch (error) {
      Swal.fire({
        title: "Erro ao enviar email",
        text: error.response?.data?.message || "Erro de conexão",
        icon: "error"
      });
    }
  };

  const handleClick = async () => {
    if (tipo === "visitante") {
      const valido = await onEsqueciSenha?.();

      if (valido !== true) return;

      await esqueceuSenha();
    } else {
      await esqueceuSenha();
    }
  }

  return (
    <button type="button" className={Style.divEsqueceuSenha} onClick={handleClick}>
      <p>Esqueceu a Senha? Clique Aqui!</p>
    </button>
  );
}
