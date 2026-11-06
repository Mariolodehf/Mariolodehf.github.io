"""Genera el logo de HIFA en SVG (texto convertido a trazos, sin depender de fuentes instaladas)."""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import os, sys

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
FONTS = '/tmp/fonts/package/files/'
GOLD, CREAM, INK = '#E3A72F', '#F3EAD8', '#0B0B0B'

def texto(s, font, size, x, y, spacing=0.0, anchor='middle'):
    """Devuelve (path_d, ancho) del texto como trazos. x,y = línea base."""
    f = TTFont(FONTS + font)
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f['head'].unitsPerEm
    k = size / upm
    names = [cmap[ord(c)] for c in s]
    adv = [gs[n].width * k for n in names]
    total = sum(adv) + spacing * (len(s) - 1)
    cx = x - total / 2 if anchor == 'middle' else (x - total if anchor == 'end' else x)
    pen = SVGPathPen(gs)
    for n, a in zip(names, adv):
        tp = TransformPen(pen, (k, 0, 0, -k, cx, y))
        gs[n].draw(tp)
        cx += a + spacing
    return pen.getCommands(), total

# Escudo con hifas, dibujado en una caja de 100x110 con origen arriba a la izquierda
def escudo(tx, ty, s, fondo=None, color=GOLD, uid='e'):
    """Escudo dorado con una red de nodos recortada (transparente): la cerradura abstracta de HIFA.
    Los nodos son puntos de acceso; las líneas, las hifas que los conectan."""
    nodos = [(34, 30, 5.2), (62, 26, 3.6), (70, 52, 4.2), (42, 58, 6.5), (58, 80, 3.8), (28, 72, 3.0)]
    enlaces = [(0, 1), (1, 2), (0, 3), (2, 3), (3, 4), (3, 5), (2, 4)]
    m = f'<mask id="{uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="110"><rect width="100" height="110" fill="#fff"/>'
    m += '<g fill="none" stroke="#000" stroke-width="3" stroke-linecap="round">'
    m += ''.join(f'<path d="M{nodos[a][0]} {nodos[a][1]} L{nodos[b][0]} {nodos[b][1]}"/>' for a, b in enlaces) + '</g>'
    m += ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#000"/>' for x, y, r in nodos) + '</mask>'
    return (f'<g transform="translate({tx} {ty}) scale({s})"><defs>{m}</defs>'
            f'<path d="M50 0 L88 13 V49 C88 76 72 94 50 106 C28 94 12 76 12 49 V13 Z" fill="{color}" mask="url(#{uid})"/></g>')

def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
            f'role="img" aria-label="{title}"><title>{title}</title>{body}</svg>\n')

# 1. Logo completo (insignia circular)
d_hifa, _ = texto('HIFA', 'montserrat-latin-800-normal.woff', 66, 200, 292, spacing=12)
d_tag, _ = texto('SEGURIDAD DESDE LA RAÍZ', 'montserrat-latin-500-normal.woff', 12.5, 200, 328, spacing=1.8)
body = (f'<circle cx="200" cy="200" r="194" fill="{INK}"/>'
        f'<circle cx="200" cy="200" r="182" fill="none" stroke="{GOLD}" stroke-width="7"/>'
        + escudo(122, 46, 1.56) +
        f'<path d="{d_hifa}" fill="{CREAM}"/><rect x="130" y="306" width="140" height="2" fill="{GOLD}"/>'
        f'<path d="{d_tag}" fill="{GOLD}"/>')
open(f'{OUT}/hifa-logo.svg', 'w').write(svg(400, 400, body, 'HIFA, seguridad desde la raíz'))

# 2. Horizontal (para encabezados), versión para fondo oscuro y para fondo claro
for nombre, txt, fondo_escudo in [('hifa-horizontal-oscuro', CREAM, INK), ('hifa-horizontal-claro', INK, '#FFFFFF')]:
    d_h, wh = texto('HIFA', 'montserrat-latin-800-normal.woff', 58, 112, 76, spacing=10, anchor='start')
    d_t, wt = texto('SEGURIDAD DESDE LA RAÍZ', 'montserrat-latin-500-normal.woff', 12.5, 114, 104, spacing=2, anchor='start')
    W = int(112 + max(wh, wt) + 12)
    body = escudo(0, 4, 1.0, fondo=fondo_escudo) + f'<path d="{d_h}" fill="{txt}"/><path d="{d_t}" fill="{GOLD}"/>'
    open(f'{OUT}/{nombre}.svg', 'w').write(svg(W, 116, body, 'HIFA'))

# 3. Ícono: escudo solo (transparente) y versión con fondo para redes sociales
open(f'{OUT}/hifa-icono.svg', 'w').write(svg(100, 110, escudo(0, 2, 1.0) , 'HIFA'))
body = f'<rect width="512" height="512" rx="112" fill="{INK}"/>' + escudo(106, 92, 3.0)
open(f'{OUT}/hifa-icono-redes.svg', 'w').write(svg(512, 512, body, 'HIFA'))
print('ok', sorted(os.listdir(OUT)))
