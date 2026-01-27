// import React, { useState } from "react";

import Style from "../configuracoes.module.css";

// Import de Componentes
// import { InputText } from 'primereact/inputtext';
// import { RadioButton } from 'primereact/radiobutton';
// import { Dropdown } from 'primereact/dropdown';
// import { Password } from 'primereact/password';
// import { Message } from 'primereact/message';

export default function TelaConfiguracoes() {
    return (
        <div>
            <div className={Style.divTituloForm}>
                <h1>Informações Pessoais</h1>
                <p>Atualize suas informações de perfil</p>
            </div>
            <div className={Style.divFotoPerfil}>
                <div className={Style.divImagemPerfil}>
                    {/* <img /> */}
                </div>
                <div className={Style.divTextoFotoPerfil}>
                    <h1>Foto de Perfil</h1>
                    <p>Clique no ícone para alterar</p>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}