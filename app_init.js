/**
 * APP MODULE 1: INITIALIZATION (V19 - ROBUST BOOT)
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
// Kita cek apakah dokumen sudah siap? Jika ya, langsung gas. Jika belum, tunggu.
if (document.readyState === "complete" || document.readyState === "interactive") {
    // Beri jeda sedikit agar script lain benar-benar ter-parse
    setTimeout(initSystem, 500);
} else {
    document.addEventListener("DOMContentLoaded", initSystem);
}

// Expose ke global agar bisa dipanggil manual dari Console jika macet
window.forceStart = initSystem;

async function initSystem() {
    console.log("🚀 Starting System Initialization...");
    const status = document.getElementById('system-status');
    if(status) status.innerHTML = "⏳ Menghubungkan Database...";

    try {
        if (typeof GIST_URLS === 'undefined') {
            console.warn("Config JS belum siap, mencoba tunggu...");
            // Retry mechanism sederhana
            setTimeout(initSystem, 1000); 
            return;
        }

        // Fetch Data AHSP
        // Tambahkan timestamp agar JSON tidak di-cache browser secara agresif
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
        // Sort database by code
        window.DATABASE.sort((a,b) => (a.code||"").localeCompare(b.code||"", undefined, {numeric: true}));

        if(status) {
            status.className = "status-ready";
            status.style.color = "#27ae60"; // Hijau
            status.innerHTML = `✅ SIAP: ${window.DATABASE.length} Item Database Terhubung.`;
        }

        const btnCalc = document.getElementById('btn-calc');
        if(btnCalc) btnCalc.disabled = false;

        // Render UI Awal
        if (typeof renderBuildingDropdown === 'function') renderBuildingDropdown();
        if (typeof loadProgress === 'function') loadProgress();
        
        // Auto Calculate Initial State
        if(window.ACTIVE_ITEMS.length === 0) {
            console.log("⚡ Auto-Generating Initial RAB...");
            if (typeof calculateAuto === 'function') {
                calculateAuto();
            } else {
                console.warn("Fungsi calculateAuto tidak ditemukan di app_controller.js");
            }
        } else {
            if (typeof renderAndSync === 'function') renderAndSync();
        }

        console.log("🏁 System Init Complete.");

    } catch (e) {
        console.error("Init Error:", e);
        if(status) {
            status.style.color = "red";
            status.innerHTML = "⚠️ Gagal memuat data (Cek Koneksi/Console).";
        }
    }
}
