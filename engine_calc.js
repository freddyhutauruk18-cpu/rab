/**
 * FILE 2: ENGINE_CALC.JS
 * Fungsi: Menangani Kalkulasi RAB, Rumus Material, dan Estimasi Biaya.
 * Load Priority: KEDUA (Setelah Core Models)
 */

const EngineCalc = {
    /**
     * Fungsi Utama Kalkulasi RAB
     * @param {Object} inputs - Data input dari UI (LB, LT, Floors, dll)
     * @param {Array} database - Array database item pekerjaan (window.DATABASE)
     */
    calculate: function(inputs, database) {
        // 1. Sanitasi Input
        const LB = parseFloat(inputs.LB) || 0;
        const LT = parseFloat(inputs.LT) || 0;
        const floors = parseFloat(inputs.floors) || 1;
        
        // 2. Smart Logic: Menghitung Variabel Turunan (Context V)
        // Rumus estimasi keliling & luas dinding berdasarkan Luas Bangunan
        const width = Math.sqrt(LB / 2); 
        const length = width * 2;
        const est_KLL = 2 * (length + width);
        const est_KM_Count = Math.max(1, floors); 
        const tinggi_plafon = 3.5;
        const est_Wall_Area = (est_KLL * tinggi_plafon * floors) * 0.85; // Faktor bukaan 15%

        // Objek Context 'V' yang akan dibaca oleh rumus di Database
        const V = {
            LB: LB,
            LT: LT,
            inp_floors: floors,
            KLL: est_KLL,
            KM: est_KM_Count,
            L_Dinding: est_Wall_Area,
            Math: Math 
        };

        let rab_detail = [];
        let grand_total = 0;
        let summary_div = {};

        // 3. Looping Database & Eksekusi Rumus
        if(database && Array.isArray(database)) {
            database.forEach(item => {
                let volume = 0;

                // Jika rumus berupa string (evaluasi dinamis)
                if (typeof item.formula === 'string') {
                    try {
                        // Membuat fungsi anonim untuk mengeksekusi rumus string aman
                        const formulaFunc = new Function("V", "Math", "return " + item.formula);
                        volume = formulaFunc(V, Math);
                    } catch (e) {
                        console.warn(`⚠️ Error Rumus pada item: ${item.name}`, e);
                        volume = 0;
                    }
                } else {
                    // Jika rumus sudah berupa angka pasti
                    volume = parseFloat(item.formula) || 0;
                }

                volume = Math.max(0, parseFloat(volume.toFixed(3)));
                
                // Hitung Harga
                const unit_price = (item.hsp_mat || 0) + (item.hsp_upah || 0);
                const total_price = volume * unit_price;

                if (volume > 0) {
                    grand_total += total_price;
                    
                    // Masukkan ke detail RAB
                    rab_detail.push({
                        code: item.code,
                        category: item.category || item.divName || "Umum",
                        name: item.name,
                        vol: volume,
                        sat: item.sat,
                        price: unit_price,
                        total: total_price,
                        tags: item.tags || []
                    });

                    // Update Summary per Divisi
                    const divName = item.category || item.divName || "Lain-lain";
                    if (!summary_div[divName]) summary_div[divName] = 0;
                    summary_div[divName] += total_price;
                }
            });
        }

        return {
            details: rab_detail,
            total: grand_total,
            summary: summary_div
        };
    },

    /**
     * Wrapper Generate RAB (Support Filter Grade/Kualitas)
     * Digunakan untuk kompatibilitas dengan Controller lama
     */
    generateRAB: function(typeConfig, inputData, database) {
        const result = this.calculate(inputData, database);
        
        // Di sini kita bisa tambahkan logika filter Grade (Standard/Luxury) 
        // jika nanti diperlukan pengembangan lebih lanjut.
        // Untuk saat ini, kita kembalikan hasil perhitungan standar.
        return result.details;
    },

    // Helper: Format Rupiah
    formatRupiah: function(number) {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    }
};

// Expose ke Global sebagai 'Engine' (Agar kompatibel dengan kode lama yang memanggil Engine.calculate)
window.Engine = EngineCalc;

console.log("✅ Engine Calculation Loaded.");