(function () {
    // 1. PERSISTENCE ENGINE (Storage check to auto-run on refresh)
    const STORAGE_KEY = '__PARI_CONSOLE_ACTIVE__';

    // Auto-enable state in sessionStorage
    sessionStorage.setItem(STORAGE_KEY, 'true');

    // Prevent duplicate initialization on same page render
    if (window.__pariConsoleLoaded) {
        if (window.eruda) eruda.show();
        return;
    }
    window.__pariConsoleLoaded = true;

    // Load Eruda Core CDN
    var script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/eruda";
    script.onload = function () {
        eruda.init({
            theme: 'dark',
            defaults: {
                displaySize: 50,
                transparency: 0.9,
                theme: 'Dark'
            }
        });

        // Custom Branding Log
        console.log("%c[+] PROFESSOR | PARI - Ultimate Dev Suite Loaded", "color: #c084fc; font-weight: bold; background: #09090b; padding: 6px 12px; border-radius: 6px; border: 1px solid #27272a;");

        // 2. ADVANCED UTILITIES & TOOLKIT

        // A. Cookies View & Copy Tools
        window.getCookies = function () {
            let cookies = document.cookie.split('; ').filter(Boolean).map(c => {
                let [key, ...v] = c.split('=');
                return { Name: key, Value: v.join('=') };
            });
            console.table(cookies);
            return cookies;
        };

        window.copyCookies = function () {
            if (!document.cookie) {
                console.warn("[!] No cookies found on this domain.");
                return "";
            }
            navigator.clipboard.writeText(document.cookie);
            console.log("%c[✓] Cookies copied to clipboard successfully!", "color: #22c55e; font-weight: bold;");
            alert("Cookies copied to clipboard!");
            return document.cookie;
        };

        // B. Request Edit & Execute Engine
        window.sendRequest = function (url, method = 'GET', headers = {}, body = null) {
            let options = {
                method: method.toUpperCase(),
                headers: Object.assign({ 'Content-Type': 'application/json' }, headers)
            };
            if (body && options.method !== 'GET') {
                options.body = typeof body === 'object' ? JSON.stringify(body) : body;
            }

            console.log(`%c[→] Sending ${options.method} request to: ${url}`, 'color: #eab308; font-weight: bold;');
            
            return fetch(url, options)
                .then(async res => {
                    let textData = await res.text();
                    let parsedData;
                    try { parsedData = JSON.parse(textData); } catch (e) { parsedData = textData; }
                    
                    console.log(`%c[←] Response [Status: ${res.status}]`, 'color: #22c55e; font-weight: bold;', {
                        status: res.status,
                        headers: Object.fromEntries(res.headers.entries()),
                        data: parsedData
                    });
                    return { status: res.status, headers: res.headers, data: parsedData };
                })
                .catch(err => console.error('[×] Request Failed:', err));
        };

        // C. Server IP & Network Info Fetcher
        window.getServerInfo = async function () {
            console.log("%c[*] Fetching IP & Server Information...", "color: #3b82f6;");
            try {
                let res = await fetch('https://ipapi.co/json/');
                let data = await res.json();
                console.table({
                    "Client Public IP": data.ip,
                    "ISP / Host": data.org,
                    "City / Region": `${data.city}, ${data.region}`,
                    "Country": `${data.country_name} (${data.country_code})`,
                    "User-Agent": navigator.userAgent
                });
            } catch (e) {
                console.error("[×] Could not retrieve IP details:", e);
            }
        };

        // D. TURN OFF Tool (Manual Stop & Disable Persistence)
        window.stopConsole = function () {
            sessionStorage.removeItem(STORAGE_KEY);
            if (window.eruda) eruda.destroy();
            window.__pariConsoleLoaded = false;
            let controlUI = document.getElementById('pari-control-ui');
            if (controlUI) controlUI.remove();
            console.log("%c[-] Pro Console Disabled & Auto-Reload Removed.", "color: #ef4444; font-weight: bold;");
            alert("Pro Console Disabled!");
        };

        // 3. FLOATING DASHBOARD & QUICK ACTION BAR
        if (!document.getElementById('pari-control-ui')) {
            let ui = document.createElement('div');
            ui.id = 'pari-control-ui';
            ui.style.cssText = "position:fixed;top:10px;right:10px;background:rgba(9,9,11,0.92);color:#e4e4e7;padding:8px 12px;border-radius:10px;font-size:11px;z-index:9999999;border:1px solid #27272a;backdrop-filter:blur(8px);box-shadow:0 10px 25px rgba(0,0,0,0.8);font-family:sans-serif;display:flex;gap:6px;align-items:center;";
            
            ui.innerHTML = `
                <span style="color:#c084fc;font-weight:bold;">⚡ PARI PRO</span>
                <button id="btn-copy-ck" style="background:#27272a;color:#fff;border:none;padding:4px 8px;border-radius:5px;font-size:10px;cursor:pointer;">Copy Cookies</button>
                <button id="btn-ip-info" style="background:#27272a;color:#fff;border:none;padding:4px 8px;border-radius:5px;font-size:10px;cursor:pointer;">IP Info</button>
                <button id="btn-off" style="background:#ef4444;color:#fff;border:none;padding:4px 8px;border-radius:5px;font-size:10px;cursor:pointer;font-weight:bold;">OFF</button>
            `;
            document.body.appendChild(ui);

            // Button Event Listeners
            document.getElementById('btn-copy-ck').onclick = window.copyCookies;
            document.getElementById('btn-ip-info').onclick = window.getServerInfo;
            document.getElementById('btn-off').onclick = window.stopConsole;
        }
    };

    document.body.appendChild(script);
})();
