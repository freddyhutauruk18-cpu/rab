/**
 * APP MODULE 3: SEARCH & MODAL (FIXED)
 */

window.openSearch = function(divId, divName) {
    window.ITEM_INDEX_TO_CHANGE = null;
    window.CURRENT_SEARCH_DIV = divId;
    
    const m = document.getElementById('searchModal');
    const title = document.getElementById('modalTitle');
    const sb = document.getElementById('searchBox');

    if(m) {
        m.style.display = 'block';
        // SAFETY CHECK: Cek apakah elemen title ada sebelum di-set
        if(title) {
            title.innerText = divName ? `Tambah: ${divName}` : "Cari Database AHSP";
        }
        if(sb) {
            sb.value = '';
            sb.focus();
        }
        doSearch('');
    } else {
        console.warn("Modal element 'searchModal' not found in HTML");
    }
};

window.openChangeItem = function(idx) {
    window.ITEM_INDEX_TO_CHANGE = idx;
    const item = window.ACTIVE_ITEMS[idx];
    
    const m = document.getElementById('searchModal');
    const title = document.getElementById('modalTitle');
    
    if(m) {
        m.style.display = 'block';
        if(title) title.innerText = `Ganti: ${item.name}`;
        doSearch('');
    }
};

function doSearch(q) {
    const resDiv = document.getElementById('searchResults');
    if(!resDiv) return;
    resDiv.innerHTML = '';
    
    if(!window.DATABASE) return;

    const term = (q||'').toLowerCase();
    
    // Filter database
    const filtered = window.DATABASE.filter(i => {
        // Jika pencarian kosong, tampilkan 20 item pertama saja
        if(term.length === 0) return true;
        return (i.name||'').toLowerCase().includes(term) || (i.code||'').toLowerCase().includes(term);
    }).slice(0, 50); // Batasi 50 hasil agar tidak berat

    if(filtered.length===0) { 
        resDiv.innerHTML = "<p style='padding:10px;text-align:center;color:#999'>Tidak ada hasil.</p>"; 
        return; 
    }

    filtered.forEach(i => {
        const div = document.createElement('div');
        div.className = 'search-item-result';
        div.style.cssText = "padding:10px; border-bottom:1px solid #eee; cursor:pointer; display:flex; justify-content:space-between;";
        
        const price = (i.hsp_mat||0) + (i.hsp_upah||0);
        const fmt = (n) => "Rp " + Math.round(n).toLocaleString('id-ID');
        
        div.innerHTML = `
            <div><b>${i.name}</b><br><small style="color:#7f8c8d">${i.code || '-'} | ${i.divName || 'Umum'}</small></div>
            <div style="font-weight:bold">${fmt(price)}</div>
        `;
        
        div.onclick = () => selectItemSearch(i, price);
        resDiv.appendChild(div);
    });
}

function selectItemSearch(item, price) {
    if(window.ITEM_INDEX_TO_CHANGE !== null) {
        // Mode Ganti Item
        const old = window.ACTIVE_ITEMS[window.ITEM_INDEX_TO_CHANGE];
        window.ACTIVE_ITEMS[window.ITEM_INDEX_TO_CHANGE] = {
            ...old,
            id: item.code, code: item.code, name: item.name, sat: item.sat,
            price: price, hsp_mat: item.hsp_mat, hsp_upah: item.hsp_upah,
            total: old.volume * price
        };
    } else {
        // Mode Tambah Item Baru
        window.ACTIVE_ITEMS.push({
            ...item, 
            divId: item.divId || 'DIV-99', 
            divName: item.divName || 'Tambahan',
            volume: 1, price: price, total: price, isAuto: false
        });
    }
    
    // Tutup Modal
    const m = document.getElementById('searchModal');
    if(m) m.style.display = 'none';
    
    // Refresh Table
    if (typeof renderAndSync === 'function') renderAndSync();
    else if (window.UIRenderer) window.UIRenderer.renderTable(window.ACTIVE_ITEMS);
    
    if(window.showToast) window.showToast("✅ Item ditambahkan", "success");
}

// Global Aliases
window.openSearchModal = window.openSearch;
window.closeSearchModal = () => { const m=document.getElementById('searchModal'); if(m) m.style.display='none'; };
window.doSearch = doSearch;
