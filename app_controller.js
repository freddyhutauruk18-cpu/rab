/**
 * APP CONTROLLER - INTEGRATED (V18.1 FIXED)
 * Fix: Menghapus alert/confirm (Sandbox Friendly) & Safety Check Canvas
 */

// ==========================================
// 1. INITIALIZATION EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 App Controller Loaded");

    // Init Engine Architect pada Canvas jika tersedia
    if(window.Engine_Architect) {
        // Kita beri waktu agar DOM benar-benar siap
        setTimeout(() => {
            const canvas = document.getElementById('canvas2d');
            if(canvas) {
                window.Engine_Architect.init('canvas2d');
                
                // Init juga Furniture Engine
                if(window.FurnitureEngine) {
                    window.FurnitureEngine.init('canvas2d');
                }
            } else {
                console.warn("⚠️ Canvas element 'canvas2d' not found yet.");
            }
        }, 1000); // Delay sedikit lebih lama (1s) agar aman di iframe
    }
    
    // Load data tersimpan (Cek support localStorage dulu)
    try {
        if(typeof window.loadProgress === 'function') {
            window.loadProgress();
        }
    } catch(e) {
        console.warn("LocalStorage access blocked by Sandbox (Expected).");
    }
});


// ==========================================
// 2. CORE ESTIMATION LOGIC (RAB)
// ==========================================

window.calculateAuto = function() {
    const typeEl = document.getElementById("inp_type");
    const lbEl = document.getElementById("inp_LB");
    const ltEl = document.getElementById("inp_LT");
    const floorsEl = document.getElementById("inp_floors");
    const soilEl = document.getElementById("inp_soil");
    const gradeEl = document.getElementById("inp_structure_grade");
    const execEl = document.getElementById("inp_execution_mode");

    if (!window.Engine || !window.DATABASE) {
        showToast("⚠️ Menunggu Database...", "warning");
        return;
    }

    const inputs = {
        LB: lbEl ? lbEl.value : 0,
        LT: ltEl ? ltEl.value : 0,
        floors: floorsEl ? floorsEl.value : 1,
        type: typeEl ? typeEl.value : 'default',
        soil: soilEl ? soilEl.value : 'normal',
        structure: gradeEl ? gradeEl.value : 'std',
        execution: execEl ? execEl.value : 'kontraktor_pro'
    };

    const result = window.Engine.calculate(inputs, window.DATABASE);

    if (!window.ACTIVE_ITEMS) window.ACTIVE_ITEMS = [];

    const manualItems = window.ACTIVE_ITEMS.filter(item => item.isAuto === false);
    const autoItems = result.details.map(item => ({...item, isAuto: true}));

    window.ACTIVE_ITEMS = [...autoItems, ...manualItems];
    window.CURRENT_GRAND_TOTAL = result.total; 
    recalcTotal();

    renderAndSync();
    
    const budgetVal = document.getElementById('inp_target_budget')?.value;
    if(budgetVal) window.checkBudget(budgetVal);
    
    const btnCalc = document.getElementById('btn-calc');
    if(btnCalc) btnCalc.disabled = false;

    console.log(`✅ Kalkulasi Selesai. Total: ${window.ACTIVE_ITEMS.length}`);
};

window.renderAndSync = function() {
    if (window.UIRenderer && window.UIRenderer.renderTable) {
        window.UIRenderer.renderTable(window.ACTIVE_ITEMS);
        window.UIRenderer.updateSummary(window.CURRENT_GRAND_TOTAL);
    }
    
    // Safety check sebelum draw
    if (window.Engine_Architect && window.Engine_Architect.canvas) {
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

    // GANTI ALERT DENGAN TOAST
    if(!name) { 
        showToast("⚠️ Nama ruangan wajib diisi!", "warning"); 
        return; 
    }

    if(window.Engine_Architect && window.Engine_Architect.canvas) {
        window.Engine_Architect.addRoom(name, w, h, type);
        checkAreaLimit();
    } else {
        showToast("⚠️ Denah belum siap. Coba refresh.", "warning");
    }
};

window.optimizeLayout = function() {
    // HAPUS CONFIRM() KARENA DIBLOKIR SANDBOX
    // Langsung eksekusi saja, atau buat modal custom nanti.
    if(window.Engine_Architect && window.Engine_Architect.canvas) {
        window.Engine_Architect.optimizeLayout();
        showToast("✅ Layout disusun ulang otomatis.");
    }
};

function checkAreaLimit() {
    if(!window.Engine_Architect || !window.Engine_Architect.rooms) return;

    const lt = parseFloat(document.getElementById('inp_LT').value) || 0;
    let totalRoomArea = 0;
    
    window.Engine_Architect.rooms.forEach(r => {
        totalRoomArea += (r.w * r.h);
    });

    if (lt > 0 && totalRoomArea > (lt * 0.8)) {
        showToast(`⚠️ Lahan hampir penuh (${totalRoomArea.toFixed(1)}m²).`, "warning");
    }
}

// FUNGSI TOAST (PENGGANTI ALERT)
window.showToast = function(msg, type='info') {
    let toast = document.getElementById('toast-notification');
    if(!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.style.cssText = "position:fixed; bottom:20px; right:20px; padding:15px; background:#333; color:white; border-radius:5px; z-index:9999; animation: slideIn 0.5s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); font-family:sans-serif; font-size:14px;";
        document.body.appendChild(toast);
    }
    
    toast.style.background = type === 'warning' ? '#e67e22' : '#2c3e50';
    toast.innerHTML = msg;
    toast.style.display = 'block';
    
    // Clear previous timeout if any
    if(window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => { toast.style.display = 'none'; }, 4000);
}


// ==========================================
// 4. CRUD OPERATIONS
// ==========================================

window.addCustomItem = function() {
    const name = document.getElementById('cust_name').value;
    const vol = parseFloat(document.getElementById('cust_vol').value) || 1;
    const sat = document.getElementById('cust_sat').value || 'ls';
    const price = parseFloat(document.getElementById('cust_price').value) || 0;

    if (!name || price === 0) {
        showToast("⚠️ Isi nama dan harga!", "warning");
        return;
    }

    if (!window.ACTIVE_ITEMS) window.ACTIVE_ITEMS = [];

    window.ACTIVE_ITEMS.push({
        id: 'CUST-' + Date.now(),
        code: 'KUSTOM',
        divId: 'DIV-99', 
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
    showToast("✅ Item ditambahkan.");
};

window.removeItem = function(index) {
    // Skip confirm, langsung hapus (Sandbox friendly)
    // Bisa tambahkan "Undo" nanti jika mau canggih
    window.ACTIVE_ITEMS.splice(index, 1);
    recalcTotal();
    renderAndSync();
    showToast("🗑️ Item dihapus.");
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
    try {
        const data = { 
            LB: document.getElementById('inp_LB')?.value, 
            LT: document.getElementById('inp_LT')?.value,
            type: document.getElementById('inp_type')?.value, 
            budget: document.getElementById('inp_target_budget')?.value,
            activeItems: window.ACTIVE_ITEMS 
        };
        localStorage.setItem('estimasi_v18', JSON.stringify(data));
        showToast("✅ Data tersimpan di browser!");
    } catch(e) {
        showToast("⚠️ Gagal menyimpan (Cookies diblokir)", "warning");
    }
};

window.loadProgress = function() {
    try {
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
    } catch(e) {
        console.log("No saved data found or storage blocked.");
    }
};

window.exportToCSV = function() {
    if(!window.ACTIVE_ITEMS || window.ACTIVE_ITEMS.length === 0) {
        showToast("⚠️ Data Kosong!", "warning");
        return;
    }
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

// RENDER BUILDING DROPDOWN
window.renderBuildingDropdown = function() {
    const sel = document.getElementById('inp_type');
    if(!sel) return;
    
    if(!window.TYPE_MAP || Object.keys(window.TYPE_MAP).length === 0) {
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
};
