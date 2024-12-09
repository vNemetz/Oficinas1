    const express = require('express');
    const mongoose = require('mongoose');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const Fechadura = require('./models/fechadura');

    const app = express();
    const port = 3000;

    // Middleware
    app.use(cors());
    app.use(bodyParser.json()); // Para fazer parse do corpo da requisição como JSON

    // Conexão com o MongoDB
    mongoose.connect('mongodb://localhost:27017/cadastroFechadura', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Conectado ao MongoDB!");
    }).catch((err) => {
        console.error("Erro de conexão com o MongoDB", err);
    });

    // Rota para cadastrar a fechadura
    app.post('/api/cadastrar-fechadura', async (req, res) => {
        const { numeroFechadura, senha } = req.body;

        if (!numeroFechadura || !senha) {
            return res.json({ success: false, message: 'Número da fechadura e senha são obrigatórios.' });
        }

        // Verificar se a fechadura já existe
        const fechaduraExistente = await Fechadura.findOne({ numeroFechadura });

        if (fechaduraExistente) {
            return res.json({ success: false, message: 'Fechadura já cadastrada!' });
        }

        // Cadastrar a nova fechadura com a senha
        const novaFechadura = new Fechadura({ numeroFechadura, senha });
        try {
            await novaFechadura.save();
            return res.json({ success: true, message: 'Fechadura cadastrada com sucesso!' });
        } catch (err) {
            return res.json({ success: false, message: 'Erro ao cadastrar a fechadura.' });
        }
    });

    // Rota para acessar a fechadura
    app.post('/api/acessar-fechadura', async (req, res) => {
        const { numeroFechadura, senha } = req.body;

        if (!numeroFechadura || !senha) {
            return res.json({ success: false, message: 'Número da fechadura e senha são obrigatórios.' });
        }

        // Verificar se a fechadura existe e a senha está correta
        const fechadura = await Fechadura.findOne({ numeroFechadura, senha });

        if (!fechadura) {
            return res.json({ success: false, message: 'Fechadura ou senha incorretos!' });
        }

        return res.json({ success: true, message: 'Acesso permitido!' });
    });

    // Servir arquivos estáticos (CSS, JS, HTML) da pasta "src"
    app.use(express.static('src'));

    // Iniciar o servidor
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });

// Rota para controlar a fechadura (Abrir/Fechar)
app.post('/api/comando-fechadura', async (req, res) => {
    const { comando } = req.body;

    if (comando === undefined) {
        return res.json({ success: false, message: 'Comando não informado.' });
    }

    // Aqui você pode adicionar lógica para controlar a fechadura real.
    // Por exemplo, se a fechadura for um dispositivo físico conectado, você enviaria um comando para ele
    // dependendo do valor do comando (1 para abrir, 2 para fechar).

    // Para fins de exemplo, vamos apenas simular a execução do comando.
    if (comando === 1) {
        console.log("Comando para abrir a fechadura recebido.");
        // Adicionar aqui a lógica para abrir a fechadura
    } else if (comando === 2) {
        console.log("Comando para fechar a fechadura recebido.");
        // Adicionar aqui a lógica para fechar a fechadura
    } else {
        return res.json({ success: false, message: 'Comando inválido.' });
    }

    return res.json({ success: true, message: `Comando ${comando === 1 ? 'Abrir' : 'Fechar'} recebido.` });
});
