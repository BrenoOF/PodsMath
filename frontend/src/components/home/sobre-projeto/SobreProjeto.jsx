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
                {/* Parte do "O Projeto" */}
                <div className={Style.divInformacoes}>
                    <div className={Style.divTitulos}>
                        <i className="fa-solid fa-book-open" style={{ fontSize: "1.75rem", color: "#075783" }}></i>
                        <h1>O Projeto</h1>
                    </div>
                    <p>
                        O PodsMath é um projeto educacional criado com o objetivo de facilitar o acesso
                        ao conhecimento matemático por meio de conteúdos em áudio. A plataforma utiliza
                        podcasts como principal formato, permitindo que os usuários aprendam matemática
                        de forma prática, dinâmica e acessível, em qualquer lugar e a qualquer momento.
                    </p>
                    <br />
                    <p>
                        O projeto surgiu a partir da necessidade de tornar o estudo da matemática menos
                        intimidante e mais próximo da realidade dos estudantes. Com explicações claras,
                        linguagem objetiva e exemplos contextualizados, o PodsMath busca transformar a
                        forma como conceitos matemáticos são apresentados e compreendidos.
                    </p>
                    <br />
                    <p>
                        Além de apoiar estudantes em sua jornada acadêmica, o PodsMath também se propõe 
                        a ser uma ferramenta complementar para professores e entusiastas da área, 
                        promovendo o aprendizado contínuo por meio da tecnologia e da inovação educacional.
                    </p>
                </div>
                {/* Parte do "Nossos Princípios" */}
                <div className={Style.divInformacoes}>
                    <div className={Style.divTitulos}>
                        <i className="fa-solid fa-award" style={{ fontSize: "1.75rem", color: "#075783" }}></i>
                        <h1>Nossos Princípios</h1>
                    </div>
                    <div className={Style.divCardsPrincipio}>
                        <div className={Style.cardPrincipio + " " + Style.padraoCard}>
                            <div className={Style.divIconPrincipio}>
                                <i className="fa-solid fa-bullseye" style={{ fontSize: "1.5rem", color: "#075783" }}></i>
                            </div>
                            <h1>
                                Missão
                            </h1>
                            <p>
                                Democratizar o acesso ao conhecimento matemático através de conteúdo de alta qualidade,
                                tornando a matemática acessível e inspiradora para todos.
                            </p>
                        </div>
                        <div className={Style.cardPrincipio + " " + Style.padraoCard}>
                            <div className={Style.divIconPrincipio}>
                                <i className="fa-solid fa-lightbulb" style={{ fontSize: "1.5rem", color: "#075783" }}></i>
                            </div>
                            <h1>
                                Visão
                            </h1>
                            <p>
                                Ser a principal plataforma de podcasts educacionais de matemática no Brasil,
                                transformando a forma como estudantes e entusiastas aprendem.
                            </p>
                        </div>
                        <div className={Style.cardPrincipio + " " + Style.padraoCard}>
                            <div className={Style.divIconPrincipio}>
                                <i className="fa-solid fa-heart" style={{ fontSize: "1.5rem", color: "#075783" }}></i>
                            </div>
                            <h1>
                                Valores
                            </h1>
                            <p>
                                Excelência acadêmica, inclusão educacional, inovação pedagógica e comprometimento
                                com o desenvolvimento contínuo do conhecimento.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Parte do Nossa Equipe */}
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
                {/* Parte do "Parceiros do Projeto" */}
                <div className={Style.divInformacoes}>
                    <div className={Style.divTitulos}>
                        <i className="fa-solid fa-users" style={{ fontSize: "1.75rem", color: "#075783" }}></i>
                        <h1>Parceiros do Projeto</h1>
                    </div>
                    <div className={Style.divCardsParceiros}>
                        <div className={Style.cardParceiro + " " + Style.padraoCard}>
                            <div className={Style.divSubTituloParceiro}>
                                <p>
                                    Instituição de Ensino Superior
                                </p>
                            </div>
                            <h1>
                                Universidade Federal de Matemática
                            </h1>
                            <p>
                                Parceria acadêmica para desenvolvimento de conteúdo científico
                            </p>
                        </div>
                        <div className={Style.cardParceiro + " " + Style.padraoCard}>
                            <div className={Style.divSubTituloParceiro}>
                                <p>
                                    Centro de Pesquisa
                                </p>
                            </div>
                            <h1>
                                Instituto de Tecnologia Educacional
                            </h1>
                            <p>
                                Apoio técnico e metodológico para produção de conteúdo
                            </p>
                        </div>
                        <div className={Style.cardParceiro + " " + Style.padraoCard}>
                            <div className={Style.divSubTituloParceiro}>
                                <p>
                                    Organização sem fins lucrativos
                                </p>
                            </div>
                            <h1>
                                Fundação para Educação Digital
                            </h1>
                            <p>
                                Financiamento e suporte para democratização do ensino
                            </p>
                        </div>
                        <div className={Style.cardParceiro + " " + Style.padraoCard}>
                            <div className={Style.divSubTituloParceiro}>
                                <p>
                                    Comunidade Educacional
                                </p>
                            </div>
                            <h1>
                                Rede Nacional de Professores
                            </h1>
                            <p>
                                Colaboração na curadoria e validação de conteúdos
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div>### Footer ###</div>
        </div>
    );
}