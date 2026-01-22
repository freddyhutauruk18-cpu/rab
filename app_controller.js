/**
 * APP CONTROLLER - INTEGRATED (V18)
 * Tugas: Pusat Logika Bisnis, Kalkulasi Otomatis, Manajemen Denah, dan CRUD Item.
 */

// ==========================================
// 1. INITIALIZATION EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    // Init Engine Architect pada Canvas jika tersedia
    if(window.Engine_Architect) {
        // Tunggu sebentar agar elemen DOM benar-benar siap
        setTimeout(() => {
            window.Engine_Architect.init('canvas2d');
            
            // Init juga Furniture Engine
            const canvas = document.getElementById('canvas2d');
            if(window.FurnitureEngine && canvas) {
                window.FurnitureEngine.init(canvas);
            }
        }, 500);
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

    // Validasi sederhana agar tidak error saat load awal
    if (!window.Engine) {
        console.warn("Menunggu Engine...");
        return;
    }

    // 2. Siapkan Data Input untuk Engine
    const inputs = {
        LB: lbEl ? lbEl.value : 0,
        LT: ltEl ? ltEl.value : 0,
        floors: floorsEl ? floorsEl.value : 1,
        type: typeEl ? typeEl.value : 'default'
    };

    // 3. PANGGIL ENGINE BARU (Perhatikan ini: calculate, bukan generateRAB)
    // Engine akan mengembalikan { details, total, summary }
    const result = window.Engine.calculate(inputs, window.DATABASE);

    // 4. Update State Global
    // Kita gabungkan hasil otomatis Engine + Item Manual yang user tambah sendiri
    const manualItems = window.ACTIVE_ITEMS.filter(item => item.isAuto === false);
    
    // Tandai item dari engine sebagai 'isAuto: true' agar nanti bisa dibedakan
    const autoItems = result.details.map(item => ({...item, isAuto: true}));

    // Gabungkan: Auto di atas, Manual di bawah (menggenerate ke bawah)
    window.ACTIVE_ITEMS = [...autoItems, ...manualItems];
    
    // Simpan total sementara
    window.CURRENT_GRAND_TOTAL = result.total; 

    // Hitung ulang total fix (Auto + Manual)
    recalcTotal();

    // 5. Tampilkan ke Layar (Tabel & Denah)
    renderAndSync();
    
    // Cek Budget jika user mengisi target
    const budgetVal = document.getElementById('inp_target_budget')?.value;
    if(budgetVal) window.checkBudget(budgetVal);
};

/**
 * Fungsi Sinkronisasi (Jembatan ke UI Renderer & Canvas)
 * Menggabungkan render Tabel RAB dan render Denah 2D
 */
window.renderAndSync = function() {
    // 1. Render Tabel RAB (UI HTML)
    if (window.UIRenderer && window.UIRenderer.renderTable) {
        window.UIRenderer.renderTable(window.ACTIVE_ITEMS);
        window.UIRenderer.updateSummary(window.CURRENT_GRAND_TOTAL);
    } else {
        console.error("UI Renderer belum dimuat!");
    }

    // 2. Render Denah 2D (CANVAS ARCHITECT)
    // Panggil fungsi draw() dari Engine_Architect jika sudah tersedia
    if (window.Engine_Architect && typeof window.Engine_Architect.draw === 'function') {
        window.Engine_Architect.draw(); 
    } else {
        // Fallback ke logic lama jika Engine Architect belum siap
        if (typeof window.drawDenah === 'function') {
            const lbVal = document.getElementById('inp_LB')?.value || 0;
            const ltVal = document.getElementById('inp_LT')?.value || 0;
            window.drawDenah(lbVal, ltVal);
        } else {
            console.warn("⚠️ Engine Architect / Canvas belum siap.");
        }
    }
};


// ==========================================
// 3. ARCHITECT CONTROLLER (UI ACTIONS)
// ==========================================

// Fungsi Tambah Ruangan Manual (Dari UI Input)
window.addRoomManual = function() {
    const name = document.getElementById('inp_room_name').value;
    const w = parseFloat(document.getElementById('inp_room_w').value) || 3;
    const h = parseFloat(document.getElementById('inp_room_h').value) || 3;
    const type = document.getElementById('inp_room_type').value;

    if(!name) { alert("Nama ruangan wajib diisi!"); return; }

    if(window.Engine_Architect) {
        // Tambah ke Engine Architect
        window.Engine_Architect.addRoom(name, w, h, type);
        
        // Cek Luas Total vs Luas Tanah (Fitur Saran Lantai 2)
        checkAreaLimit();
    } else {
        alert("Engine Architect belum dimuat.");
    }
};

// Fungsi Optimasi Layout Otomatis
window.optimizeLayout = function() {
    if(confirm("Layout akan disusun ulang secara otomatis. Lanjutkan?")) {
        if(window.Engine_Architect) {
            window.Engine_Architect.optimizeLayout();
        }
    }
};

// Logika Toast Notification (Saran Luas)
function checkAreaLimit() {
    if(!window.Engine_Architect) return;

    const lt = parseFloat(document.getElementById('inp_LT').value) || 0;
    
    // Hitung total luas ruangan yang ada di canvas
    let totalRoomArea = 0;
    window.Engine_Architect.rooms.forEach(r => {
        totalRoomArea += (r.w * r.h);
    });

    // Jika luas ruangan > 80% luas tanah, munculkan saran
    if (lt > 0 && totalRoomArea > (lt * 0.8)) {
        showToast(`⚠️ Lahan hampir penuh (${totalRoomArea.toFixed(1)}m² terpakai). Pertimbangkan bangun 2 Lantai!`, "warning");
    }
}

// Fungsi Helper Toast Message
function showToast(msg, type='info') {
    // Buat elemen toast jika belum ada
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

    // Hilang otomatis setelah 5 detik
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

    // Tambahkan ke Global State sebagai Item Manual (isAuto: false)
    window.ACTIVE_ITEMS.push({
        id: 'CUST-' + Date.now(),
        code: 'KUSTOM',
        category: 'Pekerjaan Tambahan',
        name: name,
        volume: vol, 
        sat: sat,
        price: price,
        total: vol * price,
        isAuto: false // Penanda ini item manual
    });

    // Reset Input
    document.getElementById('cust_name').value = '';
    document.getElementById('cust_price').value = '';
    
    // Refresh UI (Jangan calculateAuto, karena akan mereset item manual)
    recalcTotal();
    renderAndSync();
};

window.deleteItem = function(index) {
    if(!confirm("Hapus item ini?")) return;
    
    // Hapus dari array
    window.ACTIVE_ITEMS.splice(index, 1);
    
    recalcTotal();
    renderAndSync();
};

window.updateItemPrice = function(index, newPrice) {
    const item = window.ACTIVE_ITEMS[index];
    item.price = parseFloat(newPrice);
    item.total = item.volume * item.price;
    item.isAuto = false; // Jika diedit user, dia jadi item manual (agar tidak di-overwrite engine)
    
    recalcTotal();
    renderAndSync();
};

window.updateItemVol = function(index, newVol) {
    const item = window.ACTIVE_ITEMS[index];
    item.volume = parseFloat(newVol);
    item.total = item.volume * item.price;
    item.isAuto = false; // Jadi item manual
    
    recalcTotal();
    renderAndSync();
};

// Helper Hitung Ulang Total Tanpa Memanggil Engine
function recalcTotal() {
    let t = 0;
    window.ACTIVE_ITEMS.forEach(i => t += i.total);
    window.CURRENT_GRAND_TOTAL = t;
}


// ==========================================
// 5. UTILITIES (SAVE, LOAD, EXPORT)
// ==========================================

window.checkBudget = function(budget) {
    if(window.UIRenderer) window.UIRenderer.checkBudgetUI(budget);
};

window.saveProgress = function() {
    const data = { 
        LB: document.getElementById('inp_LB')?.value, 
        type: document.getElementById('inp_type')?.value, 
        budget: document.getElementById('inp_target_budget')?.value,
        activeItems: window.ACTIVE_ITEMS 
    };
    localStorage.setItem('estimasi_v17', JSON.stringify(data));
    alert("Data tersimpan di browser!");
};

window.loadProgress = function() {
    const s = JSON.parse(localStorage.getItem('estimasi_v17'));
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
    if(window.ACTIVE_ITEMS.length === 0) return alert("Data Kosong!");
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