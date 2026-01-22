/* TYPES_HOUSING.JS - Versi Ekspansi 55 Item (Full Coverage + Logic Protection) */

Object.assign(TYPE_MAP, {
    // ==========================================
    // 1. EKONOMIS & SUBSIDI (8 Item)
    // ==========================================
    'rumah_subsidi_30': {
        name: "Rumah Subsidi Type 30 (FLPP)",
        multiplier: 0.85, 
        filter: ['grade:eco', 'subsidi', 'batako', 'keramik_40x40', 'wc_jongkok', 'pintu_double_triplex', 'listrik_900va', 'mandatory'],
        skip: ['grade:lux', 'grade:std', 'bata_merah', 'granit', 'plafon_gypsum', 'taman', 'pagar', 'carport'],
        desc: "🏠 SUBSIDI FLPP: Spek minimalis pemerintah. Batako, keramik polos, tanpa pagar."
    },
    'rumah_subsidi_36': {
        name: "Rumah Subsidi Type 36",
        multiplier: 0.90,
        filter: ['grade:eco', 'subsidi', 'bata_ringan', 'keramik_40x40', 'wc_jongkok', 'kusen_aluminium_ekonomis', 'mandatory'],
        skip: ['grade:lux', 'granit', 'plafon_gypsum_drop', 'pagar_besi', 'kitchen_set'],
        desc: "🏠 SUBSIDI TYPE 36: Bata ringan, kusen aluminium, ada sisa tanah belakang."
    },
    'rumah_rishta': {
        name: "Rumah RISHA (Instan Tahan Gempa)",
        multiplier: 0.95,
        filter: ['risha', 'panel_beton', 'modul_baut', 'cepat_bangun', 'tahan_gempa', 'grade:std', 'mandatory'],
        skip: ['bata_merah', 'kolom_cor_konvensional', 'plester_aci_tebal'],
        desc: "🧩 RISHA: Panel beton modular (PU), pengerjaan kilat & tahan gempa."
    },
    'temporary': {
        name: "Bedeng / Bangunan Sementara",
        multiplier: 0.60,
        filter: ['grade:eco', 'temporary', 'plywood', 'kayu_kasau', 'seng_gelombang', 'lantai_plester', 'mandatory'],
        skip: ['pondasi_batu_kali', 'keramik', 'plafon', 'cat_premium', 'pagar'],
        desc: "⛺ BEDENG PROYEK: Triplek/GRC, lantai plester, mudah bongkar."
    },
    'fungsional': {
        name: "Bangunan Fungsional (Tumbuh)",
        multiplier: 0.80,
        filter: ['grade:eco', 'structural_repair', 'batako', 'beton_ekspos', 'atap_spandek', 'mandatory'],
        skip: ['grade:lux', 'wallpaper', 'kitchen_set', 'profil_dinding', 'taman'],
        desc: "🍃 RUMAH TUMBUH: Struktur utama berdiri, atap tertutup, finishing minimal."
    },
    'rumah_panggung_kayu': {
        name: "Rumah Panggung (Kayu Tradisional)",
        multiplier: 1.1,
        filter: ['wood_structure', 'tiang_kayu_uud', 'papan_kayu', 'atap_rumbia_seng', 'umpak_beton'],
        skip: ['bata_merah', 'beton_bertulang', 'keramik_granit', 'pondasi_batu_kali', 'kolom_beton', 'balok_beton'],
        desc: "🪵 RUMAH PANGGUNG: Struktur kayu keras, pondasi umpak, sirkulasi udara bawah."
    },
    'rumah_kayu_log': {
        name: "Rumah Kayu / Log House",
        multiplier: 1.5,
        filter: ['kayu_ulex', 'atap_sirap', 'finishing_woodstain'],
        skip: ['beton', 'bata_merah', 'keramik', 'plafon_gypsum', 'kolom_beton', 'pondasi_batu_kali', 'plester', 'aci'],
        desc: "🪵 RUMAH KAYU: Struktur full kayu log, finishing woodstain premium."
    },
    'mess_karyawan_eco': {
        name: "Mess Karyawan (Ekonomis)",
        multiplier: 0.82,
        filter: ['grade:eco', 'sharing_bathroom', 'ranjang_susun', 'ventilasi_atas'],
        skip: ['finishing_mewah', 'plafon_drop'],
        desc: "🛏️ MESS ECO: Kapasitas maksimal, material awet, biaya rendah."
    },
    'bedeng_semi_permanen': {
        name: "Bedeng Semi-Permanen (Bata ½)",
        multiplier: 0.75,
        filter: ['grade:eco', 'bata_setengah', 'rangka_kayu', 'seng'],
        skip: ['struktur_beton_sni', 'pondasi_bor_pile'],
        desc: "🏚️ SEMI-PERMANEN: Dinding bata tanpa kolom beton utama."
    },

    // ==========================================
    // 2. HUNIAN STANDAR & CLUSTER (8 Item)
    // ==========================================
    'rumah_type_45': {
        name: "Rumah Type 45 (Cluster)",
        multiplier: 1.2,
        filter: ['grade:std', 'bata_merah', 'granit_60x60', 'wc_duduk', 'plafon_gypsum_rata', 'carport_rabat', 'mandatory'],
        skip: ['grade:eco', 'grade:lux', 'batako', 'marmer'],
        desc: "🏡 TYPE 45 CLUSTER: Bata merah, lantai granit 60x60, sanitair duduk."
    },
    'rumah_type_60': {
        name: "Rumah Type 60 (Standard)",
        multiplier: 1.3,
        filter: ['grade:std', 'ruang_keluarga_luas', 'bata_ringan', 'atap_genteng_flat'],
        skip: ['batako'],
        desc: "🏡 TYPE 60: Lebih luas, finishing cat interior premium."
    },
    'rumah_2_lantai': {
        name: "Rumah 2 Lantai (Standard)",
        multiplier: 1.5,
        filter: ['grade:std', 'building:multistory', 'cakar_ayam', 'tangga_beton', 'railing_besi', 'balkon', 'toren_air_atas', 'mandatory'],
        skip: ['grade:eco', 'pondasi_batu_kali_saja'],
        desc: "🏡 2 LANTAI: Struktur beton bertingkat, tangga cor, railing hollow."
    },
    'townhouse_minimalis': {
        name: "Townhouse Minimalis",
        multiplier: 1.6,
        filter: ['grade:std', 'facade_modern', 'pintu_engsel_pivot', 'spotlight_led'],
        skip: ['taman_belakang_luas'],
        desc: "🏙️ TOWNHOUSE: Desain vertikal, efisiensi lahan, facade kaca besar."
    },
    'paviliun_belakang': {
        name: "Paviliun / Guest House Mini",
        multiplier: 1.35,
        filter: ['grade:std', 'studio_room', 'mini_pantry', 'teras_santai'],
        skip: ['carport_pribadi'],
        desc: "🏡 PAVILIUN: Satu massa bangunan terpisah, spek kamar hotel standard."
    },
    'rumah_type_70_plus': {
        name: "Rumah Type 70 (Double Facade)",
        multiplier: 1.4,
        filter: ['grade:std', 'dua_muka', 'pagar_keliling', 'taman_dalam'],
        desc: "🏡 TYPE 70: Desain mewah standar dengan sirkulasi udara silang."
    },
    'home_office_soho': {
        name: "SOHO (Small Office Home Office)",
        multiplier: 1.55,
        filter: ['grade:std', 'open_plan', 'banyak_colokan', 'lan_cable_ready', 'pintu_akses_pisah'],
        desc: "🏢 SOHO: Lantai 1 kantor, lantai 2 hunian. Struktur beban kantor."
    },
    'villa_kayu_modern': {
        name: "Villa Kayu Modern (Exotic)",
        multiplier: 1.7,
        filter: ['wood_luxury', 'kaca_tempered', 'atap_shingles', 'decking_outdoor'],
        skip: ['beton_ekspos_kasar', 'batako', 'pagar_beton_precast'],
        desc: "🪵 VILLA KAYU: Perpaduan struktur kayu jati/ulin dengan kaca lebar."
    },

    // ==========================================
    // 3. MEWAH & SULTAN (7 Item)
    // ==========================================
    'rumah_mewah': {
        name: "Rumah Mewah / Sultan",
        multiplier: 2.8,
        filter: ['grade:lux', 'marmer_slab', 'granit_100x100', 'kolam_renang', 'smart_home', 'solar_heater', 'sanitair_toto_premium', 'mandatory'],
        skip: ['grade:eco', 'batako', 'asbes', 'keramik_murah'],
        desc: "💎 SULTAN MODE: Full Marmer, Kolam Renang, Smart Home & Sanitair Premium."
    },
    'mansion_klasik': {
        name: "Mansion Gaya Eropa Klasik",
        multiplier: 3.2,
        filter: ['grade:lux', 'pilar_corinthian', 'profil_gypsum_rumit', 'cat_wash', 'lantai_mozaik'],
        skip: ['minimalis', 'atap_spandek'],
        desc: "🏛️ MANSION KLASIK: Banyak ukiran profil, pilar besar, dan tangga melingkar grand."
    },
    'penthouse_custom': {
        name: "Penthouse (Top Floor)",
        multiplier: 4.0,
        filter: ['grade:lux', 'high_ceiling', 'private_lift', 'kaca_curtain_wall', 'view_360'],
        desc: "🏙️ PENTHOUSE: Spesifikasi tertinggi dengan tantangan logistik lantai atas."
    },
    'rumah_modern_tropis': {
        name: "Modern Tropical (Resort Style)",
        multiplier: 2.5,
        filter: ['grade:lux', 'batu_alam', 'kolam_ikan_koi', 'secondary_skin', 'taman_vertikal'],
        desc: "🌿 TROPICAL: Kayu ulin, batu alam, banyak bukaan dan area hijau."
    },
    'mediterranean_villa': {
        name: "Mediterranean Villa",
        multiplier: 2.6,
        filter: ['grade:lux', 'dinding_tekstur', 'atap_teracotta', 'lengkungan_pintu', 'courtyard'],
        desc: "🏖️ MEDITERRANEAN: Gaya Spanyol/Yunani dengan dinding tebal dan warna earth-tone."
    },
    'industrial_luxury': {
        name: "Industrial Luxury",
        multiplier: 2.3,
        filter: ['grade:lux', 'exposed_brick', 'baja_hitam', 'polished_concrete', 'lampu_gantung_desainer'],
        desc: "🏗️ INDUSTRIAL LUX: Material kasar tapi finishing high-end. Unfinished look yang mahal."
    },
    'smart_mansion': {
        name: "Ultra-Smart Mansion",
        multiplier: 3.5,
        filter: ['grade:lux', 'full_automation', 'home_cinema', 'bunker_safe', 'glass_floor'],
        desc: "🤖 SMART MANSION: Semua serba otomatis, sensor canggih, dan keamanan tingkat tinggi."
    },

    // ==========================================
    // 4. BISNIS & KOMERSIAL (10 Item)
    // ==========================================
    'kontrakan_petak': {
        name: "Kontrakan Petak (Pintu Seribu)",
        multiplier: 0.95,
        filter: ['grade:eco', 'durable', 'sekat_banyak', 'meteran_listrik_banyak', 'keramik_awet', 'cat_washable', 'mandatory'],
        skip: ['grade:lux', 'ruang_tamu_luas', 'garasi', 'taman', 'pagar_per_rumah'],
        desc: "🏘️ KONTRAKAN: Berderet efisien, token masing-masing, minim maintenance."
    },
    'kost_eksklusif': {
        name: "Kost Eksklusif / Guest House",
        multiplier: 1.8,
        filter: ['grade:lux', 'km_dalam', 'water_heater', 'ac_split', 'kunci_digital', 'lobby', 'granit', 'mandatory'],
        skip: ['grade:eco', 'jemuran_depan_kamar'],
        desc: "🏨 KOST EKSKLUSIF: Fasilitas setara hotel, water heater, AC, kunci kartu."
    },
    'ruko_2_lantai': {
        name: "Ruko 2 Lantai (Standard)",
        multiplier: 1.45,
        filter: ['grade:std', 'rolling_door', 'lantai_plong', 'kaca_display', 'parkir_beton'],
        desc: "🏪 RUKO: Area komersial bawah, hunian/gudang atas. Struktur beban hidup tinggi."
    },
    'rukan_3_lantai': {
        name: "Rukan 3 Lantai (Luxury)",
        multiplier: 1.85,
        filter: ['grade:std', 'facade_kaca_full', 'lift_barang', 'fire_alarm'],
        desc: "🏢 RUKAN: Kantor modern, facade full kaca, siap untuk bank atau kantor pro."
    },
    'kios_pasar_modern': {
        name: "Kios / Lapak Pasar Modern",
        multiplier: 1.1,
        filter: ['grade:eco', 'rolling_grille', 'listrik_kwh_kecil', 'lantai_epoxy'],
        desc: "🛒 KIOS: Ruangan kecil bersekat, rolling door, instalasi listrik simpel."
    },
    'cafe_container': {
        name: "Cafe Container (Pop-up Store)",
        multiplier: 1.2,
        filter: ['steel_structure', 'insulasi_glasswool', 'kaca_tempered', 'papan_meja_kayu'],
        skip: ['pondasi_batu_kali', 'bata_merah', 'genteng_tanah_liat'],
        desc: "🚚 CONTAINER: Modifikasi peti kemas, mobilitas tinggi, gaya industrial."
    },
    'minimarket_std': {
        name: "Minimarket (Indo/Alfa Style)",
        multiplier: 1.4,
        filter: ['grade:std', 'lantai_granit_putih', 'plafon_flat_terang', 'pintu_kaca_otomatis', 'ac_cassette'],
        desc: "🏪 MINIMARKET: Pencahayaan tinggi, lantai granit putih bersih, area parkir luas."
    },
    'gudang_distribusi': {
        name: "Gudang Distribusi (Logistik)",
        multiplier: 1.2,
        filter: ['industrial', 'atap_zincalume', 'floor_hardener', 'pintu_loading_dock'],
        desc: "🏗️ GUDANG: Atap tinggi (9m+), lantai anti retak untuk forklift."
    },
    'bengkel_pro': {
        name: "Bengkel Pro / Car Wash",
        multiplier: 1.15,
        filter: ['industrial', 'pipa_udara_kompresor', 'bak_kontrol_oli', 'atap_tinggi_ventilasi'],
        desc: "🔧 BENGKEL: Drainase khusus oli, lantai epoxy tahan bahan kimia."
    },
    'kantor_kontainer_3_tumpuk': {
        name: "Kantor Kontainer (Stacking)",
        multiplier: 1.6,
        filter: ['steel_structure', 'tangga_besi_luar', 'pondasi_pedestal', 'ac_split_banyak'],
        desc: "🏢 KANTOR SITE: Kontainer bertumpuk, efisien untuk site project besar."
    },

    // ==========================================
    // 5. INDUSTRI & AGRO (8 Item)
    // ==========================================
    'gudang_wf': {
        name: "Gudang Struktur Baja WF",
        multiplier: 1.35,
        filter: ['industrial', 'baja_wf', 'floor_hardener', 'atap_zincalume', 'peredam_panas_foil', 'pintu_besi_geser'],
        skip: ['grade:lux', 'keramik', 'plafon', 'sekat_ruangan_bata'],
        desc: "🏭 GUDANG WF: Rangka Baja Wide Flange, lantai beton hardener, atap logam."
    },
    'walet': {
        name: "Gedung Walet (Rumah Burung)",
        multiplier: 0.9,
        filter: ['walet', 'dinding_tebal', 'tanpa_jendela', 'sirip_kayu_meranti', 'kolam_pelembab', 'ventilasi_pipa', 'suara_tweeter'],
        skip: ['keramik_lantai', 'plafon_gypsum', 'cat_interior', 'lampu_terang', 'dapur', 'cat_interior', 'cat_eksterior'],
        desc: "🐦 GEDUNG WALET: Gelap, lembab, sirip kayu meranti, tanpa jendela."
    },
    'kandang_closed_house': {
        name: "Kandang Ayam (Close House)",
        multiplier: 1.1,
        filter: ['ternak', 'kawat_ram', 'terpal_otomatis', 'blower_fan', 'lantai_sekam', 'tempat_pakan_otomatis'],
        skip: ['dinding_bata_full', 'keramik', 'plafon', 'kaca', 'pondasi_batu_kali', 'cat_interior'],
        desc: "🐓 CLOSE HOUSE: Sistem kipas blower, pengatur suhu otomatis."
    },
    'pabrik_makanan_higienis': {
        name: "Pabrik Makanan (HACCP)",
        multiplier: 2.1,
        filter: ['industrial', 'stainless_drain', 'wall_coving', 'cat_epoxy_foodgrade', 'ruang_steril'],
        desc: "🍱 PABRIK MAKANAN: Standar kebersihan tinggi, sudut dinding melengkung (coving)."
    },
    'cold_storage': {
        name: "Gudang Pendingin (Cold Storage)",
        multiplier: 2.5,
        filter: ['industrial', 'panel_insulasi_pu', 'pintu_cold_storage', 'mesin_pendingin_industri'],
        desc: "❄️ COLD STORAGE: Dinding panel sandwich tebal, lantai anti-freeze."
    },
    'greenhouse_hydroponic': {
        name: "Greenhouse Hydroponic Pro",
        multiplier: 1.25,
        filter: ['agro', 'rangka_galvanis', 'plastik_uv_6th', 'insect_net', 'sistem_irigasi_tetes'],
        skip: ['keramik', 'bata_merah', 'plester', 'aci', 'cat', 'plafon'],
        desc: "🥬 GREENHOUSE: Rangka anti karat, plastik UV premium, kontrol nutrisi."
    },
    'workshop_besi': {
        name: "Workshop Las / Bubut",
        multiplier: 1.05,
        filter: ['industrial', 'listrik_3_phase', 'lantai_beton_tebal', 'hoist_crane_ready'],
        desc: "⚡ WORKSHOP: Lantai kuat getaran mesin, instalasi listrik daya besar."
    },
    'pabrik_kimia_hazard': {
        name: "Pabrik Kimia (Hazardous)",
        multiplier: 2.8,
        filter: ['industrial', 'fire_extinguisher_system', 'shower_emergency', 'lantai_acid_proof'],
        desc: "⚠️ PABRIK KIMIA: Lantai tahan asam, sistem keamanan ledakan."
    },

    // ==========================================
    // 6. SOSIAL, UMUM & RELIGI (9 Item)
    // ==========================================
    'masjid_standard': {
        name: "Masjid / Musholla Kota",
        multiplier: 1.6,
        filter: ['religious', 'kubah_enamel', 'menara', 'area_wudhu', 'karpet_turki', 'sound_system_outdoor'],
        desc: "🕌 MASJID: Ruang tanpa kolom tengah (bentang lebar), kubah dekoratif."
    },
    'gereja_modern': {
        name: "Gereja / Chapel Modern",
        multiplier: 1.7,
        filter: ['religious', 'akustik_ruangan', 'panggung_altar', 'kursi_auditorium', 'kaca_patri'],
        desc: "⛪ GEREJA: Fokus pada kualitas suara (akustik) dan pencahayaan dramatis."
    },
    'sekolah_sd_smp': {
        name: "Sekolah (Gedung Kelas)",
        multiplier: 1.3,
        filter: ['public', 'papan_tulis_kaca', 'selasar_luas', 'wc_siswa_banyak', 'kantin'],
        desc: "🏫 SEKOLAH: Koridor lebar, sirkulasi udara maksimal di tiap kelas."
    },
    'klinik_rawat_inap': {
        name: "Klinik / Puskesmas",
        multiplier: 1.8,
        filter: ['medical', 'lantai_vinyl_medis', 'wastafel_injak', 'ruang_tunggu_nyaman'],
        desc: "🏥 KLINIK: Standar dinkes, lantai tanpa nat, ruang sterilisasi."
    },
    'balai_warga_rt': {
        name: "Balai Warga / Aula Serbaguna",
        multiplier: 1.1,
        filter: ['public', 'pendopo', 'lantai_tegel_granit', 'panggung_beton'],
        desc: "🏢 BALAI WARGA: Desain terbuka/aula, biaya maintenance rendah."
    },
    'perpustakaan_daerah': {
        name: "Perpustakaan / Reading Hub",
        multiplier: 1.5,
        filter: ['public', 'rak_buku_built_in', 'pencahayaan_baca', 'area_lesehan'],
        desc: "📚 PERPUSTAKAAN: Tenang, banyak titik lampu, rak buku kapasitas berat."
    },
    'pos_satpam_cluster': {
        name: "Pos Satpam / Guard House",
        multiplier: 1.2,
        filter: ['public', 'kaca_sudut', 'meja_monitor_cctv', 'wc_petugas'],
        desc: "👮 POS JAGA: Pandangan 360 derajat, instalasi pusat CCTV."
    },
    'asrama_mahasiswa': {
        name: "Asrama / Dormitory",
        multiplier: 1.4,
        filter: ['public', 'laundry_room', 'pantry_bersama', 'kamar_mandi_luar'],
        desc: "🏢 ASRAMA: Layout kamar berulang, area komunal luas."
    },
    'laboratorium_sains': {
        name: "Laboratorium / Lab Kimia",
        multiplier: 2.2,
        filter: ['medical', 'fume_hood', 'meja_lab_tahan_zat', 'shower_dekontaminasi'],
        desc: "🧪 LAB: Meja phenolic tahan kimia, sistem pembuangan gas beracun."
    },

    // ==========================================
    // 7. HOBBY, SPORT & LIFESTYLE (5 Item)
    // ==========================================
    'lapangan_futsal_indoor': {
        name: "Lapangan Futsal Indoor",
        multiplier: 1.3,
        filter: ['sport', 'rumput_sintetis', 'jaring_pengaman', 'lampu_high_bay', 'atap_spandek_peredam'],
        desc: "⚽ FUTSAL: Bentang lebar baja WF, lantai rumput sintetis/interlock."
    },
    'gym_fitness_center': {
        name: "Gym & Fitness Center",
        multiplier: 1.7,
        filter: ['sport', 'cermin_dinding_full', 'lantai_rubber_mat', 'audio_booming', 'loker_member'],
        desc: "🏋️ GYM: Lantai tahan beban dumbbell, full cermin, AC kapasitas besar."
    },
    'kolam_renang_privat': {
        name: "Kolam Renang & Pool Deck",
        multiplier: 2.0,
        filter: ['sport', 'mozaik_pool', 'pompa_hayward', 'balancing_tank', 'batu_sukabumi'],
        desc: "🏊 POOL: Struktur beton kedap air (waterproofing), sistem sirkulasi overflow/skimmer."
    },
    'studio_musik_recording': {
        name: "Studio Musik (Soundproof)",
        multiplier: 2.4,
        filter: ['lifestyle', 'diffuser_panel', 'bass_trap', 'double_door_akustik', 'karpet_peredam'],
        desc: "🎸 STUDIO: Kedap suara total (RT60 targeted), instalasi kabel tanam."
    },
    'home_cinema_private': {
        name: "Private Home Cinema",
        multiplier: 2.7,
        filter: ['lifestyle', 'reclining_seat', 'proyektor_4k', 'plafon_bintang_fiberoptic'],
        desc: "🍿 CINEMA: Akustik dinding, pencahayaan redup otomatis, lantai bertingkat (riser)."
    }
});