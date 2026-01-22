/* TYPES_BUSINESS.JS - Logika Spesialis Bisnis/Komersial (Update Masif) */

Object.assign(TYPE_MAP, {
    'ruko': {
        name: "Ruko 2-3 Lantai",
        filter: ['grade:std', 'ruko', 'rolling_door', 'folding_gate', 'facade_kaca', 'toilet_bawah_tangga', 'dak_beton'],
        skip: ['taman', 'pagar_depan', 'genteng_keramik', 'balkon_santai'],
        desc: "🏪 RUKO: Pintu Rolling Door, lantai plong, facade kaca lt.2."
    },
    'cafe_industrial': {
        name: "Cafe Industrial (Unfinished)",
        filter: ['industrial', 'beton_ekspos', 'acian_ekspos', 'lampu_gantung', 'kaca_besar', 'rangka_hitam', 'meja_bar'],
        skip: ['plafon_gypsum', 'wallpaper', 'profil_klasik', 'keramik_bunga'],
        desc: "☕ CAFE INDUSTRIAL: Tema unfinished, lantai semen poles, plafon ekspos."
    },
    'cafe_container': {
        name: "Cafe Container (Booth)",
        filter: ['modifikasi_container', 'insulasi_glasswool', 'decking_kayu', 'kaca_aluminium', 'booth_bar'],
        skip: ['pondasi_batu_kali', 'bata_merah', 'genteng'],
        desc: "🚚 CAFE CONTAINER: Modifikasi peti kemas, mobile & kekinian."
    },
    'hotel_budget': {
        name: "Hotel Budget (Pop/Amaris)",
        filter: ['grade:std', 'hotel', 'dinding_partisi_soundproof', 'koridor_karpet', 'kunci_rfid', 'jendela_mati'],
        skip: ['bata_merah_konvensional', 'balkon_tiap_kamar'],
        desc: "🏨 HOTEL BUDGET: Partisi kedap suara, efisiensi ruang tinggi, prefab bathroom."
    },
    'mall': {
        name: "Mall / Pusat Perbelanjaan",
        filter: ['building:huge', 'grade:lux', 'escalator', 'chiller_ac', 'granit_heavy_duty', 'hydrant_box', 'basement'],
        skip: ['grade:eco', 'ruang_tidur', 'dapur_rumah'],
        desc: "🛍️ MODE MALL: Eskalator, AC Sentral, & Lantai Heavy Duty."
    },
    'kantor_modern': {
        name: "Kantor Modern (Open Space)",
        filter: ['office', 'raised_floor', 'partisi_kaca', 'acoustic_ceiling', 'fire_sprinkler', 'lan_cabling'],
        skip: ['lemari_pakaian', 'ranjang', 'mesin_cuci'],
        desc: "🏢 KANTOR: Lantai akses (raised floor), plafon akustik, & instalasi jaringan data."
    }
});