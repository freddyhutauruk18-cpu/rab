/**
 * APP CONTROLLER - INTEGRATED (V18 FINAL)
 * Tugas: Pusat Logika Bisnis, Kalkulasi Otomatis, Manajemen Denah, dan CRUD Item.
 */

// ==========================================
// 1. INITIALIZATION EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 App Controller Loaded");

    // Init Engine Architect pada Canvas jika tersedia
    if(window.Engine_Architect) {
        setTimeout(() => {
            window.Engine_Architect.init('canvas2d');
            
            // Init juga Furniture Engine
            const canvas = document.getElementById('canvas2d');
            if(window.FurnitureEngine && canvas) {
                window.FurnitureEngine.init('canvas2d');
            }
        }, 500);
    }
    
    // Load data tersimpan jika ada (Fitur Save/Load)
    if(typeof window.loadProgress === 'function') {
        window.loadProgress();
    }
});


// ==========================================
// 2. CORE ESTIMATION LOGIC (RAB)
// ==========================================

window.calculateAuto = function() {
    // 1. Ambil Elemen Input
    const typeEl = document.getElementById("inp_type");
    const lbEl = document.getElementById("inp_LB");
    const ltEl = document.getElementById("inp_LT");
    const floorsEl = document.getElementById("inp_floors");
    const soilEl = document.getElementById("inp_soil");
    const gradeEl = document.getElementById("inp_structure_grade");
    const execEl = document.getElementById("inp_execution_mode");

    // Validasi sederhana
    if (!window.Engine || !window.DATABASE) {
        console.warn("⚠️ Menunggu Engine atau Database...");
        return;
    }

    // 2. Siapkan Data Input untuk Engine
    const inputs = {
        LB: lbEl ? lbEl.value : 0,
        LT: ltEl ? ltEl.value : 0,
        floors: floorsEl ? floorsEl.value : 1,
        type: typeEl ? typeEl.value : 'default',
        soil: soilEl ? soilEl.value : 'normal',
        structure: gradeEl ? gradeEl.value : 'std',
        execution: execEl ? execEl.value : 'kontraktor_pro'
    };

    // 3. PANGGIL ENGINE BARU (engine_calc.js)
    const result = window.Engine.calculate(inputs, window.DATABASE);

    // 4. Update State Global (Smart Merging)
    if (!window.ACTIVE_ITEMS) window.ACTIVE_ITEMS = [];

    const manualItems = window.ACTIVE_ITEMS.filter(item => item.isAuto === false);
    const autoItems = result.details.map(item => ({...item, isAuto: true}));

    // Gabungkan: Auto di atas, Manual di bawah
    window.ACTIVE_ITEMS = [...autoItems, ...manualItems];
    
    window.CURRENT_GRAND_TOTAL = result.total; 
    recalcTotal();

    // 5. Tampilkan ke Layar (Tabel & Denah)
    renderAndSync();
    
    // Cek Budget
    const budgetVal = document.getElementById('inp_target_budget')?.value;
    if(budgetVal) window.checkBudget(budgetVal);
    
    const btnCalc = document.getElementById('btn-calc');
    if(btnCalc) btnCalc.disabled = false;

    console.log(`✅ Kalkulasi Selesai. Total Item: ${window.ACTIVE_ITEMS.length}`);
};

/**
 * Fungsi Sinkronisasi (Jembatan ke UI Renderer & Canvas)
 */
window.renderAndSync = function() {
    // 1. Render Tabel RAB (UI HTML)
    if (window.UIRenderer && window.UIRenderer.renderTable) {
        window.UIRenderer.renderTable(window.ACTIVE_ITEMS);
        window.UIRenderer.updateSummary(window.CURRENT_GRAND_TOTAL);
    } else {
        console.error("❌ UI Renderer belum dimuat!");
    }

    // 2. Render Denah 2D (CANVAS ARCHITECT)
    if (window.Engine_Architect && typeof window.Engine_Architect.draw === 'function') {
        window.Engine_Architect.draw(); 
    }
};


// ==========================================
// 3. ARCHITECT CONTROLLER (UI ACTIONS)
// ==========================================

window.addRoomManual = function() {
    const name = document.getElementById('inp_room_name').value;
    const w = parseFloat(document.getElementById('inp_room_w').value) || 3;
    const h = parseFloat(document.getElementById('inp_room_h').value) || 3;
    const type = document.getElementById('inp_room_type').value;

    if(!name) { alert("Nama ruangan wajib diisi!"); return; }

    if(window.Engine_Architect) {
        window.Engine_Architect.addRoom(name, w, h, type);
        checkAreaLimit();
    } else {
        alert("Engine Architect belum siap.");
    }
};

window.optimizeLayout = function() {
    if(confirm("Layout akan disusun ulang secara otomatis. Lanjutkan?")) {
        if(window.Engine_Architect) {
            window.Engine_Architect.optimizeLayout();
        }
    }
};

function checkAreaLimit() {
    if(!window.Engine_Architect) return;

    const lt = parseFloat(document.getElementById('inp_LT').value) || 0;
    let totalRoomArea = 0;
    
    if (window.Engine_Architect.rooms) {
        window.Engine_Architect.rooms.forEach(r => {
            totalRoomArea += (r.w * r.h);
        });
    }

    if (lt > 0 && totalRoomArea > (lt * 0.8)) {
        showToast(`⚠️ Lahan hampir penuh (${totalRoomArea.toFixed(1)}m² terpakai). Pertimbangkan bangun 2 Lantai!`, "warning");
    }
}

function showToast(msg, type='info') {
    let toast = document.getElementById('toast-notification');
    if(!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.style.cssText = "position:fixed; bottom:20px; right:20px; padding:15px; background:#333; color:white; border-radius:5px; z-index:9999; animation: slideIn 0.5s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);";
        document.body.appendChild(toast);
    }
    
    toast.style.background = type === 'warning' ? '#e67e22' : '#2c3e50';
    toast.innerHTML = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 5000);
}


// ==========================================
// 4. CRUD OPERATIONS (ITEM MANUAL RAB)
// ==========================================

window.addCustomItem = function() {
    const name = document.getElementById('cust_name').value;
    const vol = parseFloat(document.getElementById('cust_vol').value) || 1;
    const sat = document.getElementById('cust_sat').value || 'ls';
    const price = parseFloat(document.getElementById('cust_price').value) || 0;

    if (!name || price === 0) return alert("Mohon isi nama dan harga!");

    if (!window.ACTIVE_ITEMS) window.ACTIVE_ITEMS = [];

    window.ACTIVE_ITEMS.push({
        id: 'CUST-' + Date.now(),
        code: 'KUSTOM',
        divId: 'DIV-99', // Penting untuk UI Renderer grouping
        divName: 'Pekerjaan Tambahan',
        category: 'Pekerjaan Tambahan',
        name: name,
        volume: vol, 
        sat: sat,
        price: price,
        hsp_mat: price,
        hsp_upah: 0,
        total: vol * price,
        isAuto: false 
    });

    document.getElementById('cust_name').value = '';
    document.getElementById('cust_price').value = '';
    
    recalcTotal();
    renderAndSync();
};

window.removeItem = function(index) {
    if(!confirm("Hapus item ini?")) return;
    window.ACTIVE_ITEMS.splice(index, 1);
    recalcTotal();
    renderAndSync();
};

window.resetPrice = function(index) {
    const item = window.ACTIVE_ITEMS[index];
    const stdPrice = (item.hsp_mat || 0) + (item.hsp_upah || 0);
    item.price = stdPrice;
    item.total = item.volume * item.price;
    if(item.code !== 'KUSTOM') item.isAuto = true;
    recalcTotal();
    renderAndSync();
};

window.updatePrice = function(index, newPrice) {
    const item = window.ACTIVE_ITEMS[index];
    item.price = parseFloat(newPrice) || 0;
    item.total = item.volume * item.price;
    item.isAuto = false; 
    recalcTotal();
    renderAndSync();
};

window.updateVolume = function(index, newVol) {
    const item = window.ACTIVE_ITEMS[index];
    item.volume = parseFloat(newVol) || 0;
    item.total = item.volume * item.price;
    item.isAuto = false; 
    recalcTotal();
    renderAndSync();
};

function recalcTotal() {
    let t = 0;
    if(window.ACTIVE_ITEMS) {
        window.ACTIVE_ITEMS.forEach(i => t += i.total);
    }
    window.CURRENT_GRAND_TOTAL = t;
}


// ==========================================
// 5. UTILITIES (SAVE, LOAD, EXPORT)
// ==========================================

window.checkBudget = function(budget) {
    if(window.UIRenderer && typeof window.UIRenderer.checkBudgetUI === 'function') {
        window.UIRenderer.checkBudgetUI(window.CURRENT_GRAND_TOTAL);
    }
};

window.saveProgress = function() {
    const data = { 
        LB: document.getElementById('inp_LB')?.value, 
        LT: document.getElementById('inp_LT')?.value,
        type: document.getElementById('inp_type')?.value, 
        budget: document.getElementById('inp_target_budget')?.value,
        activeItems: window.ACTIVE_ITEMS 
    };
    localStorage.setItem('estimasi_v18', JSON.stringify(data));
    alert("Data tersimpan di browser!");
};

window.loadProgress = function() {
    const s = JSON.parse(localStorage.getItem('estimasi_v18'));
    if(s) {
        if(s.LB) document.getElementById('inp_LB').value = s.LB;
        if(s.type) document.getElementById('inp_type').value = s.type;
        if(s.budget) document.getElementById('inp_target_budget').value = s.budget;
        if(s.activeItems) {
            window.ACTIVE_ITEMS = s.activeItems;
            recalcTotal();
            renderAndSync();
        }
    }
};

window.exportToCSV = function() {
    if(!window.ACTIVE_ITEMS || window.ACTIVE_ITEMS.length === 0) return alert("Data Kosong!");
    let csv = "KODE,URAIAN,VOL,SAT,HARGA,TOTAL\n";
    window.ACTIVE_ITEMS.forEach(i => {
        const cleanName = (i.name || "").replace(/,/g, " ");
        csv += `"${i.code || ''}","${cleanName}",${i.volume},"${i.sat}",${Math.round(i.price)},${Math.round(i.total)}\n`;
    });
    csv += `,,,,"GRAND TOTAL",${Math.round(window.CURRENT_GRAND_TOTAL)}\n`;
    
    const url = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
    const a = document.createElement('a');
    a.href = url; a.download = `RAB_PROYEK_${Date.now()}.csv`;
    a.click();
};

// ==========================================
// 6. INJECTED: RENDER BUILDING DROPDOWN
// ==========================================
// Fungsi ini ditambahkan agar <select> Tipe Bangunan terisi dari building_types.js
window.renderBuildingDropdown = function() {
    const sel = document.getElementById('inp_type');
    if(!sel) return;
    
    // Tunggu sampai TYPE_MAP siap
    if(!window.TYPE_MAP || Object.keys(window.TYPE_MAP).length === 0) {
        console.warn("TYPE_MAP belum siap, skip render dropdown.");
        return;
    }

    sel.innerHTML = '';
    Object.keys(window.TYPE_MAP).forEach(key => {
        const typeData = window.TYPE_MAP[key];
        const opt = document.createElement('option');
        opt.value = key;
        opt.innerText = typeData.name;
        sel.appendChild(opt);
    });
    console.log("✅ Dropdown Tipe Bangunan dirender.");
};
