const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1527699387495747837/VzM0A2S5NCd-aJT7Op-j5vUSGFcCbd21I4WYkaemKyy6tNNG9GKzsMIYiZGyE-fZqzGT';

function createEmbed(title, description, color, fields) {
    return {
        title,
        description,
        color,
        fields,
        timestamp: new Date().toISOString()
    };
}

async function sendToDiscord({ content = '', embeds = [] } = {}) {
    if (!DISCORD_WEBHOOK_URL) {
        console.warn('Webhook Discord non configuré.');
        return false;
    }

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, embeds })
        });

        if (!response.ok) {
            console.error('Erreur webhook Discord:', response.status, response.statusText);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Impossible d\'envoyer au webhook Discord:', error);
        return false;
    }
}
