function getUserIP() {
    return fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then(d => d.ip)
        .catch(() => 'Inconnue');
}
