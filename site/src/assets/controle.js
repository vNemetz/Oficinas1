// controle.js

document.getElementById('abrirFechadura').addEventListener('click', async function() {
    // Exibe o feedback de "Abrindo" antes de enviar o comando
    mostrarFeedback("Abrindo tranca...");
    await enviarComandoFechadura(1);
});

document.getElementById('fecharFechadura').addEventListener('click', async function() {
    // Exibe o feedback de "Fechando" antes de enviar o comando
    mostrarFeedback("Fechando tranca...");
    await enviarComandoFechadura(2);
});

async function enviarComandoFechadura(valor) {
    try {
        const response = await fetch('http://localhost:3000/api/comando-fechadura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comando: valor })
        });

        const data = await response.json();
        
        if (data.success) {
            console.log(`Comando ${valor === 1 ? 'Abrir' : 'Fechar'} enviado com sucesso!`);
            // Atualiza o feedback após o comando ser processado
            mostrarFeedback(`${valor === 1 ? 'Abrindo' : 'Fechando'} tranca concluído.`);
        } else {
            console.log('Erro ao enviar comando');
            // Atualiza o feedback em caso de erro
            mostrarFeedback('Erro ao enviar comando.');
        }
    } catch (error) {
        console.error('Erro ao enviar o comando:', error);
        // Atualiza o feedback em caso de erro de rede
        mostrarFeedback('Erro ao tentar enviar o comando.');
    }
}

// Função para exibir o feedback na tela
function mostrarFeedback(mensagem) {
    document.getElementById('feedbackMensagem').innerText = mensagem;
}
