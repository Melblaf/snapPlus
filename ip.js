const GIST_ID = 'dce778eeb534d00b81137c26a90e8cfc';
const GITHUB_TOKEN = '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';

async function fetchBlacklist() {
    try {
        const res = await fetch(`https://gist.githubusercontent.com/raw/${GIST_ID}/blacklist.json?t=${Date.now()}`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.ips || [];
    } catch {
        return [];
    }
}

async function saveBlacklist(ips) {
    try {
        const res = await fetch('https://api.github.com/gists/' + GIST_ID, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'token ' + GITHUB_TOKEN
            },
            body: JSON.stringify({
                files: {
                    'blacklist.json': {
                        content: JSON.stringify({ ips }, null, 2)
                    }
                }
            })
        });
        return res.ok;
    } catch {
        return false;
    }
}

async function getUserIP() {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        return data.ip;
    } catch {
        return 'Inconnue';
    }
}

async function isBlacklisted(ip) {
    const list = await fetchBlacklist();
    return list.includes(ip);
}

async function blacklistIP(ip) {
    const list = await fetchBlacklist();
    if (!list.includes(ip)) {
        list.push(ip);
        await saveBlacklist(list);
    }
}

async function unblacklistIP(ip) {
    let list = await fetchBlacklist();
    list = list.filter(i => i !== ip);
    await saveBlacklist(list);
}

async function getBlacklist() {
    return await fetchBlacklist();
}
