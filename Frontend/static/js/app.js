const API = '';
let allTarjetas = [];
let catalogo = { marcas:[], modelos:[], lineas:[], colores:[] };

// "-? Auth "---------------------------------------------------------------------?
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

// "-? Helpers "------------------------------------------------------------------?
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
      title: type === 'error' ? 'Oops...' : (type === 'success' ? 'Exito!' : 'Aviso'),
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

function isVencida(fechaVencimiento) {
  if (!fechaVencimiento) return false;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fv = new Date(`${fechaVencimiento}T00:00:00`);
  return fv < hoy;
}

function badgeEstado(estado, fechaVencimiento) {
  if (estado && isVencida(fechaVencimiento)) {
    return '<span class="badge badge-yellow">Vencida</span>';
  }
  return estado
    ? '<span class="badge badge-green">Activa</span>'
    : '<span class="badge badge-red">Inactiva</span>';
}

// "-? Navegación "---------------------------------------------------------------?
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

// "-? Dashboard "----------------------------------------------------------------?
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
        <td>${r.placa||'-'}</td>
        <td>${r.propietario_nombre||'-'}</td>
        <td>${r.marca||''} ${r.linea||''}</td>
        <td>${badgeEstado(r.tarjeta_estado, r.fecha_vencimiento)}</td>
        <td>${r.fecha_vencimiento||'-'}</td>
      </tr>`).join('');
  } catch(e) { toast(e.message,'error'); }
}

// "-? Tarjetas "-----------------------------------------------------------------?
async function loadTarjetas() {
  document.getElementById('tarjetas-tbody').innerHTML = '<tr><td colspan="7" class="loader">Cargando...</td></tr>';
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
      <td>
        <strong>${r.placa||'-'}</strong>
        <small style="display:block;color:#8b949e">Historial: ${r.tarjetas_historicas||1} tarjeta(s)</small>
      </td>
      <td>
        <div>${r.propietario_nombre||'-'}</div>
        <small style="color:#8b949e">NIT: ${r.nit||'-'} | CUI: ${r.cui||'-'}</small>
      </td>
      <td>
        <div>${r.marca||'-'} ${r.linea||''}</div>
        <small style="color:#8b949e">${r.tipo||'-'} | ${r.uso||'-'} | ${r.anio||'-'} | ${r.color||'-'}</small>
      </td>
      <td>${badgeEstado(r.tarjeta_estado, r.fecha_vencimiento)}</td>
      <td>${r.fecha_vencimiento||'-'}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-sm btn-outline btn-icon" onclick="verPreview('${r.no_tarjeta}')" title="Ver tarjeta">Ver</button>
          <button class="btn btn-sm btn-outline btn-icon" onclick="modalEditar('${r.no_tarjeta}')" title="Editar">Editar</button>
          ${isVencida(r.fecha_vencimiento)
            ? `<button class="btn btn-sm btn-outline btn-icon" disabled title="No disponible: tarjeta vencida">Traspaso</button>`
            : `<button class="btn btn-sm btn-outline btn-icon" onclick="modalCambiarDueno('${r.no_tarjeta}')" title="Traspaso">Traspaso</button>`}
          ${r.tarjeta_estado
            ? `<button class="btn btn-sm btn-danger btn-icon" onclick="modalDesactivar('${r.no_tarjeta}')" title="Desactivar por impago">Impago</button>`
            : `<button class="btn btn-sm btn-success btn-icon" onclick="activar('${r.no_tarjeta}')" title="Reactivar tarjeta">Reactivar</button>`}
        </div>
      </td>
    </tr>`).join('')
    : '<tr><td colspan="7" style="text-align:center;padding:32px;color:#8b949e">Sin resultados</td></tr>';
}

document.getElementById('filter-estado').addEventListener('change', filtrar);
document.getElementById('filter-campo').addEventListener('change', filtrar);
document.getElementById('filter-buscar').addEventListener('input', filtrar);
document.getElementById('global-search').addEventListener('input', e => {
  document.getElementById('filter-buscar').value = e.target.value;
  if (allTarjetas.length) filtrar();
});

function filtrar() {
  const est = document.getElementById('filter-estado').value;
  const campo = document.getElementById('filter-campo').value;
  const q   = document.getElementById('filter-buscar').value.toLowerCase();
  let rows  = allTarjetas;
  if (est !== '') rows = rows.filter(r => String(r.tarjeta_estado)===est);
  if (q) {
    rows = rows.filter(r => {
      const data = {
        placa: r.placa,
        historial: String(r.tarjetas_historicas || 1),
        propietario: r.propietario_nombre,
        no_tarjeta: r.no_tarjeta,
        nit: r.nit,
        cui: r.cui,
        vehiculo: `${r.marca||''} ${r.linea||''} ${r.tipo||''} ${r.uso||''} ${r.color||''} ${r.anio||''}`
      };
      if (campo === 'all') {
        return Object.values(data).some(v => (v||'').toLowerCase().includes(q));
      }
      return (data[campo] || '').toLowerCase().includes(q);
    });
  }
  renderTarjetas(rows);
}

// "-? Vista previa tarjeta SAT "-------------------------------------------------?
async function verPreview(no) {
  try {
    const r = await apiFetch(`/api/tarjetas/${no}`);
    const html = `
    <div class="card" style="padding:16px">
      <h3 style="margin:0 0 12px 0">Información de Tarjeta</h3>
      <table style="width:100%;border-collapse:collapse">
        <tbody>
          <tr><td><strong>No. Tarjeta</strong></td><td>${r.no_tarjeta||'-'}</td></tr>
          <tr><td><strong>Estado</strong></td><td>${badgeEstado(r.tarjeta_estado, r.fecha_vencimiento)}</td></tr>
          <tr><td><strong>Fecha Emisión</strong></td><td>${r.fecha_emision||'-'}</td></tr>
          <tr><td><strong>Fecha Vencimiento</strong></td><td>${r.fecha_vencimiento||'-'}</td></tr>
          <tr><td><strong>Placa</strong></td><td>${r.placa||'-'}</td></tr>
          <tr><td><strong>Historial de Tarjetas</strong></td><td>${r.tarjetas_historicas||1}</td></tr>
          <tr><td><strong>Propietario</strong></td><td>${r.propietario_nombre||'-'}</td></tr>
          <tr><td><strong>NIT</strong></td><td>${r.nit||'-'}</td></tr>
          <tr><td><strong>CUI</strong></td><td>${r.cui||'-'}</td></tr>
          <tr><td><strong>Marca</strong></td><td>${r.marca||'-'}</td></tr>
          <tr><td><strong>Modelo</strong></td><td>${r.modelo||'-'}</td></tr>
          <tr><td><strong>Línea</strong></td><td>${r.linea||'-'}</td></tr>
          <tr><td><strong>Año</strong></td><td>${r.anio||'-'}</td></tr>
          <tr><td><strong>Color</strong></td><td>${r.color||'-'}</td></tr>
          <tr><td><strong>Tipo</strong></td><td>${r.tipo||'-'}</td></tr>
          <tr><td><strong>Uso</strong></td><td>${r.uso||'-'}</td></tr>
          <tr><td><strong>Motor</strong></td><td>${r.motor||'-'}</td></tr>
          <tr><td><strong>VIN</strong></td><td>${r.vin||'-'}</td></tr>
          <tr><td><strong>Chasis</strong></td><td>${r.chasis||'-'}</td></tr>
          <tr><td><strong>Serie</strong></td><td>${r.serie||'-'}</td></tr>
          <tr><td><strong>Ejes</strong></td><td>${r.ejes||'-'}</td></tr>
          <tr><td><strong>Asientos</strong></td><td>${r.asientos||'-'}</td></tr>
          <tr><td><strong>Cilindros</strong></td><td>${r.cilindros||'-'}</td></tr>
          <tr><td><strong>Cilindrada</strong></td><td>${r.cilindrada||'-'}</td></tr>
          <tr><td><strong>Peso (TON)</strong></td><td>${r.peso||'-'}</td></tr>
        </tbody>
      </table>
    </div>`;
    document.getElementById('preview-body').innerHTML = html;
    document.getElementById('preview-overlay').classList.add('open');
    document.getElementById('modal-preview').classList.add('open');
  } catch(e) { toast(e.message,'error'); }
}

// "-? Editar "-------------------------------------------------------------------?
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
            <select id="e-tipo">${['AUTOMOVIL','CAMIONETA','MOTOCICLETA','CAMION','BUS','MICROBUS','PICK UP'].map(t=>`<option ${t===r.tipo?'selected':''}>${t}</option>`).join('')}</select>
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
          <button class="btn btn-primary" onclick="guardarEdicion('${no}')">Guardar</button>
        </div>
      </div>`;
    openModal('Editar - '+no, html);
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

// "-? Cambio de dueño "----------------------------------------------------------?
function modalCambiarDueno(no) {
  const t = allTarjetas.find(x => x.no_tarjeta === no);
  if (t && isVencida(t.fecha_vencimiento)) {
    toast('No se puede realizar traspaso: la tarjeta está vencida', 'error');
    return;
  }
  openModal('Cambio de Dueño - '+no, `
    <div class="inline-form">
      <div class="form-group" style="margin-bottom:12px">
        <label>Tipo de propietario</label>
        <select id="d-tipo-propietario" onchange="toggleTipoPropietarioModal()">
          <option value="existente">Propietario existente</option>
          <option value="nuevo">Nuevo propietario</option>
        </select>
      </div>
      <div class="form-grid" style="grid-template-columns:1fr 1fr">
        <div class="form-group"><label>CUI *</label>
          <div class="input-action">
            <input id="d-cui" placeholder="3142479710901"/>
            <button id="d-btn-buscar" class="btn btn-sm btn-outline" onclick="buscarPropietarioModal()">Buscar</button>
          </div>
        </div>
        <div class="form-group"><label>NIT *</label><input id="d-nit" placeholder="117758493"/></div>
        <div class="form-group" style="grid-column:1/-1"><label>Nombre Completo *</label><input id="d-nombre" placeholder="Juan García"/></div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarCambioDueno('${no}')">Confirmar</button>
      </div>
    </div>`);
  toggleTipoPropietarioModal();
}

function toggleTipoPropietarioModal() {
  const tipo = document.getElementById('d-tipo-propietario')?.value || 'existente';
  const btnBuscar = document.getElementById('d-btn-buscar');
  if (!btnBuscar) return;
  const esNuevo = tipo === 'nuevo';
  btnBuscar.disabled = esNuevo;
  btnBuscar.title = esNuevo ? 'No aplica búsqueda para nuevo propietario' : 'Buscar';
  if (esNuevo) {
    document.getElementById('d-nit').value = '';
    document.getElementById('d-nombre').value = '';
  }
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

// "-? Desactivar / Activar "-----------------------------------------------------?
function modalDesactivar(no) {
  openModal('Desactivar - '+no, `
    <div class="inline-form">
      <p style="color:#8b949e;font-size:13px;margin-bottom:16px">Selecciona el motivo de desactivación.</p>
      <div class="form-group"><label>Motivo *</label>
        <select id="des-motivo">
          <option value="IMPAGO">&#128308; Impago</option>
          <option value="VENCIMIENTO">&#9888;&#65039; Vencimiento</option>
          <option value="OTRO">&#128203; Otro</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-danger" onclick="confirmarDesactivar('${no}')">Ys Desactivar</button>
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

// "-? Catálogos + Autocomplete "-------------------------------------------------?
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

// "-? Nueva Tarjeta "------------------------------------------------------------?
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
    toast('Tarjeta creada exitosamente o.','success');
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

// "-? Bitácora "-----------------------------------------------------------------?
async function loadRegistros() {
  const tbody = document.getElementById('registros-tbody');
  tbody.innerHTML = '<tr><td colspan="7" class="loader">Cargando...</td></tr>';
  try {
    const rows = await apiFetch('/api/registros');
    tbody.innerHTML = rows.map(r=>`
      <tr>
        <td>${r.id_registro}</td>
        <td>${r.fecha_registro}</td>
        <td>${r.hora_registro}</td>
        <td><strong>${r.placa||'-'}</strong></td>
        <td>${r.nombre_usuario||'Sistema'}</td>
        <td><small>${r.rol||'-'}</small></td>
        <td>${r.estado ? '<span class="badge badge-green">Alta/Edición</span>' : '<span class="badge badge-red">Desactivación</span>'}</td>
      </tr>`).join('');
  } catch(e) { toast(e.message,'error'); }
}

// "-? Defaults form "------------------------------------------------------------?
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





