/* Update di ui_renderer.js */

/**
 * UI RENDERER MODULE (V17.5 - INTEGRATED FINAL WITH FURNITURE)
 * Bertanggung jawab atas visualisasi Denah 2D, Interaksi Furniture, Tabel RAB, BOM, dan Summary.
 */

// --- MODUL VISUALISASI DENAH ---
const UI_Denah = {
    renderPage: function() {
        const container = document.getElementById('page-denah');
        if (!container) return;
        
        // 1. Render Struktur HTML Utama Denah
        container.innerHTML = `
            <div class="app-header">
                <h1>📐 Visualisasi Denah 2D</h1>
                <p>Estimasi Tata Ruang Otomatis (Skala 1:100)</p>
            </div>
            
            <div class="canvas-container">
                <canvas id="canvas2d" width="800" height="500"></canvas>
            </div>

            <div class="denah-stats" id="denah-info-panel">
                </div>
        `;
        
        // 2. Tambahkan Instruksi di bawah canvas (Sesuai Request)
        container.innerHTML += `<p class="canvas-instruction">Klik dan tahan furnitur untuk memindahkannya</p>`;

        // 3. Inisialisasi Interaksi Furniture pada Canvas
        const canvas = document.getElementById('canvas2d');
        if (window.FurnitureEngine && canvas) {
            FurnitureEngine.init(canvas);
        }
        
        // 4. Memicu fungsi gambar dari engine arsitek jika tersedia
        if (window.Engine_Architect && typeof Engine_Architect.draw === 'function') {
            Engine_Architect.draw();
        }
    }
};

// --- MODUL UTAMA UI RENDERER ---
window.UIRenderer = {
    
    // --- UTAMA: RENDER TABEL RAB ---
    renderTable: function(items) {
        const tbody = document.getElementById('table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        let grandTotalBase = 0;
        const groups = {};

        // 1. Grouping Data berdasarkan Divisi Pekerjaan
        items.forEach((item, index) => {
            if (!groups[item.divId]) {
                groups[item.divId] = { name: item.divName, items: [], subtotal: 0 };
            }
            // Simpan index asli untuk referensi update data global
            groups[item.divId].items.push({ ...item, originalIndex: index });
            
            const itemTotal = (item.volume * item.price) || 0;
            groups[item.divId].subtotal += itemTotal;
            grandTotalBase += itemTotal;
        });

        const sortedDivs = Object.keys(groups).sort((a, b) => {
            const numA = parseInt(a.replace(/[^\d]/g, '')) || 999;
            const numB = parseInt(b.replace(/[^\d]/g, '')) || 999;
            return numA - numB;
        });

        // 2. Render HTML baris per baris
        sortedDivs.forEach(divId => {
            const group = groups[divId];
            const isCollapsed = window.COLLAPSED_DIVS && window.COLLAPSED_DIVS[divId] === true;
            const safeGroupName = group.name.replace(/'/g, "\\'");

            // Header Kelompok Pekerjaan (Kategori)
            const trHeader = document.createElement('tr');
            trHeader.className = 'row-category';
            trHeader.style.backgroundColor = '#f8f9fa';
            trHeader.style.borderBottom = '2px solid #e9ecef';

            trHeader.innerHTML = `
                <td colspan="2" class="no-print" style="text-align:center; cursor:pointer;" onclick="UIRenderer.toggleCollapse('${divId}')">
                    ${isCollapsed ? '➕' : '➖'}
                </td>
                <td colspan="4" onclick="UIRenderer.toggleCollapse('${divId}')" style="cursor:pointer; padding:12px 15px; color:#2c3e50; font-weight:600;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>${group.name.toUpperCase()}</span>
                        <button onclick="event.stopPropagation(); openSearchModal('${divId}', '${safeGroupName}')" 
                                class="btn-mini-add" title="Tambah Item">+ Tambah Item</button>
                    </div>
                </td>
                <td style="padding:12px 15px; font-weight:bold; text-align:right; color:#2c3e50;">
                    ${this.formatRupiah(group.subtotal)}
                </td>
            `;
            tbody.appendChild(trHeader);

            // Detail Item dalam Kategori (jika tidak sedang di-collapse)
            if (!isCollapsed) {
                group.items.forEach((item) => {
                    const tr = document.createElement('tr');
                    const idx = item.originalIndex;
                    tr.className = 'row-item';
                    
                    const standardPrice = (item.hsp_mat || 0) + (item.hsp_upah || 0);
                    const isPriceChanged = Math.abs(item.price - standardPrice) > 100;
                    
                    const priceStyle = isPriceChanged 
                        ? 'border:1px solid #f39c12; background:#fef9e7;' 
                        : 'border:1px solid transparent;';
                    
                    const resetBtn = isPriceChanged 
                        ? `<button onclick="resetPrice(${idx})" class="btn-reset-price" title="Reset Harga">↺</button>` 
                        : '';

                    tr.innerHTML = `
                        <td class="no-print text-center" style="width:40px;">
                            <button onclick="removeItem(${idx})" class="btn-delete" title="Hapus">×</button>
                        </td>
                        <td class="font-mono text-center" style="font-size:0.75rem; color:#95a5a6; width:80px;">${item.code||'-'}</td>
                        <td style="font-weight:500;">
                            <div style="display:flex; align-items:center; justify-content:space-between;">
                                <span>${item.name}</span>
                                <button onclick="openChangeItemModal(${idx})" class="btn-edit-icon">✎</button>
                            </div>
                        </td>
                        <td class="text-center">
                            <input type="number" class="inp-table inp-vol" value="${parseFloat(item.volume).toFixed(2)}" 
                                   onchange="updateVolume(${idx}, this.value)" step="0.01">
                        </td>
                        <td class="text-center" style="font-size:0.85rem; color:#666;">${item.sat}</td>
                        <td class="text-right" style="position:relative;">
                            <div style="display:flex; align-items:center; justify-content:flex-end; gap:5px;">
                                ${resetBtn}
                                <input type="number" class="inp-table inp-price" style="${priceStyle}"
                                       value="${Math.round(item.price)}" onchange="updatePrice(${idx}, this.value)">
                            </div>
                            ${isPriceChanged ? `<div style="font-size:0.6rem; color:#7f8c8d;">Std: ${this.formatRupiah(standardPrice)}</div>` : ''}
                        </td>
                        <td class="text-right" style="font-weight:600; color:#2c3e50;" id="total-${idx}">
                            ${this.formatRupiah(item.total)}
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        });

        this.updateSummary(grandTotalBase);
        this.renderBOM(items);
    },

    // --- HITUNG SUBTOTAL, JASA (MARGIn) & TOTAL AKHIR ---
    updateSummary: function(subtotal) {
        const modeInput = document.getElementById('inp_execution_mode');
        const mode = modeInput ? modeInput.value : 'kontraktor_pro';
        
        let jasaPerc = 0.10;
        if (mode === 'borongan_hemat') jasaPerc = 0.05;
        else if (mode === 'kontraktor_pro') jasaPerc = 0.12;
        
        const jasaValue = subtotal * jasaPerc;
        const grandTotal = subtotal + jasaValue;

        const setText = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.innerText = this.formatRupiah(val);
        };

        setText('txt-subtotal', subtotal);
        setText('txt-jasa', jasaValue);
        setText('txt-grandtotal', grandTotal);
        setText('txt-grandtotal-top', grandTotal);

        if (window) window.CURRENT_GRAND_TOTAL = grandTotal;
        this.checkBudgetUI(grandTotal);
    },

    // --- RENDER BILL OF MATERIALS (ESTIMASI KEBUTUHAN MATERIAL) ---
    renderBOM: function(items) {
        const BOM = {}; 
        items.forEach(item => {
            if (item.coeffs && item.volume > 0) {
                for (const [matName, coeff] of Object.entries(item.coeffs)) {
                    if (!BOM[matName]) BOM[matName] = { total: 0, unit: this.getMaterialUnit(matName) };
                    BOM[matName].total += (item.volume * coeff);
                }
            }
        });

        let container = document.getElementById('bom-section');
        if (!container) {
            const resArea = document.getElementById('result-area');
            if(resArea) {
                container = document.createElement('div');
                container.id = 'bom-section';
                resArea.parentNode.insertBefore(container, resArea.nextSibling);
            } else return;
        }

        if (Object.keys(BOM).length === 0) {
            container.innerHTML = `<div style="padding:15px; color:#999; text-align:center;"><i>Belum ada data material.</i></div>`;
            return;
        }

        let html = `
            <div class="bom-card" style="margin-top:20px; padding:15px; background:white; border:1px solid #eee; border-radius:8px;">
                <h3 style="margin-top:0; color:#2c3e50; border-bottom:2px solid #3498db; padding-bottom:10px;">📦 Estimasi Kebutuhan Material</h3>
                <table style="width:100%; border-collapse:collapse; margin-top:10px;">
                    <thead style="background:#f8f9fa;">
                        <tr><th style="padding:8px; text-align:left;">Material</th><th style="text-align:right; padding-right:15px;">Jumlah</th><th>Unit</th></tr>
                    </thead><tbody>`;
        
        Object.keys(BOM).sort().forEach(name => {
            const d = BOM[name];
            if (d.total > 0.01) {
                html += `<tr>
                    <td style="padding:6px; border-bottom:1px solid #f1f1f1;">${name}</td>
                    <td style="text-align:right; padding:6px; padding-right:15px; font-weight:bold; color:#2980b9;">
                        ${(Math.ceil(d.total*100)/100).toLocaleString('id-ID')}
                    </td>
                    <td style="padding:6px; color:#666; font-size:0.8rem;">${d.unit}</td>
                </tr>`;
            }
        });
        html += `</tbody></table></div>`;
        container.innerHTML = html;
    },

    // --- UI MONITORING BUDGET ---
    checkBudgetUI: function(grandTotal) {
        const targetEl = document.getElementById('inp_target_budget');
        const alertBox = document.getElementById('budget-alert-box');
        if (targetEl && alertBox) {
            const target = parseFloat(targetEl.value) || 0;
            if (target > 0) {
                const diff = target - grandTotal;
                alertBox.style.display = 'block';
                if (diff >= 0) {
                    alertBox.className = 'budget-alert budget-safe';
                    alertBox.innerHTML = `✅ <b>AMAN:</b> Sisa anggaran Rp ${this.formatRupiah(diff)}`;
                } else {
                    alertBox.className = 'budget-alert budget-danger';
                    alertBox.innerHTML = `⚠️ <b>OVER BUDGET:</b> Kekurangan dana Rp ${this.formatRupiah(Math.abs(diff))}`;
                }
            } else {
                alertBox.style.display = 'none';
            }
        }
    },

    toggleCollapse: function(divId) {
        if (!window.COLLAPSED_DIVS) window.COLLAPSED_DIVS = {};
        window.COLLAPSED_DIVS[divId] = !window.COLLAPSED_DIVS[divId];
        this.renderTable(window.ACTIVE_ITEMS);
    },

    formatRupiah: function(num) {
        return "Rp " + Math.round(num || 0).toLocaleString('id-ID');
    },

    getMaterialUnit: function(name) {
        const n = name.toLowerCase();
        if (n.includes('semen')) return 'Zak';
        if (n.includes('pasir') || n.includes('batu')) return 'm³';
        if (n.includes('bata') || n.includes('hebel')) return 'Bh';
        if (n.includes('cat')) return 'Kg/Pail';
        if (n.includes('besi') || n.includes('baja')) return 'Batang';
        if (n.includes('keramik') || n.includes('granit')) return 'Dus';
        return 'Satuan';
    }
};

// --- GLOBAL ALIASES ---
window.renderTable = function() { window.UIRenderer.renderTable(window.ACTIVE_ITEMS); };
window.toggleCollapse = function(id) { window.UIRenderer.toggleCollapse(id); };

console.log("✅ UI Renderer V17 Loaded.");