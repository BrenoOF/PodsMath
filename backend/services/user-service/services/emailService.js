const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const emailService = {
    sendPasswordResetEmail: async (emailUsuario, nomeUsuario, linkResetSenha, ipOrigem) => {
        try {
            const dataSolicitacao = new Date().toLocaleString('pt-BR');

            const { data, error } = await resend.emails.send({
                from: 'Podsmath <podsmath@sauloserver.shop>',
                to: emailUsuario,
                template: {
                    id: 'password-reset',
                    variables: {
                        email_usuario: emailUsuario,
                        ip_origem: ipOrigem || 'N/A',
                        link_reset_senha: linkResetSenha,
                        nome_usuario: nomeUsuario,
                        data_solicitacao: dataSolicitacao
                    }
                }
            });

            if (error) {
                throw new Error(`Erro ao enviar email: ${error.message}`);
            }

            return { success: true, data };
        } catch (error) {
            console.error('Erro no serviço de email:', error);
            throw error;
        }
    }
};

module.exports = emailService;