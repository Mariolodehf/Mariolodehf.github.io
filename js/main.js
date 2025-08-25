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
    const toggleMenu = () => {
      const abierto = navMenu.getAttribute('data-open') === 'true';
      const nuevo = (!abierto).toString();
      navMenu.setAttribute('data-open', nuevo);
      navToggle.setAttribute('aria-expanded', nuevo);
      navToggle.setAttribute('aria-label', nuevo === 'true' ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
      if (nuevo === 'true') {
        // Foco al primer link cuando se abre
        const firstLink = navMenu.querySelector('a');
        if (firstLink) firstLink.focus({ preventScroll: true });
      }
    };
    navToggle.addEventListener('click', toggleMenu);
    navMenu.addEventListener('click', (e) => {
      const target = e.target;
      if (target.tagName === 'A' && window.matchMedia('(max-width: 720px)').matches) {
        // Cerrar menú tras navegar en móvil
        navMenu.setAttribute('data-open', 'false');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú de navegación');
      }
    });
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.getAttribute('data-open') === 'true') {
        toggleMenu();
        navToggle.focus();
      }
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
        estado.textContent = 'Por favor completa todos los campos.';
        estado.className = 'form__estado error';
        return;
      }

      // Validación básica de email
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        estado.textContent = 'Email no válido.';
        estado.className = 'form__estado error';
        return;
      }

      // Simulación de envío
  setTimeout(() => {
        estado.textContent = 'Mensaje enviado (simulación). ¡Gracias!';
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
        descripcionCorta: 'Plataforma colaborativa BLE para localizar objetos personales de forma privada y eficiente.',
        stack: ['BLE','IoT','Seguridad'],
        estado: 'Exploración',
        anio: new Date().getFullYear(),
        tagline: 'Red colaborativa IoT',
        destacado: true,
        repoUrl: 'https://github.com/Mariolodehf/UbicaTec',
        demoUrl: null
      }
    ];

    // Si se abrió el archivo sin servidor (file://) advertimos
    if (location.protocol === 'file:') {
      contenedor.innerHTML = '<p style="font-size:0.85rem;opacity:.8;">Para cargar proyectos dinámicos necesitas un servidor local (por ejemplo: <code>python3 -m http.server 8000</code>). Usando fallback embebido.</p>';
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
      contenedor.innerHTML = '<p style="color:#f87171;">Error cargando proyectos remotos. Mostrando fallback local.</p>';
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
        ${p.repoUrl ? `<a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" aria-label="Repositorio de ${p.nombre}">Código</a>` : ''}
        ${p.demoUrl ? `<a href="${p.demoUrl}" target="_blank" rel="noopener noreferrer" aria-label="Demo de ${p.nombre}">Demo</a>` : ''}
      </div>`;
    art.tabIndex = 0;
    art.setAttribute('role','button');
    art.setAttribute('aria-label', `Abrir detalle del proyecto ${p.nombre}`);
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
    if(p.repoUrl) linksEl.innerHTML += `<a href="${p.repoUrl}" target="_blank" rel="noopener">Repositorio</a>`;
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
      // Crear un conjunto de títulos ya presentes (fallback) para no duplicar
      const existentes = new Set(Array.from(cont.querySelectorAll('.timeline__item[data-fallback] .timeline__titulo')).map(n=>n.textContent.trim()));
      // Orden cronológico descendente
      items.sort((a,b)=> (b.inicio||'').localeCompare(a.inicio||''));
      items.forEach(it => {
        if(!existentes.has(it.titulo)) {
          cont.appendChild(crearNodoFormacion(it));
        }
      });
    } catch(e){
      console.error(e);
      cont.innerHTML = '<p style="font-size:.8rem;color:#f87171;">No se pudo cargar la formación.</p>';
      cont.setAttribute('aria-busy','false');
    }
  }

  function crearNodoFormacion(item){
    const el = document.createElement('div');
    el.className = 'timeline__item';
    if(item.estado === 'en-curso') el.dataset.estado = 'en-curso';
    const periodo = item.fin ? `${item.inicio} – ${item.fin}` : `${item.inicio} – ${item.estado==='pendiente' ? 'Pendiente' : 'Actual'}`;
    const badgeMapa = { 'universidad':'Académico', 'certificacion':'Certificación', 'programa':'Programa' };
    const badge = badgeMapa[item.tipo] || 'Formación';
    el.innerHTML = `
      <div class="timeline__entidad">
        <span class="timeline__periodo" aria-label="Periodo">${periodo}</span>
        <span class="timeline__badge" aria-label="Tipo">${badge}</span>
      </div>
      <h3 class="timeline__titulo">${item.titulo}</h3>
      <p class="timeline__desc">${item.entidad}${item.ubicacion ? ' · ' + item.ubicacion : ''}</p>
      <p class="timeline__desc">${item.descripcion}</p>
      ${item.enlace ? `<p class="timeline__desc"><a class="link" href="${item.enlace}" target="_blank" rel="noopener">Ver más</a></p>` : ''}
    `;
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
      contenedor.innerHTML = '<p style="opacity:.75; font-size:.85rem;">No hay resultados para los filtros aplicados.</p>';
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
      btn.setAttribute('aria-label', tema === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
      btn.querySelector('.theme-icon').textContent = tema === 'light' ? '☀️' : '🌙';
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
