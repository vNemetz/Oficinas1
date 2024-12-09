// Função para exibir mensagem de feedback na tela
function showFeedbackMessage(message, type = 'error') {
    const feedbackElement = document.getElementById("feedbackMessage");
    feedbackElement.textContent = message;
    feedbackElement.className = 'feedback-message ' + type; // Aplica a classe de tipo (success ou error)
    feedbackElement.style.display = 'block'; // Exibe a mensagem
}

// Cadastro de Fechadura
document.getElementById("btnCadastrarFechadura").addEventListener("click", async function() {
    const numeroFechadura = document.getElementById("numeroFechadura").value;
    const senha = document.getElementById("senhaFechadura").value;

    // Verificar se os campos foram preenchidos
    if (!numeroFechadura || !senha) {
        showFeedbackMessage("Por favor, preencha o número da fechadura e a senha.", 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/cadastrar-fechadura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                numeroFechadura,
                senha,
            }),
        });

        const data = await response.json();

        if (data.success) {
            showFeedbackMessage("Fechadura cadastrada com sucesso!", 'success');
        } else {
            showFeedbackMessage("Erro ao cadastrar a fechadura: " + data.message, 'error');
        }
    } catch (error) {
        console.error("Erro ao cadastrar a fechadura:", error);
        showFeedbackMessage("Erro ao tentar se comunicar com o servidor.", 'error');
    }
});

// Acesso à Fechadura
document.getElementById("btnAcessarFechadura").addEventListener("click", async function() {
    const numeroFechadura = document.getElementById("numeroFechaduraAcesso").value;
    const senha = document.getElementById("senhaFechaduraAcesso").value;

    // Verificar se os campos foram preenchidos
    if (!numeroFechadura || !senha) {
        showFeedbackMessage("Por favor, preencha o número da fechadura e a senha.", 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/acessar-fechadura', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                numeroFechadura,
                senha,
            }),
        });

        const data = await response.json();

        if (data.success) {
            // Caso a validação seja bem-sucedida, redireciona para a página de controle
            window.location.href = '/controle.html';
        } else {
            // Se o login falhar, exibe mensagem de erro
            showFeedbackMessage("Erro ao acessar a fechadura: " + data.message, 'error');
        }
    } catch (error) {
        console.error("Erro ao acessar a fechadura:", error);
        showFeedbackMessage("Erro ao tentar se comunicar com o servidor.", 'error');
    }
});