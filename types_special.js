/* TYPES_SPECIAL.JS - Logika Spesialis Bangunan Khusus & Fasilitas Publik */

Object.assign(TYPE_MAP, {
    // ==========================================
    // GRUP 1: MEDICAL & LABORATORIUM
    // ==========================================
    'rs': {
        name: "Rumah Sakit (Medical Grade)",
        filter: ['grade:lux', 'vinyl_antibakteri', 'dinding_timbal', 'gas_medis', 'lift_pasien', 'genset_silent', 'stp_limbah_medis'],
        skip: ['grade:eco', 'karpet', 'wallpaper', 'kayu_pori'],
        desc: "🏥 MODE STERIL: Lantai Vinyl Anti-Bakteri, HEPA Filter, & Gas Medis."
    },
    'klinik_pratama': {
        name: "Klinik Pratama / Apotek",
        filter: ['grade:std', 'ruang_tunggu', 'sekat_kaca', 'wastafel_pedal', 'lantai_granit', 'penerangan_putih'],
        skip: ['dinding_timbal', 'lift_pasien'],
        desc: "🏥 KLINIK: Standar faskes tingkat pertama, ruang tunggu nyaman & higienis."
    },
    'lab_kimia': {
        name: "Laboratorium Kimia / Industri",
        filter: ['grade:lux', 'fume_hood', 'meja_acid_resistant', 'shower_emergency', 'exhaust_corrosive', 'lantai_epoxy'],
        skip: ['karpet', 'wallpaper', 'plafon_manik'],
        desc: "🧪 LAB KIMIA: Tahan asam, sistem pembuangan udara khusus & safety shower."
    },
    'ruang_rontgen': {
        name: "Ruang Radiologi (X-Ray)",
        filter: ['dinding_timbal', 'pintu_lapis_timbal', 'kaca_pb', 'tanda_bahaya_lampu', 'exhaust_lead_lined'],
        skip: ['jendela_kaca_biasa', 'pintu_kayu'],
        desc: "☢️ RADIOLOGI: Proteksi radiasi tinggi dengan lapisan timbal (Pb)."
    },

    // ==========================================
    // GRUP 2: TEKNOLOGI & KOMPUTASI
    // ==========================================
    'data_center': {
        name: "Data Center (Server)",
        filter: ['grade:lux', 'raised_floor', 'precision_ac', 'fire_gas_suppression', 'biometric_access', 'rak_server'],
        skip: ['jendela', 'air_panas', 'taman', 'kolam'],
        desc: "💻 MODE SERVER: Raised Floor, AC Presisi 24jam, & Anti-Api Gas."
    },

    // ==========================================
    // GRUP 3: OLAHRAGA & REKREASI
    // ==========================================
    'lapangan_futsal_interlock': {
        name: "Lapangan Futsal (Interlock)",
        filter: ['infrastruktur', 'lantai_interlock', 'jaring_pengaman', 'tiang_gawang', 'lampu_high_bay', 'beton_dasar'],
        skip: ['atap_genteng', 'plafon', 'ac'],
        desc: "⚽ FUTSAL: Lantai interlock polimer, jaring keliling & pencahayaan sport."
    },
    'kolam_renang_olimpik': {
        name: "Kolam Renang Olimpik",
        filter: ['beton_k350_waterproof', 'mozaik_pool', 'overflow_system', 'pompa_sand_filter', 'balancing_tank', 'start_block'],
        skip: ['atap', 'plafon', 'dinding_bata'],
        desc: "🏊 OLIMPIK: Struktur beton kedap air, sistem overflow & filterisasi industri."
    },
    'gym_center': {
        name: "Gym & Fitness Center",
        filter: ['grade:std', 'rubber_flooring', 'cermin_dinding_full', 'sound_system', 'ac_cassette', 'loker_besi'],
        skip: ['lantai_keramik_licin', 'wallpaper_kertas'],
        desc: "💪 GYM: Lantai karet (rubber) tahan beban, sirkulasi udara tinggi & cermin."
    },
    'lapangan_basket_outdoor': {
        name: "Lapangan Basket (Outdoor Vinyl)",
        filter: ['beton_k300', 'aspal_hotmix', 'cat_flexipave', 'ring_basket_hydrolik', 'tiang_lampu_hpi'],
        skip: ['atap', 'dinding'],
        desc: "🏀 BASKET: Finishing Flexipave (anti slip) & struktur beton bertulang."
    },

    // ==========================================
    // GRUP 4: PENDIDIKAN, SENI & KULINER
    // ==========================================
    'kitchen': {
        name: "Commercial Kitchen",
        filter: ['grade:std', 'stainless_steel', 'grease_trap', 'floor_hardener', 'exhaust_hood', 'gas_central'],
        skip: ['karpet', 'wallpaper', 'plafon_gypsum_biasa'],
        desc: "🍳 MODE DAPUR PRO: Stainless Steel, Grease Trap, & Exhaust High Power."
    },
    'perpustakaan_modern': {
        name: "Perpustakaan Digital",
        filter: ['grade:std', 'rak_buku_custom', 'karpet_tile', 'acoustic_panel', 'meja_baca_power', 'penerangan_warm'],
        skip: ['noise', 'vibrasi'],
        desc: "📚 PERPUSTAKAAN: Fokus pada akustik, pencahayaan baca & manajemen kabel."
    },
    'studio_musik': {
        name: "Studio Rekaman (Soundproof)",
        filter: ['grade:lux', 'rockwool_insulation', 'diffuser_acoustic', 'pintu_double_padded', 'kaca_double_glazing'],
        skip: ['jendela_biasa', 'lantai_pantul'],
        desc: "🎧 STUDIO: Kedap suara total, eliminasi gema & sistem kelistrikan bersih."
    },
    'auditorium': {
        name: "Auditorium / Aula Besar",
        filter: ['bentang_lebar', 'panggung_level', 'kursi_theater', 'lighting_stage', 'videotron', 'plafon_akustik'],
        skip: ['sekat_banyak', 'tiang_tengah'],
        desc: "🎭 AUDITORIUM: Struktur bentang lebar tanpa tiang, sistem audio & panggung."
    },

    // ==========================================
    // GRUP 5: INFRASTRUKTUR & PENUNJANG
    // ==========================================
    'jalan_beton': {
        name: "Jalan Beton (Rigid Pavement)",
        filter: ['infrastruktur', 'beton_k350', 'wiremesh_m8', 'plastik_cor', 'bekisting_jalan', 'cutting_beton'],
        skip: ['atap', 'dinding', 'keramik', 'cat'],
        desc: "🛣️ JALAN BETON: Perkerasan kaku (Rigid), Beton K-350, Wiremesh."
    },
    'parkir_gedung': {
        name: "Gedung Parkir Multi-Level",
        filter: ['beton_k350', 'ramp_ulir', 'marking_line', 'fire_sprinkler', 'exhaust_fan_basement', 'pembatas_roda'],
        skip: ['plafon', 'cat_interior_lux', 'keramik'],
        desc: "🚗 PARKIR: Struktur beton ekspos tahan beban, ramp melingkar & proteksi api."
    },
    'pos_jaga_modern': {
        name: "Pos Keamanan / Security Center",
        filter: ['grade:std', 'kaca_film', 'meja_monitor', 'kamera_cctv_central', 'toilet_petugas', 'canopy_droptoff'],
        skip: ['kamar_mandi_lux'],
        desc: "🛡️ POS JAGA: Pusat pantauan CCTV, kaca view luas & fasilitas jaga 24 jam."
    },
    'shelter_bus': {
        name: "Shelter Bus / Halte Modern",
        filter: ['struktur_baja', 'atap_galvalum', 'kursi_stainless', 'papan_informasi_led', 'lantai_difabel'],
        skip: ['dinding_full', 'pintu'],
        desc: "🚌 HALTE: Struktur baja prefabrikasi, tahan cuaca & aksesibel."
    },

    // ==========================================
    // GRUP 6: KEAGAMAAN
    // ==========================================
    'masjid_kubah_grc': {
        name: "Masjid Modern (Kubah GRC)",
        filter: ['bentang_lebar', 'kubah_grc', 'menara_baja', 'karpet_turki', 'mihrab_ukir', 'sound_outdoor_pro'],
        skip: ['sekat_kamar', 'lantai_kayu'],
        desc: "🕌 MASJID: Ornamen islami, kubah GRC ringan & sistem akustik luar-dalam."
    },
    'gereja_klasik': {
        name: "Gereja (High Ceiling)",
        filter: ['struktur_tinggi', 'kaca_patri', 'bangku_kayu_long', 'altar_marmer', 'plafon_lengkung'],
        skip: ['lantai_vinyl_warna_warni'],
        desc: "⛪ GEREJA: Langit-langit tinggi, jendela kaca seni & bangku kayu jati."
    },

    // ==========================================
    // GRUP 7: INDUSTRI KHUSUS & ENERGI
    // ==========================================
    'pabrik_makanan': {
        name: "Pabrik Makanan (HACCP Grade)",
        filter: ['grade:lux', 'pu_flooring', 'dinding_sandwich_panel', 'lampu_shatterproof', 'air_curtain', 'ruang_steril'],
        skip: ['sudut_tajam', 'keramik_nat_semen'],
        desc: "🍞 FOOD FACTORY: Standar sanitasi tinggi, dinding panel rata & lantai PU."
    },
    'stasiun_spbu': {
        name: "Stasiun Pengisian Bahan Bakar (SPBU)",
        filter: ['tanki_tanam', 'canopy_spbu', 'lantai_beton_reinforced', 'pemadam_otomatis', 'oil_separator'],
        skip: ['genteng_tanah_liat', 'plafon_gypsum'],
        desc: "⛽ SPBU: Instalasi pipa bawah tanah, kanopi lebar & sistem keamanan api."
    },
    'greenhouse_hidroponik': {
        name: "Greenhouse / Smart Farm",
        filter: ['rangka_galvanis', 'plastik_uv', 'insect_net', 'sistem_irigasi_tetes', 'sensor_suhu', 'exhaust_cooling_pad'],
        skip: ['batu_kali', 'cat_tembok'],
        desc: "🌱 GREENHOUSE: Pengaturan suhu otomatis, plastik UV & rangka anti karat."
    }
});