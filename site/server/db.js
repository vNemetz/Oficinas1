const mongoose = require('mongoose');

// Função para conectar ao banco de dados
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fechadurasDB', { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        console.log('Conectado ao MongoDB');
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1); // Encerra a aplicação em caso de erro
    }
};

module.exports = connectDB;
