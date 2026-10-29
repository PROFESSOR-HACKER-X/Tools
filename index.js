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

        console.log("%c𝙿𝚁𝙾𝙵𝙴𝚂𝚂𝙾𝚁 | 𝙿𝙰𝚁𝙸 Dev's Tool Loaded", "color: #38bdf8; font-weight: bold; background: #09090b; padding: 6px 12px; border-radius: 6px; border: 1px solid #27272a;");

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
                console.warn("No cookies found on this domain.");
                alert("No cookies found!");
                return "";
            }
            navigator.clipboard.writeText(document.cookie);
            console.log("Cookies copied to clipboard successfully!", "color: #38bdf8; font-weight: bold;");
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

            console.log(`Sending ${options.method} request to: ${url}`, 'color: #38bdf8; font-weight: bold;');
            
            return fetch(url, options)
                .then(async res => {
                    let textData = await res.text();
                    let parsedData;
                    try { parsedData = JSON.parse(textData); } catch (e) { parsedData = textData; }
                    
                    console.log(`Response [Status: ${res.status}]`, {
                        status: res.status,
                        headers: Object.fromEntries(res.headers.entries()),
                        data: parsedData
                    });
                    return { status: res.status, headers: res.headers, data: parsedData };
                })
                .catch(err => console.error('Request Failed:', err));
        };

        // 3. Login Credential Capture Engine (Username & Password Logger)
        if (!window.__pariCredsHooked) {
            window.__pariCredsHooked = true;
            document.addEventListener('submit', function (e) {
                try {
                    let form = e.target;
                    let inputs = form.querySelectorAll('input');
                    let capturedData = {};
                    inputs.forEach(input => {
                        let type = input.type.toLowerCase();
                        if (type === 'password' || type === 'text' || type === 'email' || type === 'tel') {
                            let fieldName = input.name || input.id || input.placeholder || type;
                            capturedData[fieldName] = input.value;
                        }
                    });
                    if (Object.keys(capturedData).length > 0) {
                        console.log("%c[CAPTURED LOGIN CREDENTIALS]", "color: #facc15; font-weight: bold; background: #18181b; padding: 4px 8px; border-radius: 4px;");
                        console.table(capturedData);
                    }
                } catch (err) {
                    console.error("Credential capture error:", err);
                }
            }, true);
        }

        // 4. IP Find & Track Tracker
        window.getServerInfo = async function () {
            console.log("Tracking & Fetching IP Details...", "color: #38bdf8; font-weight: bold;");
            let data = null;
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
                    console.error("All IP tracking endpoints failed.");
                }
            }

            if (data) {
                let report = {
                    "IP Address": data.ip || data.query,
                    "ISP / Network": data.org || data.connection?.isp,
                    "City / Region": `${data.city || ''}, ${data.region || ''}`,
                    "Country": `${data.country_name || data.country} (${data.country_code || ''})`,
                    "Coordinates": `${data.latitude || data.lat || 'N/A'}, ${data.longitude || data.lon || 'N/A'}`,
                    "Timezone": data.timezone || 'N/A',
                    "User-Agent": navigator.userAgent
                };
                console.table(report);
                alert(`IP Tracked Successfully: ${report["IP Address"]}`);
            } else {
                alert("Failed to track IP.");
            }
        };

        // 5. STOP / OFF Tool
        window.stopConsole = function () {
            sessionStorage.removeItem(STORAGE_KEY);
            if (window.eruda) eruda.destroy();
            window.__pariConsoleLoaded = false;
            let controlUI = document.getElementById('pari-control-ui');
            let floatIcon = document.getElementById('pari-float-launcher');
            if (controlUI) controlUI.remove();
            if (floatIcon) floatIcon.remove();
            console.log("Dev Tool Disabled.", "color: #ef4444; font-weight: bold;");
            alert("Dev Tool Disabled!");
        };

        // 6. Floating Image Launcher & Dashboard UI
        if (!document.getElementById('pari-float-launcher')) {
            let floatLauncher = document.createElement('div');
            floatLauncher.id = 'pari-float-launcher';
            floatLauncher.style.cssText = "position:fixed;bottom:20px;right:20px;width:48px;height:48px;border-radius:50%;overflow:hidden;border:2px solid #38bdf8;box-shadow:0 4px 15px rgba(0,0,0,0.8);cursor:pointer;z-index:9999999;background:#000;";
            floatLauncher.innerHTML = `<img src="https://i.ibb.co/pB5mqzHC/Screenshot-20260922-230810-Gallery.jpg" style="width:100%;height:100%;object-fit:cover;" alt="PARI">`;
            document.body.appendChild(floatLauncher);

            let ui = document.createElement('div');
            ui.id = 'pari-control-ui';
            ui.style.cssText = "position:fixed;bottom:80px;right:20px;background:rgba(9,9,11,0.95);color:#e4e4e7;padding:10px 14px;border-radius:12px;font-size:11px;z-index:9999999;border:1px solid #27272a;backdrop-filter:blur(8px);box-shadow:0 10px 25px rgba(0,0,0,0.8);font-family:sans-serif;display:none;flex-direction:column;gap:8px;";
            
            ui.innerHTML = `
                <div style="display:flex;justify-content:between;align-items:center;border-bottom:1px solid #27272a;padding-bottom:6px;">
                    <span style="color:#38bdf8;font-weight:bold;font-size:12px;">𝙿𝚁𝙾𝙵𝙴𝚂𝚂𝙾𝚁 | 𝙿𝙰𝚁𝙸</span>
                    <span id="pari-close-ui" style="cursor:pointer;color:#a1a1aa;font-weight:bold;padding:0 4px;">X</span>
                </div>
                <div style="display:flex;gap:6px;">
                    <button id="btn-copy-ck" style="background:#18181b;color:#fff;border:1px solid #3f3f46;padding:5px 10px;border-radius:6px;font-size:10px;cursor:pointer;">Copy Cookies</button>
                    <button id="btn-ip-info" style="background:#18181b;color:#fff;border:1px solid #3f3f46;padding:5px 10px;border-radius:6px;font-size:10px;cursor:pointer;">IP Track</button>
                </div>
                <button id="btn-off" style="background:#ef4444;color:#fff;border:none;padding:5px 10px;border-radius:6px;font-size:10px;cursor:pointer;font-weight:bold;width:100%;">TURN OFF</button>
            `;
            document.body.appendChild(ui);

            // Toggle Panel on Image Click
            floatLauncher.onclick = function () {
                if (ui.style.display === 'none' || !ui.style.display) {
                    ui.style.display = 'flex';
                } else {
                    ui.style.display = 'none';
                }
            };

            document.getElementById('pari-close-ui').onclick = function () {
                ui.style.display = 'none';
            };

            document.getElementById('btn-copy-ck').onclick = window.copyCookies;
            document.getElementById('btn-ip-info').onclick = window.getServerInfo;
            document.getElementById('btn-off').onclick = window.stopConsole;
        }
    };

    document.body.appendChild(script);
})();
