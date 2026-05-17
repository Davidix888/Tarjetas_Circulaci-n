const API = '';
let allTarjetas = [];
let catalogo = { marcas:[], modelos:[], lineas:[], colores:[] };

// ── Auth ──────────────────────────────────────────────────────────────────────
async function init() {
  try {
    const me = await apiFetch('/api/me');
    document.getElementById('user-name').textContent  = me.nombre_usuario;
    document.getElementById('user-role').textContent  = me.rol;
    document.getElementById('user-avatar').textContent = me.nombre_usuario[0].toUpperCase();
    await loadCatalogos();
    loadDashboard();
  } catch { window.location.href = '/login'; }
}

async function doLogout() {
  await fetch('/api/logout', { method:'POST', credentials:'include' });
  window.location.href = '/login';
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function apiFetch(url, opts={}) {
  const res = await fetch(API+url, { headers:{'Content-Type':'application/json'}, credentials:'include', ...opts });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
}

function toast(msg, type='info') {
  if (typeof Swal !== 'undefined') {
    const icon = type === 'error' ? 'error' : (type === 'success' ? 'success' : 'info');
    Swal.fire({
      icon: icon,
      title: type === 'error' ? 'Oops...' : (type === 'success' ? '¡Éxito!' : 'Aviso'),
      text: msg,
      timer: type === 'error' ? undefined : 3000,
      showConfirmButton: type === 'error'
    });
  } else {
    const t = document.getElementById('toast');
    if (t) {
      t.textContent = msg; t.className = 'toast show ' + type;
      setTimeout(() => t.classList.remove('show'), 3200);
    } else { alert(msg); }
  }
}

// Interceptar campos vacíos del formulario
document.addEventListener('invalid', function(e) {
  e.preventDefault();
  let fieldName = "un campo requerido";
  if (e.target.labels && e.target.labels.length > 0) {
    fieldName = e.target.labels[0].innerText.replace('*','').trim();
  } else if (e.target.previousElementSibling && e.target.previousElementSibling.tagName === 'LABEL') {
    fieldName = e.target.previousElementSibling.innerText.replace('*','').trim();
  }
  toast(`Por favor completa correctamente el campo: ${fieldName}`, 'error');
}, true);

function openModal(title, html) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('modal-detalle').classList.add('open');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.getElementById('modal-detalle').classList.remove('open');
}
function closePreview() {
  document.getElementById('preview-overlay').classList.remove('open');
  document.getElementById('modal-preview').classList.remove('open');
}

function badgeEstado(e) {
  return e ? '<span class="badge badge-green">✅ Activa</span>'
           : '<span class="badge badge-red">🚫 Inactiva</span>';
}

// ── Navegación ────────────────────────────────────────────────────────────────
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  const nav = document.getElementById('nav-'+name);
  if (nav) nav.classList.add('active');
  const titles = {dashboard:'Dashboard',tarjetas:'Tarjetas de Circulación',nueva:'Nueva Tarjeta',registros:'Bitácora'};
  document.getElementById('topbar-title').textContent = titles[name]||name;
  if (name==='dashboard') loadDashboard();
  if (name==='tarjetas')  loadTarjetas();
  if (name==='registros') loadRegistros();
}

document.querySelectorAll('.nav-item').forEach(el =>
  el.addEventListener('click', e => { 
    e.preventDefault(); 
    showView(el.dataset.view); 
    if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
  })
);
document.getElementById('toggleSidebar').addEventListener('click', () => {
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.toggle('open');
  } else {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.querySelector('.main-content').classList.toggle('expanded');
  }
});

// ── Dashboard ─────────────────────────────────────────────────────────────────
async function loadDashboard() {
  try {
    const s = await apiFetch('/api/stats');
    document.getElementById('stat-total').textContent       = s.total;
    document.getElementById('stat-activas').textContent     = s.activas;
    document.getElementById('stat-inactivas').textContent   = s.inactivas;
    document.getElementById('stat-vencidas').textContent    = s.vencidas;
    document.getElementById('stat-propietarios').textContent= s.propietarios;
    const rows = await apiFetch('/api/tarjetas');
    document.getElementById('dash-tbody').innerHTML = rows.slice(0,8).map(r=>`
      <tr>
        <td><strong>${r.no_tarjeta}</strong></td>
        <td>${r.placa||'—'}</td>
        <td>${r.propietario_nombre||'—'}</td>
        <td>${r.marca||''} ${r.linea||''}</td>
        <td>${badgeEstado(r.tarjeta_estado)}</td>
        <td>${r.fecha_vencimiento||'—'}</td>
      </tr>`).join('');
  } catch(e) { toast(e.message,'error'); }
}

// ── Tarjetas ──────────────────────────────────────────────────────────────────
async function loadTarjetas() {
  document.getElementById('tarjetas-tbody').innerHTML = '<tr><td colspan="15" class="loader">Cargando…</td></tr>';
  try {
    allTarjetas = await apiFetch('/api/tarjetas');
    renderTarjetas(allTarjetas);
  } catch(e) { toast(e.message,'error'); }
}

function renderTarjetas(rows) {
  document.getElementById('tarjetas-count').textContent = rows.length+' registros';
  document.getElementById('tarjetas-tbody').innerHTML = rows.length ? rows.map(r=>`
    <tr>
      <td><strong>${r.no_tarjeta}</strong></td>
      <td>${r.placa||'—'}</td>
      <td>${r.propietario_nombre||'—'}</td>
      <td><small>${r.nit||'—'}</small></td>
      <td><small>${r.cui||'—'}</small></td>
      <td>${r.marca||'—'}</td>
      <td>${r.linea||'—'}</td>
      <td>${r.modelo||'—'}</td>
      <td>${r.color||'—'}</td>
      <td>${r.tipo||'—'}</td>
      <td>${r.uso||'—'}</td>
      <td>${r.anio||'—'}</td>
      <td>${badgeEstado(r.tarjeta_estado)}</td>
      <td>${r.fecha_vencimiento||'—'}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-outline btn-icon" onclick="verPreview('${r.no_tarjeta}')" title="Ver tarjeta">🪪</button>
          <button class="btn btn-sm btn-outline btn-icon" onclick="modalEditar('${r.no_tarjeta}')" title="Editar">✏️</button>
          <button class="btn btn-sm btn-outline btn-icon" onclick="modalCambiarDueno('${r.no_tarjeta}')" title="Cambio dueño">👤</button>
          ${r.tarjeta_estado
            ? `<button class="btn btn-sm btn-danger btn-icon" onclick="modalDesactivar('${r.no_tarjeta}')" title="Desactivar">🚫</button>`
            : `<button class="btn btn-sm btn-success btn-icon" onclick="activar('${r.no_tarjeta}')" title="Activar">✅</button>`}
        </div>
      </td>
    </tr>`).join('')
    : '<tr><td colspan="15" style="text-align:center;padding:32px;color:#8b949e">Sin resultados</td></tr>';
}

document.getElementById('filter-estado').addEventListener('change', filtrar);
document.getElementById('filter-buscar').addEventListener('input', filtrar);
document.getElementById('global-search').addEventListener('input', e => {
  document.getElementById('filter-buscar').value = e.target.value;
  if (allTarjetas.length) filtrar();
});

function filtrar() {
  const est = document.getElementById('filter-estado').value;
  const q   = document.getElementById('filter-buscar').value.toLowerCase();
  let rows  = allTarjetas;
  if (est !== '') rows = rows.filter(r => String(r.tarjeta_estado)===est);
  if (q) rows = rows.filter(r =>
    [r.placa,r.propietario_nombre,r.no_tarjeta,r.cui,r.nit,r.marca,r.linea]
      .some(v => (v||'').toLowerCase().includes(q)));
  renderTarjetas(rows);
}

// ── Vista previa tarjeta SAT ──────────────────────────────────────────────────
async function verPreview(no) {
  try {
    const r = await apiFetch(`/api/tarjetas/${no}`);
    const html = `
    <div class="sat-card">
      <div class="sat-left">
        <div class="sat-header">
          <div class="sat-logo">⊕SAT</div>
          <h3>TARJETA DE CIRCULACIÓN</h3>
          <p>SAT - ${r.no_tarjeta}</p>
          <p>No. ${r.no_tarjeta}</p>
        </div>
        <div class="sat-row"><span class="sat-lbl">NIT:</span><span class="sat-val">${r.nit||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">CUI:</span><span class="sat-val">${r.cui||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">USO:</span><span class="sat-val">${r.uso||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">TIPO:</span><span class="sat-val">${r.tipo||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">LÍNEA:</span><span class="sat-val">${r.linea||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">CHASIS:</span><span class="sat-val">${r.chasis||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">SERIE:</span><span class="sat-val">${r.serie||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">ASIENTOS:</span><span class="sat-val">${r.asientos||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">NOMBRE:</span><span class="sat-val">${r.propietario_nombre||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">PLACA:</span><span class="sat-val"><strong>${r.placa||'—'}</strong></span></div>
        <div class="sat-row"><span class="sat-lbl">MARCA:</span><span class="sat-val">${r.marca||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">MODELO:</span><span class="sat-val">${r.anio||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">VIN:</span><span class="sat-val">${r.vin||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">MOTOR:</span><span class="sat-val">${r.motor||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">EJES:</span><span class="sat-val">${r.ejes||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">CILINDROS:</span><span class="sat-val">${r.cilindros||'—'} &nbsp; C.C.: ${r.cilindrada||'—'}</span></div>
        <div class="sat-row sat-row-wide"><span class="sat-lbl">COLOR:</span><span class="sat-val">${r.color||'—'}</span></div>
        <div class="sat-row"><span class="sat-lbl">TON:</span><span class="sat-val">${r.peso||'0'}</span></div>
        <div class="sat-sigs">
          <div class="sat-sig-line">Jefe del Registro Fiscal de<br>Vehículos - SAT</div>
          <div class="sat-sig-line">Subjefe del Departamento de<br>Tránsito de PNC</div>
        </div>
      </div>
      <div class="sat-right">
        <div class="sat-code-header">
          <div class="sat-logo">⊕SAT</div>
          <h3>CÓDIGO ÚNICO IDENTIFICADOR</h3>
          <div class="sat-code-val">${r.anio||''} - ${r.no_tarjeta} - 3</div>
          <p>Válida hasta: ${r.fecha_vencimiento||'—'}</p>
        </div>
        <div class="sat-qr">QR</div>
        <table class="sat-meta">
          <tr><td><strong>Usuario:</strong></td><td>${r.nit||'—'}</td></tr>
          <tr><td><strong>Fecha:</strong></td><td>${r.fecha_emision||'—'}</td></tr>
          <tr><td><strong>Fecha Reg.:</strong></td><td>${r.fecha_emision||'—'}</td></tr>
        </table>
        <p class="sat-legal">Acuerdo Gubernativo 134-2014 Reglamento de la Ley del Impuesto Sobre Circulación de Vehículos Terrestres, Marítimos y Aéreos. Artículo 20; Decreto 132-96 Ley de Tránsito Artículo 18 literal a); y Acuerdo Gubernativo 273-98 Reglamento de la Ley de Tránsito, Artículo 10 literal a).</p>
      </div>
    </div>`;
    document.getElementById('preview-body').innerHTML = html;
    document.getElementById('preview-overlay').classList.add('open');
    document.getElementById('modal-preview').classList.add('open');
  } catch(e) { toast(e.message,'error'); }
}

// ── Editar ────────────────────────────────────────────────────────────────────
async function modalEditar(no) {
  try {
    const r = await apiFetch(`/api/tarjetas/${no}`);
    const html = `
      <div class="inline-form">
        <div class="form-grid" style="grid-template-columns:1fr 1fr">
          <div class="form-group"><label>Motor</label><input id="e-motor" value="${r.motor||''}"/></div>
          <div class="form-group"><label>Color</label><input id="e-color" value="${r.color||''}"/></div>
          <div class="form-group"><label>Marca</label><input id="e-marca" value="${r.marca||''}"/></div>
          <div class="form-group"><label>Modelo</label><input id="e-modelo" value="${r.modelo||''}"/></div>
          <div class="form-group"><label>Línea</label><input id="e-linea" value="${r.linea||''}"/></div>
          <div class="form-group"><label>Tipo</label>
            <select id="e-tipo">${['AUTOMÓVIL','CAMIONETA','MOTOCICLETA','CAMIÓN','BUS','MICROBUS','PICK UP'].map(t=>`<option ${t===r.tipo?'selected':''}>${t}</option>`).join('')}</select>
          </div>
          <div class="form-group"><label>Uso</label>
            <select id="e-uso">${['PARTICULAR','COMERCIAL','OFICIAL','DIPLOMATICO'].map(u=>`<option ${u===r.uso?'selected':''}>${u}</option>`).join('')}</select>
          </div>
          <div class="form-group"><label>Cilindros</label><input type="number" id="e-cilindros" value="${r.cilindros||''}"/></div>
          <div class="form-group"><label>C.C.</label><input type="number" id="e-cilindrada" value="${r.cilindrada||''}"/></div>
          <div class="form-group"><label>Asientos</label><input type="number" id="e-asientos" value="${r.asientos||''}"/></div>
          <div class="form-group"><label>Ejes</label><input type="number" id="e-ejes" value="${r.ejes||''}"/></div>
          <div class="form-group"><label>TON</label><input type="number" id="e-peso" value="${r.peso||''}"/></div>
          <div class="form-group"><label>Vencimiento</label><input type="date" id="e-venc" value="${r.fecha_vencimiento||''}"/></div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="guardarEdicion('${no}')">💾 Guardar</button>
        </div>
      </div>`;
    openModal('Editar – '+no, html);
  } catch(e) { toast(e.message,'error'); }
}

async function guardarEdicion(no) {
  const body = {
    motor: document.getElementById('e-motor').value||null,
    color: document.getElementById('e-color').value||null,
    marca: document.getElementById('e-marca').value||null,
    modelo: document.getElementById('e-modelo').value||null,
    linea: document.getElementById('e-linea').value||null,
    tipo:  document.getElementById('e-tipo').value||null,
    uso:   document.getElementById('e-uso').value||null,
    cilindros:  document.getElementById('e-cilindros').value||null,
    cilindrada: document.getElementById('e-cilindrada').value||null,
    asientos:   document.getElementById('e-asientos').value||null,
    ejes:       document.getElementById('e-ejes').value||null,
    peso:       document.getElementById('e-peso').value||null,
    fecha_vencimiento: document.getElementById('e-venc').value||null,
  };
  try {
    await apiFetch(`/api/tarjetas/${no}`, {method:'PUT', body:JSON.stringify(body)});
    toast('Tarjeta actualizada','success'); closeModal(); loadTarjetas();
  } catch(e) { toast(e.message,'error'); }
}

// ── Cambio de dueño ───────────────────────────────────────────────────────────
function modalCambiarDueno(no) {
  openModal('Cambio de Dueño – '+no, `
    <div class="inline-form">
      <div class="form-grid" style="grid-template-columns:1fr 1fr">
        <div class="form-group"><label>CUI *</label>
          <div class="input-action">
            <input id="d-cui" placeholder="3142479710901"/>
            <button class="btn btn-sm btn-outline" onclick="buscarPropietarioModal()">Buscar</button>
          </div>
        </div>
        <div class="form-group"><label>NIT *</label><input id="d-nit" placeholder="117758493"/></div>
        <div class="form-group" style="grid-column:1/-1"><label>Nombre Completo *</label><input id="d-nombre" placeholder="Juan García"/></div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarCambioDueno('${no}')">👤 Confirmar</button>
      </div>
    </div>`);
}

async function buscarPropietarioModal() {
  const cui = document.getElementById('d-cui').value.trim();
  if (!cui) return;
  try {
    const p = await apiFetch(`/api/propietarios/${cui}`);
    document.getElementById('d-nit').value    = p.nit||'';
    document.getElementById('d-nombre').value = p.nombre||'';
    toast('Propietario encontrado','success');
  } catch { toast('No encontrado, se creará nuevo','info'); }
}

async function guardarCambioDueno(no) {
  const cui    = document.getElementById('d-cui').value.trim();
  const nit    = document.getElementById('d-nit').value.trim();
  const nombre = document.getElementById('d-nombre').value.trim();
  if (!cui||!nit||!nombre) { toast('Todos los campos son obligatorios','error'); return; }
  try {
    await apiFetch(`/api/tarjetas/${no}/cambiar-dueno`, {method:'PUT', body:JSON.stringify({cui,nit,nombre_propietario:nombre})});
    toast('Propietario actualizado','success'); closeModal(); loadTarjetas();
  } catch(e) { toast(e.message,'error'); }
}

// ── Desactivar / Activar ──────────────────────────────────────────────────────
function modalDesactivar(no) {
  openModal('Desactivar – '+no, `
    <div class="inline-form">
      <p style="color:#8b949e;font-size:13px;margin-bottom:16px">Selecciona el motivo de desactivación.</p>
      <div class="form-group"><label>Motivo *</label>
        <select id="des-motivo">
          <option value="IMPAGO">🔴 Impago</option>
          <option value="VENCIMIENTO">⚠️ Vencimiento</option>
          <option value="OTRO">📋 Otro</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-danger" onclick="confirmarDesactivar('${no}')">🚫 Desactivar</button>
      </div>
    </div>`);
}

async function confirmarDesactivar(no) {
  const motivo = document.getElementById('des-motivo').value;
  try {
    await apiFetch(`/api/tarjetas/${no}/desactivar`, {method:'PUT', body:JSON.stringify({motivo})});
    toast('Tarjeta desactivada: '+motivo,'info'); closeModal(); loadTarjetas();
  } catch(e) { toast(e.message,'error'); }
}

async function activar(no) {
  try {
    await apiFetch(`/api/tarjetas/${no}/activar`, {method:'PUT', body:JSON.stringify({})});
    toast('Tarjeta reactivada','success'); loadTarjetas();
  } catch(e) { toast(e.message,'error'); }
}

// ── Catálogos + Autocomplete ──────────────────────────────────────────────────
async function loadCatalogos() {
  const [marcas, modelos, lineas, colores] = await Promise.all([
    apiFetch('/api/catalogo/marcas'), apiFetch('/api/catalogo/modelos'),
    apiFetch('/api/catalogo/lineas'), apiFetch('/api/catalogo/colores')
  ]);
  catalogo = { marcas, modelos, lineas, colores };
}

function acFilter(tipo, q) {
  const map = { marca:'marcas', modelo:'modelos', linea:'lineas', color:'colores' };
  const key  = map[tipo];
  const field= tipo === 'color' ? 'color' : tipo;
  const list = document.getElementById('ac-'+tipo);
  if (!q) { list.classList.remove('open'); return; }
  const matches = catalogo[key].filter(i => (i[field]||'').toLowerCase().includes(q.toLowerCase())).slice(0,8);
  if (!matches.length) { list.classList.remove('open'); return; }
  list.innerHTML = matches.map(i => `<div class="ac-item" onclick="acSelect('${tipo}','${(i[field]||'').replace(/'/g,"\\'")}'')">${i[field]}</div>`).join('');
  list.classList.add('open');
}

function acSelect(tipo, val) {
  document.getElementById('n-'+tipo).value = val;
  document.getElementById('ac-'+tipo).classList.remove('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.autocomplete-wrap')) {
    document.querySelectorAll('.ac-list').forEach(l => l.classList.remove('open'));
  }
});

// ── Nueva Tarjeta ─────────────────────────────────────────────────────────────
async function buscarPropietario() {
  const cui = document.getElementById('n-cui').value.trim();
  if (!cui) return;
  try {
    const p = await apiFetch(`/api/propietarios/${cui}`);
    document.getElementById('n-nit').value              = p.nit||'';
    document.getElementById('n-nombre_propietario').value = p.nombre||'';
    toast('Propietario cargado','success');
  } catch { toast('No encontrado, se creará nuevo','info'); }
}

async function submitNuevaTarjeta(e) {
  e.preventDefault();
  const body = {
    no_tarjeta:        document.getElementById('n-no_tarjeta').value,
    fecha_emision:     document.getElementById('n-fecha_emision').value,
    anio:              document.getElementById('n-anio').value,
    fecha_vencimiento: document.getElementById('n-fecha_vencimiento').value,
    cui:               document.getElementById('n-cui').value,
    nit:               document.getElementById('n-nit').value,
    nombre_propietario:document.getElementById('n-nombre_propietario').value,
    placa:             document.getElementById('n-placa').value,
    vin:               document.getElementById('n-vin').value||null,
    chasis:            document.getElementById('n-chasis').value||null,
    serie:             document.getElementById('n-serie').value||null,
    motor:             document.getElementById('n-motor').value,
    tipo:              document.getElementById('n-tipo').value,
    uso:               document.getElementById('n-uso').value,
    ejes:              document.getElementById('n-ejes').value||null,
    asientos:          document.getElementById('n-asientos').value||null,
    cilindros:         document.getElementById('n-cilindros').value||null,
    cilindrada:        document.getElementById('n-cilindrada').value||null,
    peso:              document.getElementById('n-peso').value||null,
    marca:             document.getElementById('n-marca').value,
    modelo:            document.getElementById('n-modelo').value,
    linea:             document.getElementById('n-linea').value,
    color:             document.getElementById('n-color').value,
  };
  try {
    await apiFetch('/api/tarjetas', {method:'POST', body:JSON.stringify(body)});
    toast('Tarjeta creada exitosamente ✅','success');
    document.getElementById('form-nueva').reset();
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('n-fecha_emision').value = hoy;
    document.getElementById('n-anio').value = new Date().getFullYear();
    const ven = new Date(); ven.setFullYear(ven.getFullYear()+1);
    document.getElementById('n-fecha_vencimiento').value = ven.toISOString().split('T')[0];
    await loadCatalogos();
    showView('tarjetas');
  } catch(e) { toast(e.message,'error'); }
}

// ── Bitácora ──────────────────────────────────────────────────────────────────
async function loadRegistros() {
  const tbody = document.getElementById('registros-tbody');
  tbody.innerHTML = '<tr><td colspan="7" class="loader">Cargando…</td></tr>';
  try {
    const rows = await apiFetch('/api/registros');
    tbody.innerHTML = rows.map(r=>`
      <tr>
        <td>${r.id_registro}</td>
        <td>${r.fecha_registro}</td>
        <td>${r.hora_registro}</td>
        <td><strong>${r.placa||'—'}</strong></td>
        <td>${r.nombre_usuario||'Sistema'}</td>
        <td><small>${r.rol||'—'}</small></td>
        <td>${r.estado ? '<span class="badge badge-green">Alta/Edición</span>' : '<span class="badge badge-red">Desactivación</span>'}</td>
      </tr>`).join('');
  } catch(e) { toast(e.message,'error'); }
}

// ── Defaults form ─────────────────────────────────────────────────────────────
function setFormDefaults() {
  const hoy = new Date().toISOString().split('T')[0];
  const el1 = document.getElementById('n-fecha_emision');
  const el2 = document.getElementById('n-anio');
  const el3 = document.getElementById('n-fecha_vencimiento');
  if (el1) el1.value = hoy;
  if (el2) el2.value = new Date().getFullYear();
  if (el3) { const d=new Date(); d.setFullYear(d.getFullYear()+1); el3.value=d.toISOString().split('T')[0]; }
}

setFormDefaults();
init();
