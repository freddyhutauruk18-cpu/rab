/* APP INIT V6.0 - Robust Startup */

// Init state jika belum ada (safety)
if(typeof window.DATABASE === 'undefined') window.DATABASE = [];
if(typeof window.ACTIVE_ITEMS === 'undefined') window.ACTIVE_ITEMS = [];

async function startSystem() {
    console.log("🚀 Starting System...");
    const status = document.getElementById('system-status');
    
    // 1. Cek Config
    if(!window.GIST_URLS) {
        console.warn("Config belum siap, retry...");
        setTimeout(startSystem, 1000); 
        return;
    }

    // 2. Fetch Data
    if(status) status.innerHTML = "⏳ Mengunduh Database...";
    try {
        const reqs = window.GIST_URLS.map(u => fetch(u + '?t=' + Date.now()).then(r => r.json()));
        const res = await Promise.all(reqs);
        
        window.DATABASE = [];
        res.forEach(d => {
            if(d.items) d.items.forEach(i => window.DATABASE.push({...i, divId:d.id, divName:d.category}));
            else if(Array.isArray(d)) d[0].items.forEach(i => window.DATABASE.push({...i, divId:d[0].id, divName:d[0].category}));
        });
        
        if(status) {
            status.innerHTML = `✅ SIAP: ${window.DATABASE.length} Item Database.`;
            status.style.color = 'green';
        }

        // 3. Render Dropdown Tipe Bangunan
        if(typeof window.renderBuildingDropdown === 'function') window.renderBuildingDropdown();
        else if(window.TYPE_MAP) {
            // Fallback manual render jika controller belum siap
            const sel = document.getElementById('inp_type');
            if(sel) {
                sel.innerHTML = '';
                Object.keys(window.TYPE_MAP).forEach(k => {
                    const opt = document.createElement('option');
                    opt.value=k; opt.innerText=window.TYPE_MAP[k].name;
                    sel.appendChild(opt);
                });
            }
        }

        // 4. Auto Calculate & Init Engines
        const btnCalc = document.getElementById('btn-calc');
        if(btnCalc) btnCalc.disabled = false;

        setTimeout(() => {
            if(window.Engine_Architect) window.Engine_Architect.init('canvas2d');
            if(window.FurnitureEngine) window.FurnitureEngine.init('canvas2d');
            if(typeof window.calculateAuto === 'function') window.calculateAuto();
        }, 500);

    } catch(e) {
        console.error(e);
        if(status) { status.innerHTML = "⚠️ Gagal Init Data."; status.style.color='red'; }
    }
}

// Jalankan saat file ini selesai dimuat
startSystem();
