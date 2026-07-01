/* ===================================================
   FENIX ADMIN — Supabase
=================================================== */

const SUPABASE_URL = 'https://mecicdtcofqdleoplqed.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7Nh_oq9MDKCOxkP8PDbQyg_s7JeDE-4';
const PASS        = 'fenix2025'; // ← cambiá esta contraseña

// Init Supabase client (CDN loaded in HTML)
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ===== CATEGORÍAS ===== */
const CATS = [
  { key:'gorras',          label:'Gorras',         icon:'🧢', isDama:false },
  { key:'relojes',         label:'Relojes',         icon:'⌚', isDama:false },
  { key:'gafas',           label:'Gafas',           icon:'🕶️', isDama:false },
  { key:'camisetas',       label:'Camisetas',       icon:'👕', isDama:false },
  { key:'busos',           label:'Busos',           icon:'🧥', isDama:false },
  { key:'canguros',        label:'Canguros',        icon:'🦘', isDama:false },
  { key:'jeans',           label:'Jeans',           icon:'👖', isDama:false },
  { key:'mochos',          label:'Mochos',          icon:'🩳', isDama:false },
  { key:'pantalonetas',    label:'Pantalonetas',    icon:'🏃', isDama:false },
  { key:'polos',           label:'Polos',           icon:'👔', isDama:false },
  { key:'conjuntos',       label:'Conjuntos',       icon:'🤝', isDama:false },
  { key:'correas',         label:'Correas',         icon:'🪡', isDama:false },
  { key:'morrales',        label:'Morrales',        icon:'🎒', isDama:false },
  { key:'carrieles',       label:'Carrieles',       icon:'🧳', isDama:false },
  { key:'pulseras',        label:'Pulseras',        icon:'💎', isDama:false },
  { key:'billeteras',      label:'Billeteras',      icon:'👛', isDama:false },
  { key:'perfumes',        label:'Perfumes',        icon:'🌿', isDama:false },
  { key:'relojes-dama',    label:'Relojes Dama',    icon:'⌚', isDama:true  },
  { key:'gafas-dama',      label:'Gafas Dama',      icon:'🕶️', isDama:true  },
  { key:'busos-dama',      label:'Busos Dama',      icon:'🧥', isDama:true  },
  { key:'bolsos',          label:'Bolsos',          icon:'👜', isDama:true  },
  { key:'correas-dama',    label:'Correas Dama',    icon:'🪡', isDama:true  },
  { key:'perfumes-dama',   label:'Perfumes Dama',   icon:'🌸', isDama:true  },
  { key:'billeteras-dama', label:'Billeteras Dama', icon:'👛', isDama:true  },
];

/* ===== STATE ===== */
let allProducts = [];
let editingId   = null;
let currentImgFile = null;

/* ===== UTILS ===== */
function catInfo(key) { return CATS.find(c => c.key === key) || {}; }

function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `admin-toast ${type}`;
  el.textContent = msg;
  document.getElementById('adminToasts').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? 'Guardando...' : 'Guardar producto';
}

/* ===== LOGIN ===== */
document.getElementById('loginBtn').addEventListener('click', doLogin);
document.getElementById('loginPass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

function doLogin() {
  if (document.getElementById('loginPass').value === PASS) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminWrap').classList.remove('hidden');
    initAdmin();
  } else {
    document.getElementById('loginError').textContent = 'Contraseña incorrecta';
    document.getElementById('loginPass').value = '';
  }
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('adminWrap').classList.add('hidden');
  document.getElementById('loginPass').value = '';
});

/* ===== INIT ===== */
async function initAdmin() {
  populateCatSelects();
  await loadProducts();
  renderCatGrid();
}

/* ===== NAV ===== */
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + btn.dataset.view).classList.add('active');
    if (btn.dataset.view === 'categorias') renderCatGrid();
  });
});

/* ===== POPULATE SELECTS ===== */
function populateCatSelects() {
  [document.getElementById('filterCat'), document.getElementById('pCat')].forEach(sel => {
    if (!sel) return;
    CATS.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.key;
      opt.textContent = `${c.icon} ${c.label}${c.isDama ? ' (Dama)' : ''}`;
      sel.appendChild(opt);
    });
  });
}

/* ===== LOAD PRODUCTS FROM SUPABASE ===== */
async function loadProducts() {
  document.getElementById('productTableBody').innerHTML = `
    <tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--gray);
    font-family:var(--font-mono);font-size:0.6rem;letter-spacing:2px;">Cargando...</td></tr>`;

  const { data, error } = await sb
    .from('productos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { toast('Error cargando productos: ' + error.message, 'error'); return; }

  allProducts = data || [];
  renderTable();
}

/* ===== RENDER TABLE ===== */
function renderTable() {
  const tbody     = document.getElementById('productTableBody');
  const empty     = document.getElementById('tableEmpty');
  const catFilter = document.getElementById('filterCat').value;
  const search    = document.getElementById('filterSearch').value.toLowerCase();

  const filtered = allProducts.filter(p => {
    const matchCat  = !catFilter || p.categoria === catFilter;
    const matchName = !search   || p.nombre.toLowerCase().includes(search);
    return matchCat && matchName;
  });

  tbody.innerHTML = '';
  empty.style.display = filtered.length ? 'none' : 'block';

  filtered.forEach(p => {
    const cat = catInfo(p.categoria);
    const tr  = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.imagen_url
        ? `<img class="table-thumb" src="${p.imagen_url}" alt="${p.nombre}">`
        : `<div class="table-thumb-placeholder">${cat.icon || '📦'}</div>`}
      </td>
      <td><div class="table-name">${p.nombre}</div></td>
      <td><div class="table-cat">${cat.icon || ''} ${cat.label || p.categoria}</div></td>
      <td><div class="table-price">${p.precio}</div></td>
      <td><div class="table-sizes">${p.tallas?.join(', ') || '—'}</div></td>
      <td>${p.badge ? `<span class="table-badge">${p.badge}</span>` : '—'}</td>
      <td>
        <div class="table-actions">
          <button class="btn-edit"   data-id="${p.id}">Editar</button>
          <button class="btn-danger" data-id="${p.id}">Eliminar</button>
        </div>
      </td>`;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', () => openEdit(b.dataset.id)));
  tbody.querySelectorAll('.btn-danger').forEach(b => b.addEventListener('click', () => deleteProduct(b.dataset.id)));
}

document.getElementById('filterCat').addEventListener('change', renderTable);
document.getElementById('filterSearch').addEventListener('input', renderTable);

/* ===== RENDER CAT GRID ===== */
function renderCatGrid() {
  document.getElementById('catGrid').innerHTML = CATS.map(c => {
    const count = allProducts.filter(p => p.categoria === c.key).length;
    return `<div class="cat-stat-card">
      <span class="cat-stat-icon">${c.icon}</span>
      <div class="cat-stat-name">${c.label}</div>
      <div class="cat-stat-count">${count} producto${count !== 1 ? 's' : ''}</div>
    </div>`;
  }).join('');
}

/* ===== MODAL ===== */
document.getElementById('openAddProduct').addEventListener('click', openAdd);
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

function openAdd() {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Agregar producto';
  clearForm();
  document.getElementById('modalOverlay').classList.remove('hidden');
}

function openEdit(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = 'Editar producto';
  document.getElementById('pName').value   = p.nombre;
  document.getElementById('pPrice').value  = p.precio;
  document.getElementById('pCat').value    = p.categoria;
  document.getElementById('pBadge').value  = p.badge || '';
  document.getElementById('pWaText').value = p.wa_text || '';
  document.querySelectorAll('.sizes-check input').forEach(cb => {
    cb.checked = (p.tallas || []).includes(cb.value);
  });
  if (p.imagen_url) {
    document.getElementById('imgPreview').src = p.imagen_url;
    document.getElementById('imgPreview').classList.remove('hidden');
    document.getElementById('imgPlaceholder').classList.add('hidden');
  }
  document.getElementById('modalOverlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  clearForm();
  editingId = null;
}

function clearForm() {
  ['pName','pPrice','pWaText'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('pBadge').value = '';
  document.querySelectorAll('.sizes-check input').forEach(cb => cb.checked = false);
  document.getElementById('imgPreview').src = '';
  document.getElementById('imgPreview').classList.add('hidden');
  document.getElementById('imgPlaceholder').classList.remove('hidden');
  currentImgFile = null;
}

/* ===== IMAGE UPLOAD ===== */
document.getElementById('imgUploadArea').addEventListener('click', () => {
  document.getElementById('pImg').click();
});

document.getElementById('pImg').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  currentImgFile = file;
  const url = URL.createObjectURL(file);
  document.getElementById('imgPreview').src = url;
  document.getElementById('imgPreview').classList.remove('hidden');
  document.getElementById('imgPlaceholder').classList.add('hidden');
});

/* ===== UPLOAD IMAGE TO SUPABASE STORAGE ===== */
async function uploadImage(file) {
  const ext      = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path     = `productos/${filename}`;

  const { error } = await sb.storage.from('productos').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw new Error('Error subiendo imagen: ' + error.message);

  const { data } = sb.storage.from('productos').getPublicUrl(path);
  return data.publicUrl;
}

/* ===== SAVE PRODUCT ===== */
document.getElementById('saveProduct').addEventListener('click', async () => {
  const saveBtn = document.getElementById('saveProduct');
  const nombre  = document.getElementById('pName').value.trim();
  const precio  = document.getElementById('pPrice').value.trim();
  const catKey  = document.getElementById('pCat').value;
  const badge   = document.getElementById('pBadge').value;
  const waText  = document.getElementById('pWaText').value.trim();
  const tallas  = [...document.querySelectorAll('.sizes-check input:checked')].map(cb => cb.value);

  if (!nombre) { toast('El nombre es obligatorio', 'error'); return; }
  if (!precio) { toast('El precio es obligatorio', 'error'); return; }
  if (!catKey) { toast('Seleccioná una categoría', 'error'); return; }

  setLoading(saveBtn, true);

  try {
    // Subir imagen si hay una nueva
    let imagen_url = editingId ? allProducts.find(p => p.id === editingId)?.imagen_url || null : null;
    if (currentImgFile) {
      imagen_url = await uploadImage(currentImgFile);
    }

    const payload = {
      nombre,
      precio: precio.startsWith('$') ? precio : '$' + precio,
      categoria: catKey,
      badge:     badge || null,
      wa_text:   waText || nombre.toLowerCase(),
      tallas:    tallas.length ? tallas : null,
      is_dama:   catInfo(catKey).isDama || false,
      imagen_url,
    };

    let error;
    if (editingId) {
      ({ error } = await sb.from('productos').update(payload).eq('id', editingId));
    } else {
      ({ error } = await sb.from('productos').insert(payload));
    }

    if (error) throw new Error(error.message);

    toast(editingId ? 'Producto actualizado' : 'Producto agregado');
    closeModal();
    await loadProducts();
    renderCatGrid();

  } catch(e) {
    toast(e.message, 'error');
  } finally {
    setLoading(saveBtn, false);
  }
});

/* ===== DELETE ===== */
async function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto?')) return;

  // Eliminar imagen del storage si existe
  const prod = allProducts.find(p => p.id === id);
  if (prod?.imagen_url) {
    const path = prod.imagen_url.split('/productos/')[1];
    if (path) await sb.storage.from('productos').remove([`productos/${path}`]);
  }

  const { error } = await sb.from('productos').delete().eq('id', id);
  if (error) { toast('Error eliminando: ' + error.message, 'error'); return; }

  toast('Producto eliminado');
  await loadProducts();
  renderCatGrid();
}
