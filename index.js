(function () {
    const STORAGE_KEY = '__PARI_CONSOLE_ACTIVE__';
    sessionStorage.setItem(STORAGE_KEY, 'true');

    if (window.__pariConsoleLoaded) {
        if (window.eruda) eruda.show();
        return;
    }
    window.__pariConsoleLoaded = true;

    var script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/eruda";
    script.onload = function () {
        eruda.init({
            theme: 'dark',
            defaults: { displaySize: 50, transparency: 0.9, theme: 'Dark' }
        });

        console.log("%c[+] 𝙿𝚁𝙾𝙵𝙴𝚂𝚂𝙾𝚁 | 𝙿𝙰𝚁𝙸 - Ultimate Dev Suite Loaded", "color: #c084fc; font-weight: bold; background: #09090b; padding: 6px 12px; border-radius: 6px; border: 1px solid #27272a;");

        // 1. Cookies View & Copy Tools
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
                alert("No cookies found!");
                return "";
            }
            navigator.clipboard.writeText(document.cookie);
            console.log("%c[✓] Cookies copied to clipboard successfully!", "color: #22c55e; font-weight: bold;");
            alert("Cookies copied to clipboard!");
            return document.cookie;
        };

        // 2. Request Edit, Execute & Replay Engine
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

        // 3. Fully Advance IP Find & Track Tracker
        window.getServerInfo = async function () {
            console.log("%c[*] Tracking & Fetching IP Details...", "color: #3b82f6; font-weight: bold;");
            let data = null;
            
            // Multiple fallback APIs for robust IP tracking
            try {
                let res = await fetch('https://ipapi.co/json/');
                data = await res.json();
            } catch (e1) {
                try {
                    let res2 = await fetch('https://api.ipify.org?format=json');
                    let ipJson = await res2.json();
                    let res3 = await fetch(`https://ipwho.is/${ipJson.ip}`);
                    data = await res3.json();
                } catch (e2) {
                    console.error("[×] All IP tracking endpoints failed.");
                }
            }

            if (data) {
                let report = {
                    "IP Address": data.ip || data.query,
                    "ISP / Network": data.org || data.connection?.isp,
                    "City / Region": `${data.city || ''}, ${data.region || ''}`,
                    "Country": `${data.country_name || data.country} (${data.country_code || ''})`,
                    "Coordinates (Lat/Lon)": `${data.latitude || data.lat || 'N/A'}, ${data.longitude || data.lon || 'N/A'}`,
                    "Timezone": data.timezone || 'N/A',
                    "User-Agent": navigator.userAgent
                };
                console.table(report);
                alert(`IP Tracked Successfully: ${report["IP Address"]}`);
            } else {
                alert("Failed to track IP. Check connection.");
            }
        };

        // 4. Activity & Console Event Logger
        if (!window.__pariActivityHooked) {
            window.__pariActivityHooked = true;
            const originalLog = console.log;
            console.log = function(...args) {
                originalLog.apply(console, args);
            };
        }

        // 5. STOP / OFF Tool
        window.stopConsole = function () {
            sessionStorage.removeItem(STORAGE_KEY);
            if (window.eruda) eruda.destroy();
            window.__pariConsoleLoaded = false;
            let controlUI = document.getElementById('pari-control-ui');
            if (controlUI) controlUI.remove();
            console.log("%c[-] Pro Console Disabled.", "color: #ef4444; font-weight: bold;");
            alert("Pro Console Disabled!");
        };

        // 6. Floating UI Dashboard
        if (!document.getElementById('pari-control-ui')) {
            let ui = document.createElement('div');
            ui.id = 'pari-control-ui';
            ui.style.cssText = "position:fixed;top:10px;right:10px;background:rgba(9,9,11,0.95);color:#e4e4e7;padding:8px 12px;border-radius:10px;font-size:11px;z-index:9999999;border:1px solid #27272a;backdrop-filter:blur(8px);box-shadow:0 10px 25px rgba(0,0,0,0.8);font-family:sans-serif;display:flex;gap:6px;align-items:center;";
            
            ui.innerHTML = `
                <span style="color:#c084fc;font-weight:bold;">⚡ 𝙿𝚁𝙾𝙵𝙴𝚂𝚂𝙾𝚁 | 𝙿𝙰𝚁𝙸</span>
                <button id="btn-copy-ck" style="background:#27272a;color:#fff;border:none;padding:4px 8px;border-radius:5px;font-size:10px;cursor:pointer;">Cookies</button>
                <button id="btn-ip-info" style="background:#27272a;color:#fff;border:none;padding:4px 8px;border-radius:5px;font-size:10px;cursor:pointer;">IP Track</button>
                <button id="btn-off" style="background:#ef4444;color:#fff;border:none;padding:4px 8px;border-radius:5px;font-size:10px;cursor:pointer;font-weight:bold;">OFF</button>
            `;
            document.body.appendChild(ui);

            document.getElementById('btn-copy-ck').onclick = window.copyCookies;
            document.getElementById('btn-ip-info').onclick = window.getServerInfo;
            document.getElementById('btn-off').onclick = window.stopConsole;
        }
    };

    document.body.appendChild(script);
})();
