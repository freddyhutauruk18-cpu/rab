/**
 * UI RENDERER MODULE (V18.5 - FINAL FIXED & COMPLETE)
 * Fitur: Denah, BOM, Tabel RAB, Budgeting.
 * Fix: Anti-Crash pada Sorting & DOM Elements.
 */

// --- 1. MODUL VISUALISASI DENAH ---
const UI_Denah = {
    renderPage: function() {
        const container = document.getElementById('page-denah');
        if (!container) return;
        
        container.innerHTML = `
            <div class="app-header">
                <h1>📐 Visualisasi Denah 2D</h1>
                <p>Estimasi Tata Ruang Otomatis (Skala 1:100)</p>
            </div>
            <div class="canvas-container">
                <canvas id="canvas2d" width="800" height="500"></canvas>
            </div>
            <div class="denah-stats" id="denah-info-panel"></div>
            <p class="canvas-instruction" style="text-align:center; color:#7f8c8d; margin-top:5px;">
                Klik dan tahan ruangan/furnitur untuk memindahkannya
            </p>
        `;

        const canvas = document.getElementById('canvas2d');
        // Init Furniture Engine
        if (window.FurnitureEngine && canvas) {
            FurnitureEngine.init('canvas2d');
        }
        // Init Architect Engine
        if (window.Engine_Architect && typeof Engine_Architect.draw === 'function') {
            Engine_Architect.init('canvas2d');
            setTimeout(() => Engine_Architect.draw(), 100);
        }
    }
};

// --- 2. MODUL UTAMA UI RENDERER ---
window.UIRenderer = {
    
    // --- RENDER TABEL RAB (DENGAN FIX CRASH) ---
    renderTable: function(items) {
        const tbody = document.getElementById('table-body');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        let grandTotalBase = 0;
        const groups = {};

        // A. Grouping Data
        items.forEach((item, index) => {
            const divId = item.divId || 'DIV-99';
            const divName = item.divName || 'Lain-lain';

            if (!groups[divId]) {
                groups[divId] = { name: divName, items: [], subtotal: 0 };
            }
            groups[divId].items.push({ ...item, originalIndex: index });
            
            const itemTotal = (item.volume * item.price) || 0;
            groups[divId].subtotal += itemTotal;
            grandTotalBase += itemTotal;
        });

        // B. Sorting Keys (INI BAGIAN YANG DIPERBAIKI)
        const sortedDivs = Object.keys(groups).sort((a, b) => {
            // Kita ubah jadi string dulu agar aman dari error 'replace of undefined'
            const strA = String(a || '');
            const strB = String(b || '');
            const numA = parseInt(strA.replace(/[^\d]/g, '')) || 999;
            const numB = parseInt(strB.replace(/[^\d]/g, '')) || 999;
            return numA - numB;
        });

        // C. Render HTML
        sortedDivs.forEach(divId => {
            const group = groups[divId];
            const isCollapsed = window.COLLAPSED_DIVS && window.COLLAPSED_DIVS[divId] === true;
            // Escape quote untuk keamanan onclick
            const safeDivId = String(divId).replace(/'/g, "\\'"); 
            const safeGroupName = String(group.name).replace(/'/g, "\\'");

            // Header Kategori
            const trHeader = document.createElement('tr');
            trHeader.className = 'row-category';
            trHeader.style.backgroundColor = '#d6eaf8';
            trHeader.style.color = '#154360';
            
            trHeader.innerHTML = `
                <td colspan="2" class="no-print" style="text-align:center; cursor:pointer;" onclick="toggleCollapse('${safeDivId}')">
                    ${isCollapsed ? '➕' : '➖'}
                </td>
                <td colspan="4" onclick="toggleCollapse('${safeDivId}')" style="cursor:pointer; font-weight:bold; padding:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>${group.name.toUpperCase()}</span>
                        <button onclick="event.stopPropagation(); openSearchModal('${safeDivId}', '${safeGroupName}')" 
                                style="background:#2ecc71; border:none; color:white; border-radius:3px; font-size:10px; padding:2px 8px; cursor:pointer;">
                                + Item
                        </button>
                    </div>
                </td>
                <td style="padding:10px; font-weight:bold; text-align:right;">
                    ${this.formatRupiah(group.subtotal)}
                </td>
            `;
            tbody.appendChild(trHeader);

            // Detail Item (Jika tidak di-collapse)
            if (!isCollapsed) {
                group.items.forEach((item) => {
                    const tr = document.createElement('tr');
                    const idx = item.originalIndex;
                    
                    const standardPrice = (item.hsp_mat || 0) + (item.hsp_upah || 0);
                    const isPriceChanged = Math.abs(item.price - standardPrice) > 100;
                    
                    // Tombol Reset Harga (muncul jika harga beda dari standar)
                    const resetBtn = isPriceChanged 
                        ? `<button onclick="resetPrice(${idx})" style="border:none; background:none; cursor:pointer; font-size:14px;" title="Reset ke Standar">↺</button>` 
                        : '';

                    tr.innerHTML = `
                        <td class="text-center">
                            <button onclick="removeItem(${idx})" style="color:red; border:none; background:none; cursor:pointer; font-weight:bold;">×</button>
                        </td>
                        <td class="text-center" style="font-size:0.85em; color:#666;">${item.code||'-'}</td>
                        <td>
                            ${item.name}
                            ${isPriceChanged ? '<span style="color:#e67e22; font-size:0.8em;">(Custom)</span>' : ''}
                        </td>
                        <td class="text-center">
                            <input type="number" value="${parseFloat(item.volume).toFixed(2)}" 
                                   onchange="updateVolume(${idx}, this.value)" 
                                   style="width:60px; text-align:center; border:1px solid #ddd;">
                        </td>
                        <td class="text-center">${item.sat}</td>
                        <td class="text-right">
                            <div style="display:flex; justify-content:flex-end; align-items:center;">
                                ${resetBtn}
                                <input type="number" value="${Math.round(item.price)}" 
                                       onchange="updatePrice(${idx}, this.value)"
                                       style="width:90px; text-align:right; border:1px solid #ddd; ${isPriceChanged ? 'background:#fef9e7; border-color:#f1c40f;' : ''}">
                            </div>
                        </td>
                        <td class="text-right" style="font-weight:600;">${this.formatRupiah(item.total)}</td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        });

        this.updateSummary(grandTotalBase);
        this.renderBOM(items); // Panggil fungsi BOM agar material muncul
    },

    // --- UPDATE SUMMARY (SUBTOTAL, JASA, GRAND TOTAL) ---
    updateSummary: function(subtotal) {
        const modeInput = document.getElementById('inp_execution_mode');
        const mode = modeInput ? modeInput.value : 'kontraktor_pro';
        
        let jasaPerc = 0.10;
        if (mode === 'borongan_hemat') jasaPerc = 0.05;
        else if (mode === 'kontraktor_pro') jasaPerc = 0.12;
        
        const jasaValue = subtotal * jasaPerc;
        const grandTotal = subtotal + jasaValue;

        // Helper aman untuk set text
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

    // --- RENDER BOM (KEBUTUHAN MATERIAL) ---
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

        // Cari atau Buat Container BOM
        let container = document.getElementById('bom-section');
        if (!container) {
            const resArea = document.getElementById('result-area');
            if(resArea && resArea.parentNode) {
                container = document.createElement('div');
                container.id = 'bom-section';
                resArea.parentNode.insertBefore(container, resArea.nextSibling);
            } else return;
        }

        if (Object.keys(BOM).length === 0) {
            container.innerHTML = `<div style="padding:15px; color:#999; text-align:center;"><i>Belum ada estimasi material.</i></div>`;
            return;
        }

        let html = `
            <div style="margin-top:20px; padding:15px; background:white; border:1px solid #eee; border-radius:8px;">
                <h3 style="margin-top:0; color:#2c3e50; border-bottom:2px solid #3498db; padding-bottom:10px;">📦 Estimasi Material</h3>
                <table style="width:100%; border-collapse:collapse; margin-top:10px;">
                    <thead style="background:#f8f9fa;">
                        <tr><th style="padding:8px; text-align:left;">Material</th><th style="text-align:right;">Jumlah</th><th style="text-align:center;">Unit</th></tr>
                    </thead><tbody>`;
        
        Object.keys(BOM).sort().forEach(name => {
            const d = BOM[name];
            if (d.total > 0.01) {
                html += `<tr>
                    <td style="padding:6px; border-bottom:1px solid #f1f1f1;">${name}</td>
                    <td style="text-align:right; padding:6px; font-weight:bold; color:#2980b9;">
                        ${(Math.ceil(d.total*100)/100).toLocaleString('id-ID')}
                    </td>
                    <td style="padding:6px; text-align:center; color:#666;">${d.unit}</td>
                </tr>`;
            }
        });
        html += `</tbody></table></div>`;
        container.innerHTML = html;
    },

    // --- CHECK BUDGET WARNING ---
    checkBudgetUI: function(grandTotal) {
        const targetEl = document.getElementById('inp_target_budget');
        const alertBox = document.getElementById('budget-alert-box');
        
        if (targetEl && alertBox) {
            const target = parseFloat(targetEl.value) || 0;
            if (target > 0) {
                const diff = target - grandTotal;
                alertBox.style.display = 'block';
                if (diff >= 0) {
                    alertBox.className = 'budget-alert';
                    alertBox.innerHTML = `✅ <b>AMAN:</b> Sisa Rp ${this.formatRupiah(diff)}`;
                    alertBox.style.background = "#d4edda"; alertBox.style.color = "#155724";
                } else {
                    alertBox.className = 'budget-alert';
                    alertBox.innerHTML = `⚠️ <b>DEFISIT:</b> Kurang Rp ${this.formatRupiah(Math.abs(diff))}`;
                    alertBox.style.background = "#f8d7da"; alertBox.style.color = "#721c24";
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
        if (n.includes('besi')) return 'Batang';
        if (n.includes('keramik') || n.includes('granit')) return 'Dus';
        return 'Sat';
    }
};

// --- GLOBAL ALIASES (Penting agar bisa dipanggil dari HTML) ---
window.renderTable = function() { window.UIRenderer.renderTable(window.ACTIVE_ITEMS); };
window.toggleCollapse = function(id) { window.UIRenderer.toggleCollapse(id); };

console.log("✅ UI Renderer V18.5 (Fixed & Complete) Loaded.");
