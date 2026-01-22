/**
 * APP MODULE 1: INITIALIZATION (V21 - MERGED CONFIG)
 * Solusi Akhir: Config digabung ke sini untuk mencegah loading error.
 */

// --- GLOBAL STATE DEFINITION ---
window.V = {}; 
window.DATABASE = []; 
window.ACTIVE_ITEMS = []; 
window.CURRENT_GRAND_TOTAL = 0; 
window.ITEM_INDEX_TO_CHANGE = null; 
window.CURRENT_SEARCH_DIV = ''; 
window.CURRENT_SEARCH_DIV_NAME = '';

// --- HARDCODED CONFIG (Agar pasti terbaca) ---
const INTERNAL_GIST_URLS = [
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-01.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-02.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-03.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-04.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-05.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-06.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-07.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-08.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-09.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-10.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-11.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-12.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-13.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-14.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-15.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-16.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-17.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-18.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-19.json",
    "https://raw.githubusercontent.com/freddyhutauruk18-cpu/rab/main/AHSP-20.json"
];

// --- BOOTSTRAP SYSTEM ---
window.forceStart = initSystem;
window.initSystem = initSystem;

if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initSystem, 500);
} else {
    document.addEventListener("DOMContentLoaded", initSystem);
}

window.HAS_STARTED = false;

async function initSystem() {
    if(window.HAS_STARTED) return;
    window.HAS_STARTED = true;

    console.log("🚀 Starting System Initialization (Merged Config)...");
    const status = document.getElementById('system-status');
    if(status) status.innerHTML = "⏳ Menghubungkan Database...";

    try {
        // Fetch Data AHSP
        const requests = INTERNAL_GIST_URLS.map(url => {
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
        window.HAS_STARTED = false;
        if(status) {
            status.style.color = "red";
            status.innerHTML = "⚠️ Gagal Koneksi (Cek Console)";
        }
    }
}
