async function getUserIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch {
        return 'Inconnue';
    }
}

function isBlacklisted(ip) {
    const list = JSON.parse(localStorage.getItem('snap_blacklist') || '[]');
    return list.includes(ip);
}

function blacklistIP(ip) {
    const list = JSON.parse(localStorage.getItem('snap_blacklist') || '[]');
    if (!list.includes(ip)) {
        list.push(ip);
        localStorage.setItem('snap_blacklist', JSON.stringify(list));
    }
}

function unblacklistIP(ip) {
    let list = JSON.parse(localStorage.getItem('snap_blacklist') || '[]');
    list = list.filter(i => i !== ip);
    localStorage.setItem('snap_blacklist', JSON.stringify(list));
}

function getBlacklist() {
    return JSON.parse(localStorage.getItem('snap_blacklist') || '[]');
}
