/* TYPES_INDUSTRIAL.JS - Logika Spesialis Industri & Agro */

Object.assign(TYPE_MAP, {
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
        desc: "🐔 KANDANG CLOSE HOUSE: Blower fan raksasa, suhu terkontrol, dinding terpal."
    },
    'greenhouse': {
        name: "Greenhouse (Hidroponik)",
        filter: ['pertanian', 'plastik_uv', 'insect_net', 'rangka_pipa_baja', 'instalasi_hidroponik', 'lantai_sirtu'],
        skip: ['atap_genteng', 'dinding_bata', 'cat'],
        desc: "🌱 GREENHOUSE: Atap Plastik UV, Insect Net, lantai sirtu/tanah."
    }
});