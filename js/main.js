// JS básico inicial para interacción mínima
(function() {
  // Reemplaza clase no-js por js para estilos progresivos
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.getElementById('nav-menu');
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  if (navToggle) {
    const overlay = document.querySelector('[data-nav-overlay]');
    const openClass = 'nav-open';
    const closeMenu = (focusToggle = false) => {
      navMenu.setAttribute('data-open','false');
      navToggle.setAttribute('aria-expanded','false');
      navToggle.setAttribute('aria-label','Open navigation menu');
      navToggle.classList.remove('is-open');
      document.body.classList.remove(openClass);
      if(overlay) overlay.hidden = true;
      if(focusToggle) navToggle.focus();
    };
    const openMenu = () => {
      navMenu.setAttribute('data-open','true');
      navToggle.setAttribute('aria-expanded','true');
      navToggle.setAttribute('aria-label','Close navigation menu');
      navToggle.classList.add('is-open');
      document.body.classList.add(openClass);
      if(overlay) overlay.hidden = false;
      const firstLink = navMenu.querySelector('a');
      if(firstLink) firstLink.focus({ preventScroll:true });
    };
    const toggleMenu = () => {
      const abierto = navMenu.getAttribute('data-open') === 'true';
      abierto ? closeMenu() : openMenu();
    };
    navToggle.addEventListener('click', toggleMenu);
    if(overlay){
      overlay.addEventListener('click', () => closeMenu());
      overlay.addEventListener('touchstart', () => closeMenu(), { passive:true });
    }
    navMenu.addEventListener('click', (e) => {
      const target = e.target;
      if (target.tagName === 'A' && window.matchMedia('(max-width: 720px)').matches) {
        closeMenu();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.getAttribute('data-open') === 'true') {
        closeMenu(true);
      }
    });
    // Cerrar si se redimensiona a desktop
    window.addEventListener('resize', () => {
      if(window.matchMedia('(min-width: 721px)').matches && navMenu.getAttribute('data-open') === 'true') closeMenu();
    });
  }

  // Manejo simple del formulario (frontend demo)
  const form = document.getElementById('form-contacto');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const estado = form.querySelector('.form__estado');
      const formData = new FormData(form);
      const nombre = formData.get('nombre').toString().trim();
      const email = formData.get('email').toString().trim();
      const mensaje = formData.get('mensaje').toString().trim();

      if (!nombre || !email || !mensaje) {
        estado.textContent = 'Please fill in all fields.';
        estado.className = 'form__estado error';
        return;
      }

      // Basic email validation
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        estado.textContent = 'Invalid email address.';
        estado.className = 'form__estado error';
        return;
      }

      // Simulate submission
  setTimeout(() => {
        estado.textContent = 'Message sent (simulation). Thank you!';
        estado.className = 'form__estado ok';
        form.reset();
      }, 600);
    });
  }

  // ========== Carga dinámica de proyectos ==========
  // Cache en memoria de proyectos cargados para deep-link (hash)
  let proyectosCache = [];

  async function cargarProyectos() {
    const contenedor = document.getElementById('lista-proyectos');
    if (!contenedor) return;
    // Fallback embebido mínimo (se puede actualizar en build)
    const FALLBACK_PROJECTS = [
      {
        nombre: 'UbicaTec',
        descripcionCorta: 'Collaborative BLE platform to locate personal items privately and efficiently.',
        stack: ['BLE','IoT','Security'],
        estado: 'Exploration',
        anio: new Date().getFullYear(),
        tagline: 'Collaborative IoT network',
        destacado: true,
        repoUrl: 'https://github.com/Mariolodehf/UbicaTec',
        demoUrl: null
      }
    ];

    // Warn if opened as file:// without server
    if (location.protocol === 'file:') {
      contenedor.innerHTML = '<p style="font-size:0.85rem;opacity:.8;">To load dynamic projects, please use a local server (e.g.: <code>python3 -m http.server 8000</code>). Using embedded fallback.</p>';
      contenedor.appendChild(crearTarjeta(FALLBACK_PROJECTS[0]));
      contenedor.setAttribute('aria-busy','false');
      return;
    }
    try {
      const resp = await fetch('data/projects.json', { cache: 'no-store' });
      if (!resp.ok) throw new Error('No se pudo cargar projects.json');
  const proyectos = await resp.json();
  proyectosCache = proyectos; // guardar para búsquedas por hash
      contenedor.innerHTML = '';
      contenedor.setAttribute('aria-busy', 'false');

  proyectos.forEach(p => {
        const tarjeta = crearTarjeta(p);
        contenedor.appendChild(tarjeta);
      });

      inicializarFiltros(proyectos);

      if (!proyectos.length) {
        contenedor.innerHTML = '<p>No hay proyectos todavía.</p>';
      }
  // Intentar abrir modal si hash ya presente tras carga
  checkHashProyecto();
    } catch (err) {
      console.error(err);
      contenedor.innerHTML = '<p style="color:#f87171;">Error loading remote projects. Showing local fallback.</p>';
  const fb = FALLBACK_PROJECTS[0];
  fb.slug = fb.slug || 'fallback';
  proyectosCache = [fb];
  contenedor.appendChild(crearTarjeta(fb));
      contenedor.setAttribute('aria-busy', 'false');
  checkHashProyecto();
    }
  }

  function crearTarjeta(p) {
    const art = document.createElement('article');
    art.className = 'proyecto';
    if (p.destacado) art.dataset.destacado = 'true';
    if (p.slug) art.dataset.slug = p.slug;
    art.innerHTML = `
      <h3>${p.nombre}</h3>
      <p>${p.descripcionCorta}</p>
      <div class="proyecto-tags">
        ${Array.isArray(p.stack) ? p.stack.map(tag => `<span class=\"proyecto-tag\">${tag}</span>`).join('') : ''}
        <span class="proyecto-tag proyecto-tag--estado">${p.estado}</span>
      </div>
      <div class="proyecto-meta">
        <span>${p.anio}</span>
        ${p.tagline ? `<span>${p.tagline}</span>` : ''}
      </div>
      <div class="proyecto-links">
        ${p.repoUrl ? `<a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" aria-label="Repository for ${p.nombre}">Code</a>` : ''}
        ${p.demoUrl ? `<a href="${p.demoUrl}" target="_blank" rel="noopener noreferrer" aria-label="Demo for ${p.nombre}">Demo</a>` : ''}
      </div>`;
    art.tabIndex = 0;
    art.setAttribute('role','button');
    art.setAttribute('aria-label', `Open details for project ${p.nombre}`);
    art.addEventListener('click', ()=> abrirModalProyecto(p));
    art.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); abrirModalProyecto(p);} });
    return art;
  }

  // ========== Modal de proyecto ==========
  const modal = document.getElementById('modal-proyecto');
  let ultimoFoco = null;

  let hashAbiertoSlug = null; // track para manipular hash

  function abrirModalProyecto(p){
    if(!modal) return;
    ultimoFoco = document.activeElement;
    modal.querySelector('.modal__title').textContent = p.nombre;
    modal.querySelector('.modal__tagline').textContent = p.tagline || '';
    modal.querySelector('.modal__desc').textContent = p.descripcionLarga || p.descripcionCorta;
    const stackEl = modal.querySelector('.modal__stack');
    stackEl.innerHTML = (p.stack||[]).map(s=>`<span>${s}</span>`).join('');
    const linksEl = modal.querySelector('.modal__links');
    linksEl.innerHTML = '';
    if(p.repoUrl) linksEl.innerHTML += `<a href="${p.repoUrl}" target="_blank" rel="noopener">Repository</a>`;
    if(p.demoUrl) linksEl.innerHTML += `<a href="${p.demoUrl}" target="_blank" rel="noopener">Demo</a>`;
    modal.querySelector('.modal__meta').textContent = `${p.anio} • ${p.estado}`;
    modal.dataset.open = 'true';
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    setTimeout(()=>{
      const focusable = modal.querySelector('.modal__close');
      if(focusable) focusable.focus();
    }, 10);
    document.addEventListener('keydown', handleModalKey);
    if (p.slug) {
      hashAbiertoSlug = p.slug;
      // Actualizar hash sin desplazar: usar history.replaceState si ya coincide
      const targetHash = `#proyecto=${encodeURIComponent(p.slug)}`;
      if (location.hash !== targetHash) {
        history.pushState(null, '', targetHash);
      }
    }
  }

  function cerrarModal(){
    if(!modal) return;
    modal.dataset.open = 'false';
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    document.removeEventListener('keydown', handleModalKey);
    if(ultimoFoco) ultimoFoco.focus();
    if (hashAbiertoSlug && location.hash.startsWith('#proyecto=')) {
      // Limpiar hash sin provocar salto
      history.replaceState(null, '', window.location.pathname + window.location.search);
      hashAbiertoSlug = null;
    }
  }

  function handleModalKey(e){
    if(e.key==='Escape') { cerrarModal(); }
    if(e.key==='Tab') {
      const focusables = modal.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])');
      if(!focusables.length) return;
      const list = Array.from(focusables);
      const first = list[0];
      const last = list[list.length-1];
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
  }

  if(modal){
    modal.addEventListener('click', (e)=>{
      const target = e.target;
      if(target.hasAttribute('data-close') || target === modal){ cerrarModal(); }
    });
  }

  // ========== Deep link (hash #proyecto=slug) ==========
  function parseHashProyecto(){
    if(!location.hash) return null;
    const m = location.hash.match(/^#proyecto=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  function checkHashProyecto(){
    const slug = parseHashProyecto();
    if(!slug) return;
    // Ya abierto ese slug
    if(hashAbiertoSlug === slug && modal?.dataset.open==='true') return;
    const p = proyectosCache.find(pr => pr.slug === slug);
    if(p) abrirModalProyecto(p);
  }

  window.addEventListener('hashchange', () => {
    const slug = parseHashProyecto();
    if(!slug && modal?.dataset.open==='true') { cerrarModal(); return; }
    if(slug) checkHashProyecto();
  });

  cargarProyectos();

  // ========== Formación / Certificaciones ==========
  async function cargarFormacion(){
    const cont = document.getElementById('linea-formacion');
    if(!cont) return;
    try {
      const resp = await fetch('data/formacion.json', { cache: 'no-store' });
      if(!resp.ok) throw new Error('No se pudo cargar formacion.json');
      const items = await resp.json();
      cont.setAttribute('aria-busy','false');
      // Mapear fallback existentes por id (si hay) o por título como respaldo
      const fallbackMap = new Map();
      cont.querySelectorAll('.timeline__item[data-fallback]').forEach(node => {
        const id = node.getAttribute('data-id');
        const titulo = node.querySelector('.timeline__titulo')?.textContent.trim();
        if(id) fallbackMap.set(id, node);
        else if(titulo) fallbackMap.set(`t:${titulo.toLowerCase()}`, node);
      });
      // Orden cronológico descendente
      items.sort((a,b)=> (b.inicio||'').localeCompare(a.inicio||''));
      items.forEach(it => {
        const key = it.id ? it.id : `t:${(it.titulo||'').toLowerCase()}`;
        const existente = fallbackMap.get(key);
        const nodoNuevo = crearNodoFormacion(it);
        if(existente) existente.replaceWith(nodoNuevo); else cont.appendChild(nodoNuevo);
      });

      // Reordenamiento global: reunir todos los items y ordenar por inicio desc, luego estado prioridad
      const prioridadEstado = { 'en-curso':1, 'pendiente':2, 'completado':3 };
      const nodos = Array.from(cont.querySelectorAll('.timeline__item'));
      // Extraer datos para ordenar (infiriendo desde texto periodo si no hay data)
      const parseInicio = (n)=>{
        const periodo = n.querySelector('.timeline__periodo')?.textContent || '';
        const match = periodo.match(/^(\d{4})/);
        return match ? match[1] : '0000';
      };
      nodos.sort((a,b)=>{
        const ia = parseInicio(a);
        const ib = parseInicio(b);
        if(ia !== ib) return ib.localeCompare(ia); // desc
        const ea = a.getAttribute('data-estado') || 'pendiente';
        const eb = b.getAttribute('data-estado') || 'pendiente';
        return (prioridadEstado[ea]||9) - (prioridadEstado[eb]||9);
      });
      nodos.forEach(n=> cont.appendChild(n));
    } catch(e){
      console.error(e);
      cont.innerHTML = '<p style="font-size:.8rem;color:#f87171;">Failed to load education data.</p>';
      cont.setAttribute('aria-busy','false');
    }
  }

  function crearNodoFormacion(item){
    const el = document.createElement('div');
    el.className = 'timeline__item';
    if(item.estado === 'en-curso') el.dataset.estado = 'en-curso';
  const periodo = item.fin ? `${item.inicio} – ${item.fin}` : `${item.inicio} – ${item.estado==='pendiente' ? 'Pending' : (item.estado==='completado' ? item.inicio : 'Present')}`;
  const badgeMapa = { 'universidad':'Academic', 'certificacion':'Certification', 'programa':'Program' };
  const badge = badgeMapa[item.tipo] || 'Education';
  const estadoClase = item.estado === 'pendiente' ? 'timeline__badge--pendiente' : item.estado === 'completado' ? 'timeline__badge--completado' : 'timeline__badge--en-curso';
  el.innerHTML = `
      <div class="timeline__entidad">
        <span class="timeline__periodo" aria-label="Periodo">${periodo}</span>
        <span class="timeline__badge ${estadoClase}" aria-label="Tipo">${badge}</span>
      </div>
      <h3 class="timeline__titulo">${item.titulo}</h3>
      <p class="timeline__desc">${item.entidad}${item.ubicacion ? ' · ' + item.ubicacion : ''}</p>
      <p class="timeline__desc">${item.descripcion}</p>
      ${item.enlace ? `<p class="timeline__desc"><a class="link" href="${item.enlace}" target="_blank" rel="noopener">Learn more</a></p>` : ''}
    `;
  if(item.id) el.setAttribute('data-id', item.id);
    return el;
  }

  cargarFormacion();

  // ========== Filtrado de proyectos ==========
  function inicializarFiltros(proyectos){
    const filtrosWrap = document.getElementById('filtros');
    if(!filtrosWrap || !proyectos.length) return;
    filtrosWrap.hidden = false;
    const chipsStackCtn = document.getElementById('chips-stack');
    const chipsEstadoCtn = document.getElementById('chips-estado');
    if(!chipsStackCtn || !chipsEstadoCtn) return;

    // Derivar conjuntos únicos
    const setStacks = new Set();
    const setEstados = new Set();
    proyectos.forEach(p => {
      (p.stack||[]).forEach(s => setStacks.add(s));
      if(p.estado) setEstados.add(p.estado);
    });

    const crearChip = (valor, tipo) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.textContent = valor;
      btn.setAttribute('data-valor', valor);
      btn.setAttribute('data-tipo', tipo);
      btn.setAttribute('aria-pressed','false');
      btn.addEventListener('click', () => {
        const activo = btn.getAttribute('data-activo') === 'true';
        btn.setAttribute('data-activo', (!activo).toString());
        btn.setAttribute('aria-pressed', (!activo).toString());
        aplicarFiltros();
      });
      return btn;
    };

    Array.from(setStacks).sort().forEach(s => chipsStackCtn.appendChild(crearChip(s,'stack')));
    Array.from(setEstados).sort().forEach(e => chipsEstadoCtn.appendChild(crearChip(e,'estado')));

    const btnLimpiar = document.getElementById('btn-limpiar-filtros');
    if(btnLimpiar){
      btnLimpiar.addEventListener('click', () => {
        filtrosWrap.querySelectorAll('.chip[data-activo="true"]').forEach(ch => {
          ch.setAttribute('data-activo','false');
          ch.setAttribute('aria-pressed','false');
        });
        aplicarFiltros();
      });
    }
  }

  function aplicarFiltros(){
    const contenedor = document.getElementById('lista-proyectos');
    if(!contenedor) return;
    const chipsActivosStack = Array.from(document.querySelectorAll('.chip[data-tipo="stack"][data-activo="true"]')).map(c=>c.getAttribute('data-valor'));
    const chipsActivosEstado = Array.from(document.querySelectorAll('.chip[data-tipo="estado"][data-activo="true"]')).map(c=>c.getAttribute('data-valor'));

    // Si no hay filtros activos mostrar todos (regenerar DOM para simular filtrado simple)
    const proyectosFiltrados = proyectosCache.filter(p => {
      const matchStack = !chipsActivosStack.length || (p.stack||[]).some(s => chipsActivosStack.includes(s));
      const matchEstado = !chipsActivosEstado.length || chipsActivosEstado.includes(p.estado);
      return matchStack && matchEstado;
    });

    contenedor.innerHTML = '';
    proyectosFiltrados.forEach(p => contenedor.appendChild(crearTarjeta(p)));
    if(!proyectosFiltrados.length){
      contenedor.innerHTML = '<p style="opacity:.75; font-size:.85rem;">No results match the applied filters.</p>';
    }
  }

  // ========== Toggle de tema (light/dark) ==========
  (function initThemeToggle(){
    const btn = document.getElementById('theme-toggle');
    if(!btn) return;
    const root = document.documentElement;
    const setVisual = (tema)=>{
      root.setAttribute('data-theme', tema);
      btn.setAttribute('aria-pressed', tema === 'light');
      btn.setAttribute('aria-label', tema === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
      const iconSpan = btn.querySelector('.theme-icon');
      if(iconSpan) iconSpan.textContent = tema === 'light' ? '☀️' : '🌙';
      // Ajuste theme-color para móviles
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', tema === 'light' ? '#f5f7fb' : '#0e1116');
    };
    let temaActual = root.getAttribute('data-theme') || 'dark';
    setVisual(temaActual);
    btn.addEventListener('click', ()=>{
      temaActual = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      setVisual(temaActual);
      try { localStorage.setItem('theme', temaActual); } catch(e) {}
    });
    // Escucha cambios del sistema si el usuario no ha elegido explícito
    try {
      if(!localStorage.getItem('theme')) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
          const preferido = e.matches ? 'dark' : 'light';
          setVisual(preferido);
        });
      }
    } catch(e) {}
  })();
})();
