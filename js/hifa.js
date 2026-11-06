/* =========================================================
   Hifa · la red viva de la portada
   Hifas (filamentos) que crecen entre nodos-proyecto, se ramifican,
   envejecen y se desvanecen. Por los caminos completos viajan pulsos
   de luz, como paquetes de datos.
   Uso: Hifa.init({ hero, canvas, nodesEl, logEl, root, nodes, onSelect })
   ========================================================= */
(function(){
  'use strict';
  const STEP = 2.2;
  const rnd = (a,b) => a + Math.random()*(b-a);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hexToRgb(hex){
    const h = hex.trim().replace('#','');
    const v = h.length === 3 ? h.split('').map(c=>c+c).join('') : h;
    const n = parseInt(v,16);
    return [(n>>16)&255,(n>>8)&255,n&255].join(',');
  }

  const Hifa = {
    init(opts){
      const S = this.s = Object.assign({}, opts);
      S.ctx = S.canvas.getContext('2d');
      S.off = document.createElement('canvas');
      S.octx = S.off.getContext('2d');
      S.tips = []; S.links = []; S.pulses = [];
      S.frame = 0; S.running = false; S.visible = true; S.lastW = 0; S.lastH = 0;
      S.all = [Object.assign({ root:true, r:9 }, S.root)].concat(S.nodes.map(n => Object.assign({ r: n.big ? 6 : 5 }, n)));

      S.all.forEach(n => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'hero__node' + (n.root ? ' hero__node--root' : '') + (n.gold ? ' hero__node--gold' : '');
        b.innerHTML = '<span class="n"></span><span class="k"></span>';
        b.addEventListener('click', () => { n.flash = 1; this.burst(n); S.onSelect && S.onSelect(n.id); });
        S.nodesEl.appendChild(b);
        n.el = b; n.flash = 0;
      });
      this.setLabels(S.all.map(n => ({ id:n.id, name:n.name, kind:n.kind })));
      this.readColors();
      this.layout();

      // interacción: la red crece hacia el dedo o el puntero
      let down = false;
      S.canvas.addEventListener('pointerdown', e => { down = true; this.toward(e, 0); });
      window.addEventListener('pointerup', () => { down = false; });
      window.addEventListener('pointercancel', () => { down = false; });
      S.canvas.addEventListener('pointermove', e => {
        if (down) this.toward(e, 140);
        else if (e.pointerType === 'mouse') this.toward(e, 320);
      });

      // re-dibujar cuando cambia el tamaño o el tema
      let rt;
      const ro = new ResizeObserver(() => {
        clearTimeout(rt);
        rt = setTimeout(() => {
          const r = S.hero.getBoundingClientRect();
          if (Math.round(r.width) !== S.lastW || Math.abs(r.height - S.lastH) > 140) this.layout();
        }, 180);
      });
      ro.observe(S.hero);
      new MutationObserver(() => { this.readColors(); this.layout(); })
        .observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });

      // pausar cuando no se ve, para no gastar batería
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(es => { S.visible = es[0].isIntersecting; this.kick(); }, { threshold: 0.02 }).observe(S.hero);
      }
      document.addEventListener('visibilitychange', () => this.kick());

      if (reduce) this.still();
      else { this.log(S.seedText || '↳ …'); this.kick(); }
    },

    setLabels(list){
      const S = this.s;
      list.forEach(it => {
        const n = S.all.find(x => x.id === it.id);
        if (!n) return;
        if (it.name) n.name = it.name;
        if (it.kind) n.kind = it.kind;
        n.el.querySelector('.n').textContent = n.name;
        n.el.querySelector('.k').textContent = n.kind;
        n.el.setAttribute('aria-label', n.name + ', ' + n.kind);
      });
    },

    readColors(){
      const cs = getComputedStyle(document.documentElement);
      this.s.fg = hexToRgb(cs.getPropertyValue('--fg') || '#e9dfcb');
      this.s.sig = hexToRgb(cs.getPropertyValue('--signal') || '#8fd6d2');
      this.s.gold = hexToRgb(cs.getPropertyValue('--gold') || '#e3a72f');
    },

    layout(){
      const S = this.s;
      const r = S.hero.getBoundingClientRect();
      const W = S.W = Math.round(r.width), H = S.H = Math.round(r.height);
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      S.mobile = W < 860;
      for (const c of [S.canvas, S.off]) { c.width = W*DPR; c.height = H*DPR; }
      S.ctx.setTransform(DPR,0,0,DPR,0,0);
      S.octx.setTransform(DPR,0,0,DPR,0,0);
      S.octx.lineCap = 'round';

      // el nodo raíz al centro de la zona de red; los proyectos en anillo alrededor
      const others = S.all.filter(n => !n.root);
      let cx, cy, rx, ry;
      if (S.mobile) { cx = W*0.5; cy = H - 215; rx = Math.min(W*0.36, 260); ry = 128; }
      else { cx = W*0.71; cy = H*0.53; rx = Math.min(W*0.2, 300); ry = H*0.31; }
      const root = S.all[0]; root.x = cx; root.y = cy;
      others.forEach((n,i) => {
        const a = -Math.PI/2 + (i/others.length)*Math.PI*2 + (i%2 ? 0.12 : -0.08);
        const k = i%2 ? 1 : 0.86;
        n.x = cx + Math.cos(a)*rx*k;
        n.y = cy + Math.sin(a)*ry*k;
      });
      S.all.forEach(n => { n.el.style.left = n.x + 'px'; n.el.style.top = (n.y + n.r + 6) + 'px'; });

      S.tips = []; S.links = []; S.pulses = [];
      S.octx.clearRect(0,0,W,H);
      S.all.forEach(n => { for (let i=0; i<(n.root?4:2); i++) this.spawnFrom(n); });
      S.lastW = W; S.lastH = H;
      if (reduce) this.still();
    },

    other(ex){ const A = this.s.all; let t; do { t = A[Math.floor(Math.random()*A.length)]; } while (t === ex); return t; },

    spawnFrom(n, to){
      to = to || this.other(n);
      this.s.tips.push({ x:n.x, y:n.y, a:Math.atan2(to.y-n.y,to.x-n.x)+rnd(-1.2,1.2), from:n, to, path:[n.x,n.y], life:0,
        w0: n.root ? 1.9 : 1.5, alpha: rnd(.42,.68) });
    },

    burst(n){ if (!reduce) for (let i=0;i<3;i++) this.spawnFrom(n); this.kick(); },

    maxTips(){ return this.s.mobile ? 36 : 58; },

    grow(t){
      const S = this.s, o = S.octx;
      const tx = t.to.x, ty = t.to.y;
      let d = Math.atan2(ty-t.y, tx-t.x) - t.a; d = Math.atan2(Math.sin(d), Math.cos(d));
      t.a += d*(.02 + Math.min(t.life/380,1)*.09) + rnd(-.42,.42);
      const nx = t.x + Math.cos(t.a)*STEP, ny = t.y + Math.sin(t.a)*STEP;
      o.lineWidth = Math.max(.35, t.w0 - t.life*.006);
      o.strokeStyle = 'rgba(' + S.fg + ',' + t.alpha + ')';
      o.beginPath(); o.moveTo(t.x,t.y); o.lineTo(nx,ny); o.stroke();
      t.x = nx; t.y = ny; t.life++;
      if (t.life % 3 === 0) t.path.push(nx,ny);

      if (Math.random() < .013 && S.tips.length < this.maxTips() && t.life > 12) {
        S.tips.push({ x:nx, y:ny, a:t.a + (Math.random()<.5?-1:1)*rnd(.5,.9), from:t.from,
          to: Math.random()<.5 ? t.to : this.other(t.from), path:t.path.slice(), life:Math.floor(t.life*.5),
          w0:t.w0*.8, alpha:t.alpha*.85, ptr:t.ptr });
      }
      if (Math.hypot(tx-nx, ty-ny) < (t.to.r||4) + 4) {
        if (!t.to.temp && t.to !== t.from) {
          S.links.push({ pts:t.path.concat([tx,ty]), a:t.from, b:t.to });
          if (S.links.length > 40) S.links.shift();
          if (Math.random() < .35 && S.tips.length < this.maxTips()) this.spawnFrom(t.to);
        } else if (t.to.temp) {
          S.tips.push({ x:nx, y:ny, a:rnd(0,6.28), from:t.from, to:this.other(t.from), path:t.path.slice(), life:40, w0:.9, alpha:.5 });
        }
        return false;
      }
      return !(t.life > 650 || nx < -30 || ny < -30 || nx > S.W+30 || ny > S.H+30);
    },

    growAll(steps){
      const S = this.s;
      for (let s=0; s<steps; s++) S.tips = S.tips.filter(t => this.grow(t));
      if (S.tips.length < (S.mobile ? 4 : 6)) this.spawnFrom(S.all[Math.floor(Math.random()*S.all.length)]);
    },

    fade(a){
      const o = this.s.octx;
      o.save(); o.setTransform(1,0,0,1,0,0); o.globalCompositeOperation = 'destination-out';
      o.fillStyle = 'rgba(0,0,0,' + a + ')'; o.fillRect(0,0,this.s.off.width,this.s.off.height); o.restore();
    },

    at(pts,i){
      const n = pts.length/2 - 1; i = Math.max(0, Math.min(n, i));
      const k = Math.floor(i), f = i-k, k2 = Math.min(n, k+1);
      return [pts[k*2] + (pts[k2*2]-pts[k*2])*f, pts[k*2+1] + (pts[k2*2+1]-pts[k*2+1])*f];
    },

    log(text){
      const L = this.s.logEl; if (!L) return;
      const d = document.createElement('div'); d.textContent = text;
      L.prepend(d); while (L.children.length > 3) L.lastChild.remove();
      Array.from(L.children).forEach((c,i) => { c.style.opacity = String(1 - i*.3); });
    },

    pulsesStep(){
      const S = this.s, c = S.ctx;
      if (S.links.length && S.pulses.length < (S.mobile?9:14) && Math.random() < .06) {
        const L = S.links[Math.floor(Math.random()*S.links.length)];
        S.pulses.push({ L, i:0, n:L.pts.length/2 - 1, sp:rnd(.9,1.8), fwd:Math.random()<.5 });
      }
      const words = S.packetWords || ['señal','ACK','sync','dato'];
      S.pulses = S.pulses.filter(p => {
        p.i += p.sp;
        for (let k=0; k<6; k++) {
          const ii = p.i - k*1.4; if (ii < 0) break;
          const [x,y] = this.at(p.L.pts, p.fwd ? ii : p.n-ii);
          c.fillStyle = 'rgba(' + S.sig + ',' + (.9-k*.15).toFixed(2) + ')';
          c.beginPath(); c.arc(x,y,k?1.6:2.3,0,6.283); c.fill();
        }
        const [hx,hy] = this.at(p.L.pts, p.fwd ? p.i : p.n-p.i);
        c.fillStyle = 'rgba(' + S.sig + ',.12)'; c.beginPath(); c.arc(hx,hy,8,0,6.283); c.fill();
        if (p.i >= p.n) {
          const A = p.fwd ? p.L.a : p.L.b, B = p.fwd ? p.L.b : p.L.a;
          B.flash = 1;
          const ms = Math.round(p.n*6.6*.06 + 3);
          this.log('↳ ' + A.name + ' → ' + B.name + ' · ' + ms + ' ms · ' + words[Math.floor(Math.random()*words.length)]);
          return false;
        }
        return true;
      });
    },

    drawNodes(){
      const S = this.s, c = S.ctx;
      for (const n of S.all) {
        const R = n.r*(3.2 + n.flash*1.8);
        const col = n.gold ? S.gold : S.sig;   // HIFA brilla en dorado: el puente con su sección
        const g = c.createRadialGradient(n.x,n.y,0,n.x,n.y,R);
        g.addColorStop(0, 'rgba(' + col + ',' + (.22 + n.flash*.35) + ')');
        g.addColorStop(1, 'rgba(' + col + ',0)');
        c.fillStyle = g; c.beginPath(); c.arc(n.x,n.y,R,0,6.283); c.fill();
        c.fillStyle = 'rgb(' + S.fg + ')'; c.beginPath(); c.arc(n.x,n.y,n.r*.55,0,6.283); c.fill();
        c.strokeStyle = 'rgba(' + S.fg + ',.35)'; c.lineWidth = 1; c.beginPath(); c.arc(n.x,n.y,n.r+3,0,6.283); c.stroke();
        n.flash *= .94;
      }
    },

    paint(){
      const S = this.s;
      S.ctx.clearRect(0,0,S.W,S.H);
      S.ctx.drawImage(S.off,0,0,S.W,S.H);
    },

    kick(){
      const S = this.s;
      if (reduce || S.running || !S.visible || document.hidden) return;
      S.running = true;
      const loop = () => {
        if (!S.visible || document.hidden) { S.running = false; return; }
        S.frame++;
        this.growAll(2);
        if (S.frame % 30 === 0) this.fade(.03);
        if (S.frame % 1800 === 0) this.fade(.2);
        this.paint();
        this.pulsesStep();
        this.drawNodes();
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    },

    still(){
      for (let i=0; i<500; i++) this.growAll(1);
      this.paint(); this.drawNodes();
    },

    toward(e, gap){
      const S = this.s;
      const now = performance.now(); if (now - (S.lastSpawn||0) < gap) return; S.lastSpawn = now;
      if (reduce || S.tips.filter(t => t.ptr).length > 8) return;
      const r = S.canvas.getBoundingClientRect();
      const p = { x:e.clientX - r.left, y:e.clientY - r.top, temp:true, r:2 };
      let best = S.all[0], bd = 1e9;
      for (const n of S.all) { const d = Math.hypot(n.x-p.x, n.y-p.y); if (d < bd) { bd = d; best = n; } }
      let sx = best.x, sy = best.y;
      for (const L of S.links) for (let k=0; k<L.pts.length; k+=12) {
        const d = Math.hypot(L.pts[k]-p.x, L.pts[k+1]-p.y);
        if (d < bd) { bd = d; sx = L.pts[k]; sy = L.pts[k+1]; }
      }
      S.tips.push({ x:sx, y:sy, a:Math.atan2(p.y-sy,p.x-sx), from:best, to:p, path:[sx,sy], life:120, w0:1.1, alpha:.65, ptr:true });
      this.kick();
    }
  };

  window.Hifa = Hifa;
})();
