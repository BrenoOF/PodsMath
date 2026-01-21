import React from "react";
import { useNavigate } from "react-router-dom";

import Style from "./sobreProjeto.module.css";

export default function TelaSobre() {
    const navigate = useNavigate();

    return (
        <div>
            <div className={Style.divApresentacao}>
                <div className={Style.btnVoltar} onClick={() => { navigate(-1) }}>
                    <i className="fa-solid fa-angle-left"></i>
                    <p>Voltar</p>
                </div>
                <div className={Style.divOrganizarTextos}>
                    <div className={Style.semiBtn}>
                        <p>Sobre o Projeto</p>
                    </div>
                    <div className={Style.divTextos}>
                        <h1>PodsMath: Matemática para Todos</h1>
                        <p>
                            Uma plataforma dedicada a tornar o aprendizado de matemática acessível envolvente e inspirador
                            através de podcasts educacionais de alta qualidade.
                        </p>
                    </div>
                </div>
            </div>
            {/* Segunda Parte da Tela */}
            <div className={Style.containerSegundaParte}>
                <div className={Style.divInformacoes}>
                    <div className={Style.divTitulos}>
                        <i className="fa-solid fa-book-open" style={{ fontSize: "1.75rem", color: "#075783" }}></i>
                        <h1>O Projeto</h1>
                    </div>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto nemo ducimus, culpa voluptatem numquam consequatur provident dolores officiis, id veritatis sunt perspiciatis recusandae sed libero quibusdam debitis, quisquam asperiores porro.
                    </p>
                    <br />
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto nemo ducimus, culpa voluptatem numquam consequatur provident dolores officiis, id veritatis sunt perspiciatis recusandae sed libero quibusdam debitis, quisquam asperiores porro.
                    </p>
                    <br />
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto nemo ducimus, culpa voluptatem numquam consequatur provident dolores officiis, id veritatis sunt perspiciatis recusandae sed libero quibusdam debitis, quisquam asperiores porro.
                    </p>
                </div>
                <div className={Style.divInformacoes}>
                    <div className={Style.divTitulos}>
                        <i className="fa-solid fa-award" style={{ fontSize: "1.75rem", color: "#075783" }}></i>
                        <h1>Nossos Princípios</h1>
                    </div>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto nemo ducimus, culpa voluptatem numquam consequatur provident dolores officiis, id veritatis sunt perspiciatis recusandae sed libero quibusdam debitis, quisquam asperiores porro.
                    </p>
                    <br />
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto nemo ducimus, culpa voluptatem numquam consequatur provident dolores officiis, id veritatis sunt perspiciatis recusandae sed libero quibusdam debitis, quisquam asperiores porro.
                    </p>
                    <br />
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto nemo ducimus, culpa voluptatem numquam consequatur provident dolores officiis, id veritatis sunt perspiciatis recusandae sed libero quibusdam debitis, quisquam asperiores porro.
                    </p>
                </div>
                <div className={Style.divInformacoes}>
                    <div className={Style.divTitulos}>
                        <i className="fa-solid fa-users" style={{ fontSize: "1.75rem", color: "#075783" }}></i>
                        <h1>Nossa Equipe</h1>
                    </div>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto nemo ducimus, culpa voluptatem numquam consequatur provident dolores officiis, id veritatis sunt perspiciatis recusandae sed libero quibusdam debitis, quisquam asperiores porro.
                    </p>
                    <br />
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto nemo ducimus, culpa voluptatem numquam consequatur provident dolores officiis, id veritatis sunt perspiciatis recusandae sed libero quibusdam debitis, quisquam asperiores porro.
                    </p>
                    <br />
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto nemo ducimus, culpa voluptatem numquam consequatur provident dolores officiis, id veritatis sunt perspiciatis recusandae sed libero quibusdam debitis, quisquam asperiores porro.
                    </p>
                </div>
            </div>
        </div>
    );
}