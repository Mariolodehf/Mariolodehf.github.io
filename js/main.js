/* =========================================================
   mariolodehf.github.io · comportamiento del sitio
   Idioma (es/en), tema (subsuelo/superficie), menú, proyectos,
   formación, modal con enlace directo (#proyecto=slug) y la red Hifa.
   Lo comparte el blog, así que todo revisa si el elemento existe.
   ========================================================= */
(function(){
  'use strict';
  const root = document.documentElement;
  root.classList.remove('no-js'); root.classList.add('js');

  // ---------- Textos ----------
  const T = {
    es: {
      'skip':'Saltar al contenido',
      'nav.projects':'Proyectos','nav.education':'Formación','nav.about':'Sobre mí','nav.contact':'Contacto',
      'hero.eyebrow':'Capa 1 · física',
      'hero.title':'Lo que pasa por <em>debajo</em>.',
      'hero.lead':'Soy Mario de Hoyos, estudiante de Ingeniería de Telecomunicaciones en Medellín. Construyo en ciberseguridad, IoT e IA, y me interesa lo que nadie ve: la red que sostiene todo.',
      'hero.cta':'Ver proyectos','hero.blog':'Leer el blog',
      'hero.hint':'Toca un nodo para abrir el proyecto, o arrastra sobre la red para que crezca hacia ti.',
      'hero.traffic':'Tráfico en la red',
      'hifa.eyebrow':'Proyecto principal',
      'hifa.title':'Prueba tu ciberseguridad antes de que ellos lo hagan.',
      'hifa.lead':'HIFA es la empresa de ciberseguridad que estoy construyendo para Latinoamérica. Su nombre viene de las hifas: la red que nadie ve y que sostiene todo, igual que las comunicaciones de una empresa.',
      'hifa.shield':'Auditorías, pruebas de penetración y hardening para encontrar las fallas antes que un atacante.',
      'hifa.intel':'Investigación de amenazas nuevas, como deepfakes e inyección de prompts contra sistemas de IA.',
      'hifa.advisory':'Acompañamiento para adoptar IA de forma segura y cumplir estándares como ISO 27001 y NIST AI RMF.',
      'hifa.status':'En construcción · Medellín, Colombia',
      'hifa.contact':'Hablemos de HIFA','hifa.more':'Ver el proyecto',
      'projects.eyebrow':'Nodos','projects.title':'Proyectos',
      'projects.intro':'Lo que estoy construyendo, del más conectado al más experimental. Toca uno para ver el detalle.',
      'projects.clear':'Limpiar','projects.loading':'Cargando proyectos…',
      'projects.error':'No pude cargar los proyectos. Si abriste el archivo directo, usa un servidor local: python3 -m http.server 8000',
      'projects.empty':'Ningún proyecto coincide con esos filtros.',
      'edu.eyebrow':'Raíces','edu.title':'Formación y certificaciones',
      'edu.intro':'La base académica y los programas que fortalecen mi perfil en telecomunicaciones y ciberseguridad.',
      'edu.error':'No pude cargar la formación.',
      'edu.present':'Actualidad','edu.more':'Ver más',
      'edu.state.en-curso':'En curso','edu.state.pendiente':'En preparación','edu.state.completado':'Completado',
      'edu.type.universidad':'Académico','edu.type.certificacion':'Certificación','edu.type.programa':'Programa',
      'about.eyebrow':'Sustrato','about.title':'Sobre mí',
      'about.p1':'Como futuro ingeniero de telecomunicaciones, me apasiona entender los sistemas de comunicación desde su base para poder protegerlos. No me conformo con usar la tecnología: me gusta desarmarla, ver cómo funciona por dentro, configurar redes, endurecer sistemas y escribir scripts que automaticen la seguridad.',
      'about.p2':'Mi filosofía es simple: no puedes proteger lo que no entiendes. Por eso combino las bases de telecomunicaciones con prácticas de seguridad ofensiva y defensiva, para diseñar arquitecturas de red de verdad resilientes.',
      'about.hifa':'Cada uno de los filamentos que forman el micelio de un hongo. Bajo el suelo, las hifas se entrelazan con las raíces de las plantas y forman una red que mueve recursos y señales. Por esa misma red también se propagan amenazas. Así veo las comunicaciones y la ciberseguridad. Por eso mi empresa de ciberseguridad se llama HIFA.',
      'contact.eyebrow':'Conexión','contact.title':'Hablemos',
      'contact.intro':'Si te interesa colaborar en alguno de estos proyectos, o simplemente conversar de redes y seguridad, escríbeme.',
      'contact.email':'Correo','contact.write':'Escribir','contact.copy':'Copiar','contact.github':'Ver perfil',
      'contact.copied':'Correo copiado.','contact.selected':'Correo seleccionado, cópialo con tu teclado.',
      'footer.place':'Medellín, Colombia','footer.note':'Hecho a mano, con hifas y paquetes.',
      'modal.close':'Cerrar','modal.state':'Estado','modal.year':'Año','modal.repo':'Repositorio','modal.demo':'Demo',
      'root.name':'Mario','root.kind':'Nodo raíz',
      'packets':['señal','ACK','sync','dato'],'seed':'↳ sembrando hifas…',
      'a.lang':'Read in English','a.themeLight':'Cambiar a superficie (tema claro)','a.themeDark':'Cambiar a subsuelo (tema oscuro)',
      'a.menuOpen':'Abrir menú','a.menuClose':'Cerrar menú','a.open':'Abrir proyecto'
    },
    en: {
      'skip':'Skip to content',
      'nav.projects':'Projects','nav.education':'Education','nav.about':'About','nav.contact':'Contact',
      'hero.eyebrow':'Layer 1 · physical',
      'hero.title':'What happens <em>underneath</em>.',
      'hero.lead':'I\'m Mario de Hoyos, a Telecommunications Engineering student in Medellín. I build in cybersecurity, IoT and AI, and I care about what nobody sees: the network that holds everything together.',
      'hero.cta':'See projects','hero.blog':'Read the blog',
      'hero.hint':'Tap a node to open the project, or drag across the network to make it grow toward you.',
      'hero.traffic':'Network traffic',
      'hifa.eyebrow':'Main project',
      'hifa.title':'Test your cybersecurity before they do.',
      'hifa.lead':'HIFA is the cybersecurity company I\'m building for Latin America. Its name comes from hyphae: the unseen network that holds everything together, just like a company\'s communications.',
      'hifa.shield':'Audits, penetration testing and hardening to find the gaps before an attacker does.',
      'hifa.intel':'Research on new threats, such as deepfakes and prompt injection against AI systems.',
      'hifa.advisory':'Guidance to adopt AI safely and meet standards such as ISO 27001 and NIST AI RMF.',
      'hifa.status':'In progress · Medellín, Colombia',
      'hifa.contact':'Talk about HIFA','hifa.more':'See the project',
      'projects.eyebrow':'Nodes','projects.title':'Projects',
      'projects.intro':'What I\'m building, from the most connected to the most experimental. Tap one for details.',
      'projects.clear':'Clear','projects.loading':'Loading projects…',
      'projects.error':'Projects could not load. If you opened the file directly, use a local server: python3 -m http.server 8000',
      'projects.empty':'No project matches those filters.',
      'edu.eyebrow':'Roots','edu.title':'Education and certifications',
      'edu.intro':'The academic base and the programs that strengthen my profile in telecommunications and cybersecurity.',
      'edu.error':'Education data could not load.',
      'edu.present':'Present','edu.more':'Learn more',
      'edu.state.en-curso':'In progress','edu.state.pendiente':'Preparing','edu.state.completado':'Completed',
      'edu.type.universidad':'Academic','edu.type.certificacion':'Certification','edu.type.programa':'Program',
      'about.eyebrow':'Substrate','about.title':'About me',
      'about.p1':'As a future telecommunications engineer, I love understanding communication systems from the ground up so I can protect them. Using technology isn\'t enough for me: I like taking it apart, seeing how it works inside, configuring networks, hardening systems and writing scripts that automate security.',
      'about.p2':'My philosophy is simple: you can\'t protect what you don\'t understand. That\'s why I combine telecommunications foundations with offensive and defensive security practice, to design network architectures that are truly resilient.',
      'about.hifa':'Each of the filaments that make up a fungus\'s mycelium. Underground, hyphae weave into plant roots and form a network that moves resources and signals. Threats spread through that same network. That\'s how I see communications and cybersecurity. That\'s why my cybersecurity company is called HIFA.',
      'contact.eyebrow':'Connection','contact.title':'Let\'s talk',
      'contact.intro':'If you\'d like to collaborate on any of these projects, or just talk networks and security, write to me.',
      'contact.email':'Email','contact.write':'Write','contact.copy':'Copy','contact.github':'View profile',
      'contact.copied':'Email copied.','contact.selected':'Email selected, copy it with your keyboard.',
      'footer.place':'Medellín, Colombia','footer.note':'Handmade, with hyphae and packets.',
      'modal.close':'Close','modal.state':'Status','modal.year':'Year','modal.repo':'Repository','modal.demo':'Demo',
      'root.name':'Mario','root.kind':'Root node',
      'packets':['signal','ACK','sync','data'],'seed':'↳ seeding hyphae…',
      'a.lang':'Leer en español','a.themeLight':'Switch to surface (light theme)','a.themeDark':'Switch to underground (dark theme)',
      'a.menuOpen':'Open menu','a.menuClose':'Close menu','a.open':'Open project'
    }
  };
  let lang = root.getAttribute('lang') === 'en' ? 'en' : 'es';
  const t = k => (T[lang] && T[lang][k] !== undefined) ? T[lang][k] : (T.es[k] !== undefined ? T.es[k] : k);
  const L = v => (v && typeof v === 'object' && !Array.isArray(v)) ? (v[lang] || v.es || '') : (v || '');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function applyTexts(){
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-blog]').forEach(a => { a.setAttribute('href', lang === 'en' ? '/blog/en/' : '/blog/'); });
    const lt = document.getElementById('lang-toggle');
    if (lt) { lt.textContent = lang === 'es' ? 'EN' : 'ES'; lt.setAttribute('aria-label', t('a.lang')); }
  }

  // ---------- Año ----------
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // ---------- Menú ----------
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.getElementById('nav-menu');
  const overlay = document.querySelector('[data-nav-overlay]');
  if (navToggle && navMenu) {
    const close = (focus) => {
      navMenu.setAttribute('data-open','false'); navToggle.setAttribute('aria-expanded','false');
      navToggle.setAttribute('aria-label', t('a.menuOpen')); navToggle.classList.remove('is-open');
      if (overlay) overlay.hidden = true; if (focus) navToggle.focus();
    };
    const open = () => {
      navMenu.setAttribute('data-open','true'); navToggle.setAttribute('aria-expanded','true');
      navToggle.setAttribute('aria-label', t('a.menuClose')); navToggle.classList.add('is-open');
      if (overlay) overlay.hidden = false;
    };
    navToggle.addEventListener('click', () => navMenu.getAttribute('data-open') === 'true' ? close() : open());
    if (overlay) overlay.addEventListener('click', () => close());
    navMenu.addEventListener('click', e => { if (e.target.tagName === 'A') close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && navMenu.getAttribute('data-open') === 'true') close(true); });
  }

  // ---------- Tema: subsuelo (oscuro) / superficie (claro) ----------
  const themeBtn = document.getElementById('theme-toggle');
  function setTheme(v, save){
    root.setAttribute('data-theme', v);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(v === 'light'));
      themeBtn.setAttribute('aria-label', v === 'light' ? t('a.themeDark') : t('a.themeLight'));
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', v === 'light' ? '#f3eee4' : '#120e0b');
    if (save) { try { localStorage.setItem('theme', v); } catch(e) {} }
  }
  if (themeBtn) {
    setTheme(root.getAttribute('data-theme') || 'dark');
    themeBtn.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true));
  }

  // ---------- Proyectos ----------
  let proyectos = [];
  const filtrosActivos = new Set();
  const lista = document.getElementById('lista-proyectos');

  function tarjeta(p){
    const a = document.createElement('article');
    a.className = 'proyecto'; a.tabIndex = 0; a.setAttribute('role','button');
    a.setAttribute('aria-label', t('a.open') + ': ' + p.nombre);
    a.innerHTML =
      '<div class="proyecto__top"><span class="proyecto__tipo">' + esc(L(p.tipo)) + '</span><span class="proyecto__anio">' + esc(p.anio) + '</span></div>' +
      '<h3>' + esc(p.nombre) + '</h3>' +
      '<p>' + esc(L(p.descripcionCorta)) + '</p>' +
      '<div class="proyecto__tags">' + (p.stack || []).map(s => '<span class="tag">' + esc(s) + '</span>').join('') + '</div>' +
      '<span class="proyecto__estado">' + esc(L(p.estado)) + '</span>';
    a.addEventListener('click', () => abrirModal(p));
    a.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirModal(p); } });
    return a;
  }

  function pintarProyectos(){
    if (!lista) return;
    const vis = proyectos.filter(p => !filtrosActivos.size || (p.stack || []).some(s => filtrosActivos.has(s)));
    lista.innerHTML = '';
    if (!vis.length) { lista.innerHTML = '<p class="estado-carga">' + esc(t('projects.empty')) + '</p>'; return; }
    vis.forEach(p => lista.appendChild(tarjeta(p)));
  }

  function pintarFiltros(){
    const wrap = document.getElementById('filtros'), chips = document.getElementById('chips-stack'), limpiar = document.getElementById('btn-limpiar-filtros');
    if (!wrap || !chips) return;
    const stacks = Array.from(new Set(proyectos.flatMap(p => p.stack || []))).sort((a,b) => a.localeCompare(b));
    chips.innerHTML = '';
    stacks.forEach(s => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.textContent = s;
      b.setAttribute('aria-pressed', String(filtrosActivos.has(s)));
      b.addEventListener('click', () => {
        filtrosActivos.has(s) ? filtrosActivos.delete(s) : filtrosActivos.add(s);
        b.setAttribute('aria-pressed', String(filtrosActivos.has(s)));
        if (limpiar) limpiar.hidden = !filtrosActivos.size;
        pintarProyectos();
      });
      chips.appendChild(b);
    });
    wrap.hidden = !stacks.length;
    if (limpiar && !limpiar.dataset.bound) {
      limpiar.dataset.bound = '1';
      limpiar.addEventListener('click', () => { filtrosActivos.clear(); limpiar.hidden = true; pintarFiltros(); pintarProyectos(); });
    }
  }

  // ---------- Modal con enlace directo ----------
  const modal = document.getElementById('modal-proyecto');
  let ultimoFoco = null, abierto = null;

  function abrirModal(p){
    if (!modal) return;
    if (modal.dataset.open !== 'true') ultimoFoco = document.activeElement;
    abierto = p;
    modal.querySelector('.modal__tipo').textContent = L(p.tipo);
    modal.querySelector('.modal__title').textContent = p.nombre;
    modal.querySelector('.modal__tagline').textContent = L(p.tagline);
    modal.querySelector('.modal__desc').textContent = L(p.descripcionLarga) || L(p.descripcionCorta);
    modal.querySelector('.modal__stack').innerHTML = (p.stack || []).map(s => '<span class="tag">' + esc(s) + '</span>').join('');
    modal.querySelector('.modal__meta').innerHTML =
      '<dt>' + esc(t('modal.state')) + '</dt><dd>' + esc(L(p.estado)) + '</dd><dt>' + esc(t('modal.year')) + '</dt><dd>' + esc(p.anio) + '</dd>';
    const links = modal.querySelector('.modal__links'); links.innerHTML = '';
    if (p.repoUrl) links.innerHTML += '<a class="btn btn--sm btn--primary" href="' + esc(p.repoUrl) + '" target="_blank" rel="noopener">' + esc(t('modal.repo')) + '</a>';
    if (p.demoUrl) links.innerHTML += '<a class="btn btn--sm" href="' + esc(p.demoUrl) + '" target="_blank" rel="noopener">' + esc(t('modal.demo')) + '</a>';
    modal.dataset.open = 'true'; modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const c = modal.querySelector('.modal__close'); if (c) c.focus(); }, 10);
    const h = '#proyecto=' + encodeURIComponent(p.slug);
    if (p.slug && location.hash !== h) history.pushState(null, '', h);
  }
  function cerrarModal(){
    if (!modal || modal.dataset.open !== 'true') return;
    modal.dataset.open = 'false'; modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = ''; abierto = null;
    if (ultimoFoco) ultimoFoco.focus({ preventScroll:true });
    if (location.hash.startsWith('#proyecto=')) history.replaceState(null, '', location.pathname + location.search);
  }
  if (modal) {
    modal.addEventListener('click', e => { if (e.target.hasAttribute('data-close')) cerrarModal(); });
    document.addEventListener('keydown', e => {
      if (modal.dataset.open !== 'true') return;
      if (e.key === 'Escape') cerrarModal();
      if (e.key === 'Tab') {
        const f = Array.from(modal.querySelectorAll('button, a[href]'));
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length-1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length-1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }
  function revisarHash(){
    const m = location.hash.match(/^#proyecto=([^&]+)/);
    if (!m) { cerrarModal(); return; }
    const p = proyectos.find(x => x.slug === decodeURIComponent(m[1]));
    if (p && abierto !== p) abrirModal(p);
  }
  window.addEventListener('hashchange', revisarHash);

  // ---------- Red Hifa ----------
  let redLista = false;
  function iniciarRed(){
    const hero = document.getElementById('red');
    if (!hero || !window.Hifa || redLista) return;
    redLista = true;
    window.Hifa.s = null;
    window.Hifa.init({
      hero,
      canvas: document.getElementById('red-canvas'),
      nodesEl: document.getElementById('hifa-nodes'),
      logEl: document.getElementById('hifa-log'),
      root: { id:'root', name:t('root.name'), kind:t('root.kind') },
      nodes: proyectos.map(p => ({ id:p.slug, name:p.nombre, kind:L(p.tipo), big:!!p.destacado, gold: p.slug === 'hifa' })),
      seedText: t('seed'),
      onSelect: id => {
        if (id === 'root') { document.getElementById('sobre-mi')?.scrollIntoView(); return; }
        const p = proyectos.find(x => x.slug === id); if (p) abrirModal(p);
      }
    });
    window.Hifa.s.packetWords = t('packets');
  }
  function etiquetasRed(){
    if (!redLista || !window.Hifa.s) return;
    window.Hifa.setLabels([{ id:'root', name:t('root.name'), kind:t('root.kind') }]
      .concat(proyectos.map(p => ({ id:p.slug, kind:L(p.tipo) }))));
    window.Hifa.s.packetWords = t('packets');
  }

  async function cargarProyectos(){
    if (!lista) return;
    try {
      const r = await fetch('data/projects.json', { cache:'no-cache' });
      if (!r.ok) throw new Error(r.status);
      proyectos = await r.json();
      lista.setAttribute('aria-busy','false');
      pintarFiltros(); pintarProyectos(); iniciarRed(); revisarHash();
    } catch (e) {
      console.error(e);
      lista.setAttribute('aria-busy','false');
      lista.innerHTML = '<p class="estado-carga">' + esc(t('projects.error')) + '</p>';
    }
  }

  // ---------- Formación ----------
  let formacion = [];
  const linea = document.getElementById('linea-formacion');
  function pintarFormacion(){
    if (!linea) return;
    const orden = { 'en-curso':1, 'pendiente':2, 'completado':3 };
    const items = formacion.slice().sort((a,b) => (b.inicio||'').localeCompare(a.inicio||'') || (orden[a.estado]||9) - (orden[b.estado]||9));
    linea.innerHTML = items.map(it => {
      const fin = it.fin || (it.estado === 'en-curso' ? t('edu.present') : '');
      const periodo = fin && fin !== it.inicio ? it.inicio + ' – ' + fin : it.inicio;
      return '<li class="timeline__item" data-estado="' + esc(it.estado) + '">' +
        '<div class="timeline__meta"><span>' + esc(periodo) + '</span><span>' + esc(t('edu.type.' + it.tipo)) + '</span>' +
        '<span class="timeline__estado timeline__estado--' + esc(it.estado) + '">' + esc(t('edu.state.' + it.estado)) + '</span></div>' +
        '<h3 class="timeline__titulo">' + esc(L(it.titulo)) + '</h3>' +
        '<p class="timeline__desc">' + esc(it.entidad) + (it.ubicacion ? ' · ' + esc(it.ubicacion) : '') + '</p>' +
        '<p class="timeline__desc">' + esc(L(it.descripcion)) + '</p>' +
        (it.enlace ? '<p class="timeline__desc"><a href="' + esc(it.enlace) + '" target="_blank" rel="noopener">' + esc(t('edu.more')) + '</a></p>' : '') +
        '</li>';
    }).join('');
  }
  async function cargarFormacion(){
    if (!linea) return;
    try {
      const r = await fetch('data/formacion.json', { cache:'no-cache' });
      if (!r.ok) throw new Error(r.status);
      formacion = await r.json();
      linea.setAttribute('aria-busy','false');
      pintarFormacion();
    } catch (e) {
      console.error(e);
      linea.setAttribute('aria-busy','false');
      linea.innerHTML = '<li class="timeline__desc">' + esc(t('edu.error')) + '</li>';
    }
  }

  // ---------- Copiar correo ----------
  const copiar = document.getElementById('btn-copiar');
  if (copiar) copiar.addEventListener('click', () => {
    const estado = document.getElementById('copiar-estado');
    const valor = document.getElementById('email-valor');
    const seleccionar = () => {
      const r = document.createRange(); r.selectNodeContents(valor);
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      if (estado) estado.textContent = t('contact.selected');
    };
    try {
      navigator.clipboard.writeText(valor.textContent.trim())
        .then(() => { if (estado) estado.textContent = t('contact.copied'); })
        .catch(seleccionar);
    } catch (e) { seleccionar(); }
  });

  // ---------- Cambio de idioma ----------
  const langBtn = document.getElementById('lang-toggle');
  function setLang(v){
    lang = v; root.setAttribute('lang', v);
    try { localStorage.setItem('lang', v); } catch(e) {}
    applyTexts();
    if (themeBtn) setTheme(root.getAttribute('data-theme') || 'dark');
    if (proyectos.length) { pintarFiltros(); pintarProyectos(); }
    if (formacion.length) pintarFormacion();
    if (abierto) abrirModal(abierto);
    etiquetasRed();
  }
  if (langBtn) langBtn.addEventListener('click', () => setLang(lang === 'es' ? 'en' : 'es'));

  if (langBtn) applyTexts();
  cargarProyectos();
  cargarFormacion();
})();
