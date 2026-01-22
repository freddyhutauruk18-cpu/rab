/* CONFIG.JS - Database Links Configuration */

// Daftar URL Raw JSON dari Github Gist (DIV.01 s/d DIV.20)
// Pastikan urutan link ini benar agar loading data rapi.

const GIST_URLS = [
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/e6182dc89a93ef52f2dc21713b1f159b/raw/", // DIV 01 - Persiapan
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/177c8a14744cdef9f607f288de6f2d8f/raw/", // DIV 02 - Tanah
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/6824a64a719fbbef4ef6c8aceb00e170/raw/", // DIV 03 - Pondasi
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/625f84063aef62a1472b6d5a0444e068/raw/", // DIV 04 - Beton Struktur
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/a2096f06bae7fb59f625294ebdb7aff9/raw/", // DIV 05 - Dinding
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/5450b6eda97cdb7317c4857391d16031/raw/", // DIV 06 - Lantai
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/34138445812452cd8efb7aedb3aca70d/raw/", // DIV 07 - Rangka Atap
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/8739d7027e6e3fbb4dd849e14de3d54e/raw/", // DIV 08 - Penutup Atap
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/5d1d311f862d23522ced5e7553140c40/raw/", // DIV 09 - Plafon
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/7f176f0c66184e45fea6e8db13e8725a/raw/", // DIV 10 - Pintu Jendela
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/c9016d2c2d0475bddcf6d97c480a4dad/raw/", // DIV 11 - Kunci & Kaca
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/ba5ce3e24188664c020a8bbfb98c42bf/raw/", // DIV 12 - Pengecatan
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/36853060c6f7a11a0006701e3e10a288/raw/", // DIV 13 - Sanitair
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/bf83f871ac4e2b50402c4071635c3db1/raw/", // DIV 14 - Air Bersih/Kotor
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/e5d5d239d724fdab0ba2c6eb6ad821e1/raw/", // DIV 15 - Listrik
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/2e910630a7761681d3a040a4222af2c4/raw/", // DIV 16 - Halaman
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/99d4ab37d5617ff32e8a31d0ea94bc44/raw/", // DIV 17 - Utilitas
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/861597fd88952b789f5aed8b6cc32737/raw/", // DIV 18 - Finishing Khusus
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/0cb77cef9dd78c0ae3b0886b47f97373/raw/", // DIV 19 - Landscape
    "https://gist.githubusercontent.com/freddyhutauruk18-cpu/fabdf4436f1063fecde603f7f7cdfe33/raw/"  // DIV 20 - Besi/Baja
];