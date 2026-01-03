import React from "react";

export default function CompTopBar() {

    // Trecho de Codigo para fazer troca de temas
    const aplicarTema = (modo) => {
        const themeLink = document.getElementById('theme-link');
        if (!themeLink) return;

        if (modo === 'light') {
            themeLink.href = '/themes/lara-light-blue/theme.css';
            document.body.removeAttribute('data-contrast');
        }

        if (modo === 'dark') {
            themeLink.href = '/themes/lara-dark-blue/theme.css';
            document.body.removeAttribute('data-contrast');
        }

        if (modo === 'contrast') {
            themeLink.href = '/themes/lara-dark-indigo/theme.css';
            document.body.setAttribute('data-contrast', 'high');
        }

        localStorage.setItem('theme-mode', modo);
    };
    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <span onClick={() => aplicarTema('light')}>Modo claro</span>
            <span onClick={() => aplicarTema('dark')}>Modo escuro</span>
            <span onClick={() => aplicarTema('contrast')}>Alto contraste</span>
        </div>
    )
}