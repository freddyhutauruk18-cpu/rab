/**
 * FILE 3: ENGINE_ARCHITECT.JS
 * Fungsi: Visualisasi Grid 100m, Rendering Ruangan, dan Logika Canvas Utama.
 * Load Priority: KETIGA (Setelah Engine Calc)
 */

const EngineArchitect = {
    canvas: null,
    ctx: null,
    rooms: [], // Array untuk menyimpan objek Room yang aktif di canvas
    scale: 20, // 1 meter = 20 pixel (Default Zoom Level)
    
    // State Interaksi Ruangan
    isDragging: false,
    selectedRoom: null,
    dragStartX: 0,
    dragStartY: 0,

    // Konfigurasi Viewport
    offsetX: 0, // Untuk fitur Pan/Geser Canvas (Horizontal)
    offsetY: 0, // Untuk fitur Pan/Geser Canvas (Vertikal)
    MAX_SIZE: 100, // Ukuran Dunia Virtual: 100m x 100m

    // --- INITIALIZATION ---
    init: function(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if(!this.canvas) {
            console.error("Canvas element not found:", canvasId);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        
        // Setup Event Listeners Dasar (untuk Ruangan)
        // Note: Event untuk Furniture akan ditangani terpisah di engine_furniture.js
        this.canvas.addEventListener('mousedown', e => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', e => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', e => this.handleMouseUp(e));
        
        console.log("🎨 Architect Engine Initialized.");
        this.draw(); // Render awal
    },

    // --- LOGIC: ROOM MANAGEMENT ---
    addRoom: function(name, w, h, type) {
        // Menggunakan Class Room dari core_models.js
        const id = 'room-' + Date.now();
        const newRoom = new window.Room(id, name, w, h, type);
        
        // Cari posisi kosong otomatis agar tidak menumpuk
        this.findEmptySpot(newRoom);
        
        this.rooms.push(newRoom);
        this.draw();
        return newRoom;
    },

    findEmptySpot: function(room) {
        let step = 0.5; // Geser per 0.5 meter
        let maxTry = 50;
        
        // Coba taruh di (0,0), kalau tabrakan geser ke kanan
        for(let i=0; i<maxTry; i++) {
            if(!this.checkCollision(room)) return; // Posisi aman ditemukan
            room.x += (room.w + step); 
        }
        // Jika baris penuh, pindah ke bawah
        room.x = 0;
        room.y += (room.h + step);
    },

    checkCollision: function(targetRoom) {
        return this.rooms.some(r => {
            if(r === targetRoom) return false;
            // Algoritma AABB (Axis-Aligned Bounding Box)
            return (targetRoom.x < r.x + r.w &&
                    targetRoom.x + targetRoom.w > r.x &&
                    targetRoom.y < r.y + r.h &&
                    targetRoom.y + targetRoom.h > r.y);
        });
    },

    optimizeLayout: function() {
        // Algoritma sederhana untuk merapikan ulang semua ruangan
        let currentX = 0;
        let currentY = 0;
        let maxHeightInRow = 0;
        
        this.rooms.forEach(r => {
            r.x = currentX;
            r.y = currentY;
            
            maxHeightInRow = Math.max(maxHeightInRow, r.h);
            currentX += r.w + 0.5; // Beri jarak 0.5m
            
            // Jika baris > 10m, pindah ke baris baru
            if (currentX > 10) {
                currentX = 0;
                currentY += maxHeightInRow + 0.5;
                maxHeightInRow = 0;
            }
        });
        this.draw();
    },

    // --- RENDERING LOOP ---
    draw: function() {
        // SAFETY CHECK: Pastikan context dan canvas ada sebelum menggambar
        if(!this.ctx || !this.canvas) return;
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // 1. Bersihkan Canvas
        this.ctx.clearRect(0, 0, w, h);
        this.ctx.fillStyle = '#fdfdfd';
        this.ctx.fillRect(0,0, w, h);

        this.ctx.save();
        
        // 2. Transformasi Viewport (Pan & Zoom center)
        const centerX = w/2 + this.offsetX;
        const centerY = h/2 + this.offsetY;
        this.ctx.translate(centerX, centerY);

        // 3. Render Layer per Layer
        this.drawGrid();        // Layer Bawah: Grid
        this.drawLandBoundary();// Layer: Batas Tanah
        this.drawRooms();       // Layer: Ruangan
        
        // Layer: Furniture (Mengambil data global dari core_models.js)
        if(typeof this.drawFurniture === 'function') { 
            this.drawFurniture(); 
        } else {
            // Fallback jika method drawFurniture belum di-load (opsional)
            this._basicDrawFurniture();
        }

        this.ctx.restore();

        // 4. Update UI Overlay (Info Panel)
        this.updateInfoPanel();
    },

    drawGrid: function() {
        const limit = this.MAX_SIZE / 2; // +/- 50m
        this.ctx.lineWidth = 0.5;
        
        for(let i = -limit; i <= limit; i++) {
            const pos = i * this.scale;
            
            // Logika ketebalan garis (10m, 5m, 1m)
            if (i % 10 === 0) {
                this.ctx.strokeStyle = '#95a5a6'; // Garis Utama (10m)
                this.ctx.lineWidth = 1;
            } else if (i % 5 === 0) {
                this.ctx.strokeStyle = '#bdc3c7'; // Garis Menengah (5m)
                this.ctx.lineWidth = 0.5;
            } else {
                this.ctx.strokeStyle = '#ecf0f1'; // Garis Detail (1m)
                this.ctx.lineWidth = 0.2;
            }

            // Garis Vertikal
            this.ctx.beginPath();
            this.ctx.moveTo(pos, -limit * this.scale);
            this.ctx.lineTo(pos, limit * this.scale);
            this.ctx.stroke();

            // Garis Horizontal
            this.ctx.beginPath();
            this.ctx.moveTo(-limit * this.scale, pos);
            this.ctx.lineTo(limit * this.scale, pos);
            this.ctx.stroke();
        }
    },

    drawRooms: function() {
        this.rooms.forEach(r => {
            const rx = r.x * this.scale;
            const ry = r.y * this.scale;
            const rw = r.w * this.scale;
            const rh = r.h * this.scale;

            // Efek Shadow jika dipilih
            if(this.selectedRoom === r) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = "rgba(0,0,0,0.2)";
            } else {
                this.ctx.shadowBlur = 0;
            }

            // Warna Ruangan
            this.ctx.fillStyle = r.color;
            this.ctx.fillRect(rx, ry, rw, rh);

            // Garis Tepi
            this.ctx.strokeStyle = '#2c3e50';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(rx, ry, rw, rh);

            // Label Teks
            this.ctx.shadowBlur = 0; // Reset shadow untuk teks
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(r.name, rx + 5, ry + 15);
            this.ctx.font = '8px Arial';
            this.ctx.fillText(`${r.w}x${r.h}m`, rx + 5, ry + 25);
            
            // Ikon Warning jika terlalu kecil
            if(r.isTooSmall()) {
                this.ctx.fillStyle = 'red';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.fillText('⚠️', rx + rw - 20, ry + 15);
            }
        });
    },

    drawLandBoundary: function() {
        // Mengambil input Luas Tanah dari HTML
        const ltElement = document.getElementById('inp_LT');
        const lt = ltElement ? parseFloat(ltElement.value) || 0 : 0;

        if (lt > 0) {
            // Visualisasi sederhana: Asumsi tanah persegi
            const sisiTanah = Math.sqrt(lt);
            const drawSize = sisiTanah * this.scale;
            
            const startX = -drawSize / 2;
            const startY = -drawSize / 2;

            this.ctx.save();
            this.ctx.setLineDash([10, 5]); // Garis putus-putus
            this.ctx.strokeStyle = "#e74c3c";
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(startX, startY, drawSize, drawSize);
            
            this.ctx.fillStyle = "#e74c3c";
            this.ctx.font = "bold 12px Arial";
            this.ctx.fillText(`Batas Tanah (${lt}m²)`, startX + 5, startY - 5);
            this.ctx.restore();
        }
    },

    // Placeholder untuk rendering furniture (akan di-override/dilengkapi oleh engine_furniture.js)
    _basicDrawFurniture: function() {
        if(window.FURNITURE_LIST) {
            window.FURNITURE_LIST.forEach(f => {
                const fx = f.x * this.scale;
                const fy = f.y * this.scale;
                this.ctx.fillStyle = f.color;
                this.ctx.fillRect(fx, fy, f.w * this.scale, f.h * this.scale);
            });
        }
    },

    updateInfoPanel: function() {
        const panel = document.getElementById('denah-info-panel');
        if (!panel) return;
        
        let totalArea = 0;
        this.rooms.forEach(r => totalArea += (r.w * r.h));
        
        const ltElement = document.getElementById('inp_LT');
        const lt = ltElement ? parseFloat(ltElement.value) || 0 : 0;
        
        // Update HTML Panel Info
        panel.innerHTML = `
            <div style="display:flex; gap:10px; font-size:0.85rem;">
                <span style="color:#2980b9;">🟦 Total Ruangan: <b>${totalArea.toFixed(1)} m²</b></span>
                <span style="color:#e67e22;">🟧 Luas Tanah: <b>${lt} m²</b></span>
            </div>
        `;
    },

    // --- INTERAKSI MOUSE UTAMA (ROOM DRAG) ---
    getMousePos: function(e) {
        // SAFETY CHECK: Cegah error jika canvas belum siap
        if (!this.canvas) return { x: 0, y: 0 };

        const rect = this.canvas.getBoundingClientRect();
        const centerX = this.canvas.width/2 + this.offsetX;
        const centerY = this.canvas.height/2 + this.offsetY;
        
        return {
            x: (e.clientX - rect.left - centerX) / this.scale,
            y: (e.clientY - rect.top - centerY) / this.scale
        };
    },

    handleMouseDown: function(e) {
        // Priority Check: Jika Furniture sedang didrag (flag dari engine_furniture), jangan proses room
        if(window.IS_DRAGGING_FURNITURE) return;

        const m = this.getMousePos(e);
        
        // Loop terbalik (atas ke bawah) untuk seleksi
        for (let i = this.rooms.length - 1; i >= 0; i--) {
            const r = this.rooms[i];
            if (m.x >= r.x && m.x <= r.x + r.w && m.y >= r.y && m.y <= r.y + r.h) {
                this.selectedRoom = r;
                this.isDragging = true;
                this.dragStartX = m.x - r.x;
                this.dragStartY = m.y - r.y;
                this.draw();
                return;
            }
        }
    },

    handleMouseMove: function(e) {
        if (!this.isDragging || !this.selectedRoom) return;
        
        const m = this.getMousePos(e);
        this.selectedRoom.x = m.x - this.dragStartX;
        this.selectedRoom.y = m.y - this.dragStartY;
        
        // Snap to Grid 0.5m
        this.selectedRoom.x = Math.round(this.selectedRoom.x * 2) / 2;
        this.selectedRoom.y = Math.round(this.selectedRoom.y * 2) / 2;
        
        this.draw();
    },

    handleMouseUp: function(e) {
        this.isDragging = false;
        this.selectedRoom = null;
        this.draw();
    }
};

// Expose ke Global
window.Engine_Architect = EngineArchitect;


console.log("✅ Engine Architect (Visualization) Loaded.");
