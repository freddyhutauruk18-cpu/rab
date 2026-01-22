/* BUILDING_TYPES.JS - VERSI 8.1 (MODULAR GROUPING) 
   Kita pecah definisi bangunan per kategori agar mudah dikelola.
*/

// =========================================================
// GRUP 1: HUNIAN & SUBSIDI (RESIDENTIAL)
// =========================================================
const DATA_RESIDENTIAL = {
    'rumah_subsidi_30': {
        name: "Rumah Subsidi Type 30/60 (FLPP)",
        filter: ['grade:eco', 'subsidi', 'batako', 'keramik_40x40', 'wc_jongkok', 'pintu_double_triplex', 'cat_standar', 'listrik_900va'],
        skip: ['grade:lux', 'grade:std', 'bata_merah', 'granit', 'plafon_gypsum', 'taman', 'pagar', 'dapur_lengkap', 'carport'],
        desc: "🏠 TYPE 30 SUBSIDI: Spek minimalis FLPP. Dinding Batako/Hebel, lantai keramik polos."
    },
    'rumah_subsidi_36': {
        name: "Rumah Subsidi Type 36/72",
        filter: ['grade:eco', 'subsidi', 'bata_ringan', 'keramik_40x40', 'wc_jongkok', 'pintu_pabrikan', 'kusen_aluminium_ekonomis'],
        skip: ['grade:lux', 'granit', 'plafon_gypsum_drop', 'pagar_besi', 'kitchen_set'],
        desc: "🏠 TYPE 36 STANDAR: Bata ringan, kusen aluminium, tanpa dapur belakang."
    },
    'rumah_type_45': {
        name: "Rumah Type 45 (Menengah)",
        filter: ['grade:std', 'bata_merah', 'granit_60x60', 'wc_duduk', 'plafon_gypsum_rata', 'carport_rabat', 'cat_weathershield'],
        skip: ['grade:eco', 'grade:lux', 'batako', 'marmer'],
        desc: "🏡 TYPE 45 MENENGAH: Bata merah, lantai granit 60x60, sanitair duduk."
    },
    'rumah_2_lantai': {
        name: "Rumah 2 Lantai (Type 60-100)",
        filter: ['grade:std', 'building:multistory', 'cakar_ayam', 'tangga_beton', 'railing_besi', 'balkon', 'toren_air_atas'],
        skip: ['grade:eco', 'pondasi_batu_kali_saja'],
        desc: "🏡 2 LANTAI STANDARD: Struktur beton bertingkat, tangga cor, railing hollow."
    },
    'rumah_mewah': {
        name: "Rumah Mewah / Sultan (Custom)",
        filter: ['grade:lux', 'marmer_slab', 'granit_100x100', 'kolam_renang', 'smart_home', 'solar_heater', 'sanitair_toto_premium', 'kaca_tempered'],
        skip: ['grade:eco', 'batako', 'asbes', 'keramik_murah', 'cat_kiloan'],
        desc: "💎 MODE SULTAN: Full Marmer, Kolam Renang, & Sanitair Premium (Toto/Kohler)."
    },
    'kontrakan_petak': {
        name: "Kontrakan Petak (Pintu Seribu)",
        filter: ['grade:eco', 'durable', 'sekat_banyak', 'meteran_listrik_banyak', 'keramik_awet', 'cat_washable', 'asbes_atau_spandek'],
        skip: ['grade:lux', 'ruang_tamu_luas', 'garasi', 'taman', 'pagar_per_rumah'],
        desc: "🏘️ KONTRAKAN PETAK: Bangunan berderet efisien, token masing-masing."
    },
    'kost_eksklusif': {
        name: "Kost Eksklusif / Guest House",
        filter: ['grade:lux', 'grade:std', 'km_dalam', 'water_heater', 'ac_split', 'kunci_digital', 'lobby', 'granit'],
        skip: ['grade:eco', 'jemuran_depan_kamar'],
        desc: "🏨 KOST EKSKLUSIF: Fasilitas setara hotel, water heater, AC, kunci kartu."
    }
};

// =========================================================
// GRUP 2: BISNIS & KOMERSIAL (COMMERCIAL)
// =========================================================
const DATA_COMMERCIAL = {
    'ruko': {
        name: "Ruko 2-3 Lantai",
        filter: ['grade:std', 'ruko', 'rolling_door', 'folding_gate', 'facade_kaca', 'toilet_bawah_tangga', 'dak_beton'],
        skip: ['taman', 'pagar_depan', 'genteng_keramik', 'balkon_santai'],
        desc: "🏪 RUKO: Pintu Rolling Door, lantai plong, facade kaca."
    },
    'cafe_industrial': {
        name: "Coffee Shop / Cafe Industrial",
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
        name: "Hotel Budget (Pop/Amaris Style)",
        filter: ['grade:std', 'hotel', 'dinding_partisi_soundproof', 'koridor_karpet', 'kunci_rfid', 'jendela_mati'],
        skip: ['bata_merah_konvensional', 'balkon_tiap_kamar'],
        desc: "🏨 HOTEL BUDGET: Dinding partisi kedap suara, efisiensi ruang tinggi."
    },
    'mall': {
        name: "Mall / Pusat Perbelanjaan",
        filter: ['building:huge', 'grade:lux', 'escalator', 'chiller_ac', 'granit_heavy_duty', 'hydrant_box', 'basement'],
        skip: ['grade:eco', 'ruang_tidur', 'dapur_rumah'],
        desc: "🛍️ MODE MALL: Eskalator, AC Sentral, & Lantai Heavy Duty."
    }
};

// =========================================================
// GRUP 3: INDUSTRI & AGRO (INDUSTRIAL)
// =========================================================
const DATA_INDUSTRIAL = {
    'gudang_wf': {
        name: "Gudang Struktur Baja WF",
        filter: ['industrial', 'baja_wf', 'floor_hardener', 'atap_zincalume', 'peredam_panas_foil', 'pintu_besi_geser'],
        skip: ['grade:lux', 'keramik', 'plafon', 'sekat_ruangan_bata'],
        desc: "🏭 GUDANG WF: Rangka Baja Wide Flange, lantai beton hardener, atap logam."
    },
    'walet': {
        name: "Gedung Walet (Rumah Burung)",
        filter: ['walet', 'dinding_tebal', 'tanpa_jendela', 'sirip_kayu_meranti', 'kolam_pelembab', 'ventilasi_pipa', 'suara_tweeter'],
        skip: ['keramik_lantai', 'plafon_gypsum', 'cat_interior', 'lampu_terang', 'dapur'],
        desc: "🐦 GEDUNG WALET: Gelap, lembab, sirip kayu meranti, tanpa jendela."
    },
    'kandang_closed': {
        name: "Kandang Ayam (Close House)",
        filter: ['ternak', 'kawat_ram', 'terpal_otomatis', 'blower_fan', 'lantai_sekam', 'tempat_pakan_otomatis'],
        skip: ['dinding_bata_full', 'keramik', 'plafon', 'kaca'],
        desc: "🐔 KANDANG CLOSE HOUSE: Sistem blower fan, suhu terkontrol, dinding terpal."
    },
    'greenhouse': {
        name: "Greenhouse (Hidroponik)",
        filter: ['pertanian', 'plastik_uv', 'insect_net', 'rangka_pipa_baja', 'instalasi_hidroponik', 'lantai_sirtu'],
        skip: ['atap_genteng', 'dinding_bata', 'cat'],
        desc: "🌱 GREENHOUSE: Atap Plastik UV, Insect Net, lantai sirtu/tanah."
    }
};

// =========================================================
// GRUP 4: FASILITAS KHUSUS (SPECIAL)
// =========================================================
const DATA_SPECIAL = {
    'rs': {
        name: "Rumah Sakit (Medical Grade)",
        filter: ['grade:lux', 'vinyl_antibakteri', 'dinding_timbal', 'gas_medis', 'lift_pasien', 'genset_silent', 'stp_limbah_medis'],
        skip: ['grade:eco', 'karpet', 'wallpaper', 'kayu_pori'],
        desc: "🏥 MODE STERIL: Lantai Vinyl Anti-Bakteri, HEPA Filter, & Gas Medis."
    },
    'data_center': {
        name: "Data Center (Server)",
        filter: ['grade:lux', 'raised_floor', 'precision_ac', 'fire_gas_suppression', 'biometric_access', 'rak_server'],
        skip: ['jendela', 'air_panas', 'taman', 'kolam'],
        desc: "💻 MODE SERVER: Raised Floor, AC Presisi 24jam, & Anti-Api Gas."
    },
    'kitchen': {
        name: "Commercial Kitchen",
        filter: ['grade:std', 'stainless_steel', 'grease_trap', 'floor_hardener', 'exhaust_hood', 'gas_central'],
        skip: ['karpet', 'wallpaper', 'plafon_gypsum_biasa'],
        desc: "🍳 MODE DAPUR PRO: Stainless Steel, Grease Trap, & Exhaust High Power."
    },
    'jalan_beton': {
        name: "Jalan Beton (Rigid Pavement)",
        filter: ['infrastruktur', 'beton_k350', 'wiremesh_m8', 'plastik_cor', 'bekisting_jalan', 'cutting_beton'],
        skip: ['atap', 'dinding', 'keramik', 'cat'],
        desc: "🛣️ JALAN BETON: Perkerasan kaku (Rigid), Beton K-350, Wiremesh."
    }
};

// =========================================================
// PENGGABUNGAN DATA (MERGE)
// =========================================================
// Kita gabungkan semua kategori menjadi satu objek TYPE_MAP utama.
const TYPE_MAP = Object.assign({}, 
    DATA_RESIDENTIAL, 
    DATA_COMMERCIAL, 
    DATA_INDUSTRIAL, 
    DATA_SPECIAL
);