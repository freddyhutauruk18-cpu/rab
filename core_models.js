/**
 * FILE 1: CORE_MODELS.JS
 * Fungsi: Menyimpan Class Definisi, Konfigurasi Global, dan State Awal.
 * Load Priority: PERTAMA (Sebelum Engine lain)
 */

// ==========================================
// 1. DEFINISI KELAS RUANGAN (CORE DATA)
// ==========================================
class Room {
    constructor(id, name, widthMeter, heightMeter, type = 'general') {
        this.id = id;
        this.name = name;
        this.w = widthMeter; // Simpan dalam Meter
        this.h = heightMeter;
        this.x = 0; // Posisi relative (meter)
        this.y = 0;
        this.type = type; // 'bedroom', 'wc', 'living', etc.
        this.color = this.getColorByType(type);
    }

    getColorByType(type) {
        const colors = {
            bedroom: '#3498db', // Biru
            wc: '#e74c3c',      // Merah
            living: '#f1c40f',  // Kuning
            kitchen: '#e67e22', // Oranye
            garden: '#2ecc71',  // Hijau
            general: '#95a5a6'  // Abu
        };
        return colors[type] || colors.general;
    }

    // Validasi Sederhana
    isTooSmall() {
        if (this.type === 'bedroom' && (this.w < 2.5 || this.h < 2.5)) return true;
        if (this.type === 'wc' && (this.w < 1.2 || this.h < 1.2)) return true;
        return false;
    }
}

// ==========================================
// 2. GLOBAL STATE & CONFIG (FURNITURE)
// ==========================================

// Daftar perabot awal dengan posisi default (x, y) dan dimensi (w, h) dalam meter
window.FURNITURE_LIST = [
    { id: 'bed', name: 'Bed', x: 2, y: 2, w: 2, h: 2, color: '#e67e22' }, 
    { id: 'sofa', name: 'Sofa', x: 5, y: 5, w: 2.5, h: 1, color: '#9b59b6' },
    { id: 'table', name: 'Meja', x: 4, y: 4, w: 1.5, h: 1.5, color: '#f1c40f' },
    { id: 'tv', name: 'TV', x: 6, y: 2, w: 1.5, h: 0.5, color: '#2c3e50' }
];

// State Global untuk Interaksi
window.SELECTED_FURNITURE = null;
window.IS_DRAGGING_FURNITURE = false;

// Expose Class ke Global Scope
window.Room = Room;

console.log("✅ Core Models Loaded.");