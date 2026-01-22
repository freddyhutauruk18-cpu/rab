/**
 * FILE 4: ENGINE_FURNITURE.JS
 * Fungsi: Logika Interaktif Furniture & Integrasi Akhir Sistem.
 * Load Priority: TERAKHIR (Setelah Architect Engine)
 */

const EngineFurniture = {
    canvas: null,
    dragOffX: 0,
    dragOffY: 0,

    init: function(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        // Tambahkan Event Listener KHUSUS Furniture
        // Note: Canvas yang sama juga memiliki listener dari Architect Engine.
        // Kita menggunakan flag global 'window.IS_DRAGGING_FURNITURE' agar tidak bentrok.
        this.canvas.addEventListener('mousedown', e => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', e => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', e => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseout', e => this.handleMouseUp(e));

        // INJECTION: Override fungsi gambar di Architect Engine
        // Agar saat Architect Engine menggambar ulang (draw), dia memanggil fungsi furniture yang canggih ini
        if (window.Engine_Architect) {
            window.Engine_Architect.drawFurniture = this.drawFurnitureRenderer.bind(this);
            // Paksa gambar ulang untuk memunculkan furniture awal
            window.Engine_Architect.draw();
        }
        
        console.log("🛋️ Furniture Engine Loaded & Linked.");
    },

    // --- RENDERER (Disuntikkan ke Architect Engine) ---
    drawFurnitureRenderer: function() {
        if(!window.FURNITURE_LIST || !window.Engine_Architect) return;
        
        const ctx = window.Engine_Architect.ctx;
        const scale = window.Engine_Architect.scale;

        window.FURNITURE_LIST.forEach(item => {
            const ix = item.x * scale;
            const iy = item.y * scale;
            const iw = item.w * scale;
            const ih = item.h * scale;

            // Warna Furniture
            ctx.fillStyle = item.color;
            ctx.fillRect(ix, iy, iw, ih);
            
            // Border & Efek Seleksi
            ctx.strokeStyle = (window.SELECTED_FURNITURE === item) ? '#e74c3c' : '#34495e';
            ctx.lineWidth = (window.SELECTED_FURNITURE === item) ? 3 : 1;
            ctx.strokeRect(ix, iy, iw, ih);
            
            // Label Nama
            ctx.fillStyle = '#fff';
            ctx.font = '9px Arial';
            ctx.fillText(item.name, ix + 2, iy + 12);
        });
    },

    // --- INTERAKSI MOUSE ---
    getMousePos: function(e) {
        // Gunakan logic posisi mouse yang sama persis dengan Architect Engine agar sinkron
        if(window.Engine_Architect) {
            return window.Engine_Architect.getMousePos(e);
        }
        return { x: 0, y: 0 };
    },

    handleMouseDown: function(e) {
        const m = this.getMousePos(e);
        
        window.SELECTED_FURNITURE = null;

        // Cek apakah mouse mengklik salah satu furniture (Loop dari atas ke bawah)
        for (let i = window.FURNITURE_LIST.length - 1; i >= 0; i--) {
            const item = window.FURNITURE_LIST[i];
            
            if (m.x >= item.x && m.x <= item.x + item.w &&
                m.y >= item.y && m.y <= item.y + item.h) {
                
                // KETEMU! Set Flag Global agar Architect Engine TIDAK ikut mendrag ruangan
                window.IS_DRAGGING_FURNITURE = true;
                window.SELECTED_FURNITURE = item;
                
                // Hitung offset agar drag terasa natural (tidak snapping ke pojok kiri atas)
                this.dragOffX = m.x - item.x;
                this.dragOffY = m.y - item.y;

                // Visual Feedback
                if(e.target) e.target.style.cursor = "grabbing";
                
                // Pindahkan item ke urutan terakhir array (agar digambar paling atas/depan)
                window.FURNITURE_LIST.splice(i, 1);
                window.FURNITURE_LIST.push(item);
                
                // Redraw
                window.Engine_Architect.draw();
                
                e.stopPropagation(); // Stop event bubbling jika perlu
                return; 
            }
        }
    },

    handleMouseMove: function(e) {
        if (!window.IS_DRAGGING_FURNITURE || !window.SELECTED_FURNITURE) return;
        
        const m = this.getMousePos(e);
        
        // Update Posisi
        window.SELECTED_FURNITURE.x = m.x - this.dragOffX;
        window.SELECTED_FURNITURE.y = m.y - this.dragOffY;
        
        // Snap to Grid (Lebih halus: 0.1 meter)
        window.SELECTED_FURNITURE.x = Math.round(window.SELECTED_FURNITURE.x * 10) / 10;
        window.SELECTED_FURNITURE.y = Math.round(window.SELECTED_FURNITURE.y * 10) / 10;

        window.Engine_Architect.draw();
    },

    handleMouseUp: function(e) {
        if(window.IS_DRAGGING_FURNITURE) {
            window.IS_DRAGGING_FURNITURE = false;
            window.SELECTED_FURNITURE = null;
            if(e.target) e.target.style.cursor = "grab";
            window.Engine_Architect.draw();
        }
    }
};

// Expose & Auto Init
window.FurnitureEngine = EngineFurniture;

// Init otomatis saat file selesai dimuat, atau menunggu DOMContentLoaded di app_controller
// Untuk keamanan, kita panggil di app_controller.js atau app_init.js nantinya.
// Tapi agar aman jika diload terpisah, kita cek elemen canvas:
if(document.getElementById('canvas2d')) {
    setTimeout(() => {
        // Pastikan Architect sudah init duluan
        if(window.Engine_Architect) {
            EngineFurniture.init('canvas2d');
        }
    }, 500);
}

console.log("✅ Engine V18 Complete (Modular Split).");