/**
 * APP MODULE 1: INITIALIZATION
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
document.addEventListener("DOMContentLoaded", function() {
    initSystem();
});

async function initSystem() {
    const status = document.getElementById('system-status');
    if(status) status.innerHTML = "⏳ Menyiapkan Data...";

    try {
        if (typeof GIST_URLS === 'undefined') throw new Error("Config JS belum dimuat");

        // Fetch Data Gist
        const requests = GIST_URLS.map(url => {
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
            status.innerHTML = `✅ SIAP: ${window.DATABASE.length} Item Database.`;
        }

        const btnCalc = document.getElementById('btn-calc');
        if(btnCalc) btnCalc.disabled = false;

        // Panggil fungsi render dari Controller (pastikan app_controller.js sudah dimuat)
        if (typeof renderBuildingDropdown === 'function') renderBuildingDropdown();
        if (typeof loadProgress === 'function') loadProgress();
        
        // Auto Calculate Initial State
        if(window.ACTIVE_ITEMS.length === 0) {
            console.log("⚡ Auto-Generating Initial RAB...");
            if (typeof calculateAuto === 'function') setTimeout(() => calculateAuto(), 500);
        } else {
            if (typeof renderAndSync === 'function') renderAndSync();
        }

    } catch (e) {
        console.error("Init Error:", e);
        if(status) status.innerHTML = "⚠️ Gagal memuat data online.";
    }
}