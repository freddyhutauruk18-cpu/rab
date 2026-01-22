/**
 * APP MODULE 1: INITIALIZATION (V20 - WINDOW FIX)
 */
window.V = {}; 
window.DATABASE = []; 
window.ACTIVE_ITEMS = []; 
window.CURRENT_GRAND_TOTAL = 0; 
window.ITEM_INDEX_TO_CHANGE = null; 
window.CURRENT_SEARCH_DIV = ''; 
window.CURRENT_SEARCH_DIV_NAME = '';

// Expose fungsi start ke global
window.forceStart = initSystem;
window.initSystem = initSystem;

// Auto-start logic
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initSystem, 500);
} else {
    document.addEventListener("DOMContentLoaded", initSystem);
}

window.HAS_STARTED = false;

async function initSystem() {
    if(window.HAS_STARTED) return;
    window.HAS_STARTED = true;

    console.log("🚀 Starting System Initialization...");
    const status = document.getElementById('system-status');
    if(status) status.innerHTML = "⏳ Menghubungkan Database...";

    try {
        // AMBIL DARI WINDOW (Fix Masalah Config)
        const urls = window.GIST_URLS;

        if (!urls) {
            console.warn("Config JS belum siap, mencoba retry...");
            window.HAS_STARTED = false;
            setTimeout(initSystem, 1000); // Coba lagi 1 detik kemudian
            return;
        }

        const requests = urls.map(url => {
            const noCacheUrl = url + (url.includes('?') ? '&' : '?') + 't=' + Date.now();
            return fetch(noCacheUrl).then(r => r.json());
        });

        const responses = await Promise.all(requests);
        window.DATABASE = [];
        responses.forEach(divisi => {
            const d = Array.isArray(divisi) ? divisi[0] : divisi;
            if (d && d.items) {
                d.items.forEach(item => {
                    window.DATABASE.push({ ...item, divId: d.id, divName: d.category });
                });
            }
        });
        window.DATABASE.sort((a,b) => (a.code||"").localeCompare(b.code||"", undefined, {numeric: true}));

        if(status) {
            status.className = "status-ready";
            status.style.color = "#27ae60"; 
            status.innerHTML = `✅ SIAP: ${window.DATABASE.length} Item Database.`;
        }

        const btnCalc = document.getElementById('btn-calc');
        if(btnCalc) btnCalc.disabled = false;

        if (typeof renderBuildingDropdown === 'function') renderBuildingDropdown();
        if (typeof loadProgress === 'function') loadProgress();
        
        if(window.ACTIVE_ITEMS.length === 0) {
            if (typeof calculateAuto === 'function') calculateAuto();
        } else {
            if (typeof renderAndSync === 'function') renderAndSync();
        }
        console.log("🏁 Init Complete.");

    } catch (e) {
        console.error("Init Error:", e);
        window.HAS_STARTED = false;
        if(status) {
            status.style.color = "red";
            status.innerHTML = "⚠️ Gagal Koneksi (Cek Console)";
        }
    }
}
