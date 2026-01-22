/**
 * APP MODULE 3: SEARCH & MODAL
 * Tugas: Menangani UI Modal, Pencarian Item Database, dan Seleksi.
 */

window.openSearch = function(divId, divName) {
    window.ITEM_INDEX_TO_CHANGE = null;
    window.CURRENT_SEARCH_DIV = divId;
    window.CURRENT_SEARCH_DIV_NAME = divName;
    const m = document.getElementById('searchModal');
    if(m) {
        document.getElementById('modalTitle').innerText = `Tambah: ${divName}`;
        m.style.display = 'block';
        const sb = document.getElementById('searchBox');
        if(sb) sb.value = '';
        doSearch('');
        if(sb) sb.focus();
    }
};

window.openChangeItem = function(idx) {
    window.ITEM_INDEX_TO_CHANGE = idx;
    const item = window.ACTIVE_ITEMS[idx];
    window.CURRENT_SEARCH_DIV = item.divId;
    const m = document.getElementById('searchModal');
    if(m) {
        document.getElementById('modalTitle').innerText = `Ganti: ${item.name}`;
        m.style.display = 'block';
        const sb = document.getElementById('searchBox');
        if(sb) sb.value = '';
        doSearch('');
        if(sb) sb.focus();
    }
};

function doSearch(q) {
    const resDiv = document.getElementById('searchResults');
    if(!resDiv) return;
    resDiv.innerHTML = '';
    const term = (q||'').toLowerCase();
    
    // Filter database berdasarkan divisi saat ini dan kata kunci
    const filtered = window.DATABASE.filter(i => {
        return (i.divId === window.CURRENT_SEARCH_DIV) && 
               ((i.name||'').toLowerCase().includes(term) || (i.code||'').toLowerCase().includes(term));
    });

    if(filtered.length===0) { 
        resDiv.innerHTML = "<p style='padding:10px;text-align:center;color:#999'>Tidak ada hasil.</p>"; 
        return; 
    }

    filtered.forEach(i => {
        const div = document.createElement('div');
        div.className = 'search-item-result';
        div.style = "padding:10px; border-bottom:1px solid #eee; cursor:pointer; display:flex; justify-content:space-between;";
        const fmt = window.UIRenderer ? window.UIRenderer.formatRupiah : (n)=>"Rp "+n;
        const price = (i.hsp_mat||0) + (i.hsp_upah||0);
        div.innerHTML = `<div><b>${i.name}</b><br><small style="color:#7f8c8d">${i.code}</small></div><div style="font-weight:bold">${fmt(price)}</div>`;
        div.onclick = () => selectItemSearch(i, price);
        resDiv.appendChild(div);
    });
}

function selectItemSearch(item, price) {
    if(window.ITEM_INDEX_TO_CHANGE !== null) {
        // Mode Ganti Item Existing
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
            ...item, divId: window.CURRENT_SEARCH_DIV, divName: window.CURRENT_SEARCH_DIV_NAME,
            volume: 1, price: price, total: price, isAuto: false
        });
    }
    
    // Tutup Modal
    if(window.closeModal) window.closeModal(); 
    else document.getElementById('searchModal').style.display = 'none';
    
    // Refresh Table
    if (typeof renderAndSync === 'function') renderAndSync();
}

// --- EVENT LISTENERS KHUSUS SEARCH ---
window.openSearchModal = window.openSearch;
window.openChangeItemModal = window.openChangeItem;
window.closeModal = () => document.getElementById('searchModal').style.display = 'none';

document.addEventListener('keyup', e => { if(e.target.id === 'searchBox') doSearch(e.target.value); });
window.onclick = e => { if(e.target == document.getElementById('searchModal')) window.closeModal(); };