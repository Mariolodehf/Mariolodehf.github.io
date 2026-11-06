/* =========================================================
   Lluvia binaria discreta
   Columnas de 0 y 1 que caen despacio y se desvanecen, en el color
   de la señal del sitio y con muy poca opacidad. Se activa en cualquier
   elemento con el atributo data-rain.
   - data-speed: velocidad relativa (por defecto 1)
   - Se pausa cuando no está en pantalla y respeta prefers-reduced-motion.
   ========================================================= */
(function(){
  'use strict';
  const zonas = document.querySelectorAll('[data-rain]');
  if (!zonas.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GLIFOS = '0101010101101001ABCDEF';
  const FPS = 14;

  function color(){
    const v = getComputedStyle(document.documentElement).getPropertyValue('--signal').trim() || '#8fd6d2';
    const h = v.replace('#','');
    const x = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const n = parseInt(x, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(',');
  }

  function crear(zona){
    const cv = document.createElement('canvas');
    zona.appendChild(cv);
    const ctx = cv.getContext('2d');
    const velocidad = parseFloat(zona.dataset.speed || '1');
    const st = { cols: [], tam: 13, w: 0, h: 0, rgb: color(), visible: true, corriendo: false, ultimo: 0 };

    function medir(){
      const r = zona.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.w = Math.max(1, Math.round(r.width));
      st.h = Math.max(1, Math.round(r.height));
      cv.width = st.w * dpr; cv.height = st.h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = '500 ' + st.tam + 'px "IBM Plex Mono", ui-monospace, monospace';
      ctx.textBaseline = 'top';
      const n = Math.ceil(st.w / (st.tam * 1.15));
      st.cols = Array.from({ length: n }, () => ({
        y: Math.random() * -st.h,
        v: (0.35 + Math.random() * 0.6) * velocidad,
        activa: Math.random() < 0.55          // no todas las columnas caen a la vez
      }));
    }

    function paso(){
      // desvanece lo anterior sin pintar fondo, para que se vea lo que hay detrás
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,.14)';
      ctx.fillRect(0, 0, st.w, st.h);
      ctx.restore();

      const paso = st.tam * 1.15;
      st.cols.forEach((c, i) => {
        if (!c.activa) { if (Math.random() < 0.004) c.activa = true; return; }
        const g = GLIFOS[Math.floor(Math.random() * GLIFOS.length)];
        const x = i * paso;
        ctx.fillStyle = 'rgba(' + st.rgb + ',.95)';
        ctx.fillText(g, x, c.y);
        c.y += st.tam * c.v;
        if (c.y > st.h + st.tam) {
          c.y = -st.tam * (2 + Math.random() * 10);
          c.v = (0.35 + Math.random() * 0.6) * velocidad;
          c.activa = Math.random() < 0.6;
        }
      });
    }

    function bucle(t){
      if (!st.visible || document.hidden) { st.corriendo = false; return; }
      if (t - st.ultimo > 1000 / FPS) { st.ultimo = t; paso(); }
      requestAnimationFrame(bucle);
    }
    function arrancar(){
      if (reduce || st.corriendo || !st.visible || document.hidden) return;
      st.corriendo = true; requestAnimationFrame(bucle);
    }
    function quieto(){
      // versión fija para quien prefiere menos movimiento
      ctx.clearRect(0, 0, st.w, st.h);
      for (let k = 0; k < 40; k++) paso();
    }

    medir();
    if (reduce) quieto(); else arrancar();

    let rt;
    new ResizeObserver(() => { clearTimeout(rt); rt = setTimeout(() => { medir(); if (reduce) quieto(); }, 200); }).observe(zona);
    new MutationObserver(() => { st.rgb = color(); if (reduce) quieto(); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { st.visible = es[0].isIntersecting; arrancar(); }).observe(zona);
    }
    document.addEventListener('visibilitychange', arrancar);
  }

  zonas.forEach(crear);
})();
