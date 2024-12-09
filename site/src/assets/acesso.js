// main.js

document.getElementById('formAcesso').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    
    const numeroFechadura = document.getElementById('numeroFechadura').value;
    const senhaFechadura = document.getElementById('senhaFechadura').value;
    
    // Envia a requisição para o backend
    try {
        const response = await fetch('http://localhost:3000/api/acessar-fechadura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ numeroFechadura, senha: senhaFechadura })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Se a resposta for positiva, redireciona para a página de controle
            window.location.href = 'controle.html';
        } else {
            // Caso contrário, exibe a mensagem de erro
            document.getElementById('mensagemAcesso').innerText = data.message;
        }
    } catch (error) {
        console.error('Erro ao tentar acessar:', error);
        document.getElementById('mensagemAcesso').innerText = 'Erro ao tentar acessar. Tente novamente mais tarde.';
    }
});
