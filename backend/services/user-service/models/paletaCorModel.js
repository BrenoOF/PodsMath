const pool = require('../db/connections');

const PaletaCor = {
    getAll: async () => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM paletacor');
            await connection.commit();
            return rows;
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    getById: async (id) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [rows] = await connection.query('SELECT * FROM paletacor WHERE idpaletaCor = ?', [id]);
            await connection.commit();
            return rows[0];
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    create: async (paletaData) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const { 
                nome, 
                'app-background': appBackground, 
                'border-color-tema': borderColorTema, 
                'border-inversa': borderInversa, 
                'font-paragrafo': fontParagrafo, 
                'font-meio-apagada': fontMeioApagada, 
                'sobre-projeto-bg': sobreProjetoBg, 
                'btn-1': btn1, 
                'btn-1-hover': btn1Hover, 
                ativado 
            } = paletaData;
            
            const [result] = await connection.query(
                'INSERT INTO paletacor (nome, `app-background`, `border-color-tema`, `border-inversa`, `font-paragrafo`, `font-meio-apagada`, `sobre-projeto-bg`, `btn-1`, `btn-1-hover`, ativado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [nome, appBackground, borderColorTema, borderInversa, fontParagrafo, fontMeioApagada, sobreProjetoBg, btn1, btn1Hover, ativado]
            );
            await connection.commit();
            return { idpaletaCor: result.insertId, ...paletaData };
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    update: async (id, paletaData) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const { 
                nome, 
                'app-background': appBackground, 
                'border-color-tema': borderColorTema, 
                'border-inversa': borderInversa, 
                'font-paragrafo': fontParagrafo, 
                'font-meio-apagada': fontMeioApagada, 
                'sobre-projeto-bg': sobreProjetoBg, 
                'btn-1': btn1, 
                'btn-1-hover': btn1Hover, 
                ativado 
            } = paletaData;

            const [result] = await connection.query(
                'UPDATE paletacor SET nome = ?, `app-background` = ?, `border-color-tema` = ?, `border-inversa` = ?, `font-paragrafo` = ?, `font-meio-apagada` = ?, `sobre-projeto-bg` = ?, `btn-1` = ?, `btn-1-hover` = ?, ativado = ? WHERE idpaletaCor = ?',
                [nome, appBackground, borderColorTema, borderInversa, fontParagrafo, fontMeioApagada, sobreProjetoBg, btn1, btn1Hover, ativado, id]
            );
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    },

    delete: async (id) => {
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();
            const [result] = await connection.query('DELETE FROM paletacor WHERE idpaletaCor = ?', [id]);
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            if (connection) await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
};

module.exports = PaletaCor;
