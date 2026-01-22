/**
 * APP MODULE 1: INITIALIZATION (V20 - WINDOW FIX)
 * Tugas: Menyiapkan Global State, Fetch Data, dan Bootstrapping.
 */

// --- GLOBAL STATE DEFINITION ---
window.V = {}; 
window.DATABASE = []; 
window.ACTIVE_ITEMS = []; 
window.CURRENT_GRAND_TOTAL = 0; 
window.ITEM_INDEX_TO_CHANGE = null; 
window.CURRENT_SEARCH_DIV = ''; 
window.CURRENT_SEARCH_DIV_NAME = '';

// --- BOOTSTRAP SYSTEM ---
// Expose ke global agar bisa dipanggil oleh Loader index.html
window.forceStart = initSystem;
window.initSystem = initSystem;

// Auto-start fallback
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initSystem, 500);
} else {
    document.addEventListener("DOMContentLoaded", initSystem);
}

// Flag agar tidak jalan 2x
window.HAS_STARTED = false;

async function initSystem() {
    if(window.HAS_STARTED) return;
    window.HAS_STARTED = true;

    console.log("🚀 Starting System Initialization...");
    const status = document.getElementById('system-status');
    if(status) status.innerHTML = "⏳ Menghubungkan Database...";

    try {
        // Cek config (Gunakan window.GIST_URLS)
        const urls = window.GIST_URLS || (typeof GIST_URLS !== 'undefined' ? GIST_URLS : null);

        if (!urls) {
            console.warn("Config JS belum siap, mencoba retry dalam 1 detik...");
            window.HAS_STARTED = false;
            setTimeout(initSystem, 1000); 
            return;
        }

        // Fetch Data AHSP
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
            status.innerHTML = `✅ SIAP: ${window.DATABASE.length} Item Database Terhubung.`;
        }

        const btnCalc = document.getElementById('btn-calc');
        if(btnCalc) btnCalc.disabled = false;

        // Render UI
        if (typeof renderBuildingDropdown === 'function') renderBuildingDropdown();
        if (typeof loadProgress === 'function') loadProgress();
        
        // Auto Calculate
        if(window.ACTIVE_ITEMS.length === 0) {
            console.log("⚡ Auto-Generating Initial RAB...");
            if (typeof calculateAuto === 'function') {
                calculateAuto();
            }
        } else {
            if (typeof renderAndSync === 'function') renderAndSync();
        }

        console.log("🏁 System Init Complete.");

    } catch (e) {
        console.error("Init Error:", e);
        window.HAS_STARTED = false; // Reset flag agar bisa retry
        if(status) {
            status.style.color = "red";
            status.innerHTML = "⚠️ Gagal memuat data (Cek Console).";
        }
    }
}
