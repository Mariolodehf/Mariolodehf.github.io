# Portafolio de Mario De Hoyos F

Portafolio profesional en construcción continua: proyectos, aprendizaje en telecomunicaciones y seguridad de la información.

## Estructura
```
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── data/
│   └── projects.json
└── assets/
    ├── img/ (imágenes futuras)
    └── icons/ (favicons / SVG)
```

## Requisitos mínimos
Solo necesitas un servidor estático local para que la carga dinámica (`fetch`) funcione.

## Levantar entorno local
Usa uno de los siguientes (elige uno):

### Python 3
```bash
python3 -m http.server 8000
```
Abrir: http://localhost:8000

### Node.js (npx)
```bash
npx serve . -p 8000
```

### PHP
```bash
php -S localhost:8000
```

Si deseas un puerto distinto, reemplaza `8000` (recuerda actualizar la URL en el navegador).

## Problemas comunes
| Problema | Causa probable | Solución |
|----------|----------------|----------|
| "No se puede acceder a este sitio" | Puerto incorrecto o servidor no iniciado | Revisa que el comando sigue corriendo y la URL es http://localhost:8000 |
| Proyectos no cargan | Abriste file://index.html sin servidor | Inicia servidor; fetch requiere HTTP |
| Error CORS en consola | Extensión / configuración bloqueando peticiones locales | Prueba en modo incógnito o desactiva extensiones de seguridad temporales |
| Cambios no se ven | Caché del navegador | Hard refresh (Ctrl+F5) o abre en ventana privada |

## Añadir un nuevo proyecto
Edita `data/projects.json` agregando un objeto:
```json
{
  "slug": "nuevo-proyecto",
  "nombre": "Nombre Proyecto",
  "tagline": "Frase corta de valor",
  "descripcionCorta": "Resumen claro y atractivo.",
  "descripcionLarga": "(Opcional) Texto extendido para futura vista detalle.",
  "anio": 2025,
  "estado": "En desarrollo",
  "stack": ["Tech1", "Tech2"],
  "repoUrl": "https://github.com/usuario/repo",
  "demoUrl": null,
  "destacado": false
}
```

Mantén JSON válido: comas entre objetos excepto en el último.

## Fallback y comportamiento sin servidor
Si cargas el archivo directamente (file://) el script mostrará un mensaje y un proyecto fallback (UbicaTec) para que la UI no quede vacía.

## Modo claro / oscuro
Implementado un sistema de temas con:
- Detección inicial vía `prefers-color-scheme` si no hay preferencia almacenada.
- Persistencia en `localStorage` bajo clave `theme`.
- Prevención de flash (FOUC) aplicando `data-theme` mediante script inline en `<head>` antes de cargar CSS.
- Toggle accesible: botón `#theme-toggle` con `aria-pressed`, `aria-label` dinámico e icono (🌙 / ☀️).
- Actualización de `<meta name="theme-color">` para mejorar integración en navegadores móviles.

Para añadir estilos específicos del tema claro se usan selectores `[data-theme='light']` en `css/styles.css`.

## Deep link de proyectos (hash)
Se puede abrir directamente un proyecto usando la URL:

`https://tu-dominio/#proyecto=ubicatec`

Detalles técnicos:
- Al cargar proyectos se guarda una caché `proyectosCache` en memoria.
- Tras el fetch se evalúa el hash actual y se abre el modal si coincide un `slug`.
- Al abrir un modal se hace `history.pushState` para establecer `#proyecto=slug`.
- Al cerrar se limpia el hash con `history.replaceState` evitando salto de scroll.
- Cambios de `hash` (`hashchange`) sincronizan abrir/cerrar modal.

Para añadir un nuevo proyecto con deep link: asegura que el objeto en `projects.json` tenga el campo `"slug"` único.

## Filtrado de proyectos (stack / estado)
Se añadió un sistema de filtrado accesible:
- Genera chips interactivos para cada tecnología (`stack`) y cada `estado` detectados en todos los proyectos.
- Los chips actúan como toggles (`aria-pressed`).
- Se pueden combinar múltiples tecnologías y estados: el proyecto debe cumplir TODAS las categorías activas (OR dentro de stack, AND entre stack y estado).
- Botón "Limpiar" restablece todos los filtros.
- Si un conjunto de filtros no produce resultados, se muestra un mensaje de estado.

Consideraciones técnicas:
- Se construyen los chips tras la carga (fetch) en `inicializarFiltros()`.
- El filtrado se ejecuta en memoria sobre `proyectosCache` (sin peticiones adicionales).
- Con pocos proyectos la recreación del DOM completo es suficiente; para escalado futuro se podría aplicar hide/show o virtualización.

Accesibilidad:
- Cada chip es un `button` con `aria-pressed` y estado visual.
- Los grupos usan `role="group"` y etiquetas descriptivas.

Extensión futura sugerida:
- Añadir un campo de búsqueda por texto (nombre / descripción) combinable con los chips.
- Persistir filtros en la URL (query/hash) para compartir búsquedas.

## SEO implementado
Elementos añadidos para optimizar indexación y previsualizaciones:
- Meta `robots`, `canonical`, `author`, `keywords`.
- Open Graph (`og:title`, `og:description`, `og:image`, etc.).
- Twitter Card (`summary_large_image`).
- JSON-LD `Person` + `CreativeWork` (proyecto UbicaTec) para datos enriquecidos.
- `robots.txt` permitiendo rastreo y declarando sitemap.
- `sitemap.xml` básico con URL principal y hash del proyecto destacado.

### Imagen Open Graph
Archivo creado: `assets/img/og-default.svg` (1200x630).
- Gradiente + texto para identidad visual.
- Se añaden metadatos de dimensiones y tipo (`image/svg+xml`).
- Recomendación: generar versión raster `og-default.png` (~300–400 KB máx) como fallback para plataformas que no renderizan SVG (ej. algunas previews de WhatsApp / LinkedIn). Al añadirla, puedes mantener ambas etiquetas u optar por PNG en `og:image`.

Para añadir más proyectos al JSON-LD: ampliar la propiedad `hasPart` con nuevos objetos.
Actualizar `sitemap.xml` cuando se agreguen nuevas secciones o slugs relevantes permanentes.

## Historial de iteraciones
Listado cronológico (alta nivel) de lo construido hasta ahora para retomar fácilmente.

1. Estructura base inicial: `index.html` semántico (header/nav/main/sections/footer), carpetas (`css/`, `js/`, `data/`, `assets/`).
2. Personalización: nombre real, bio inicial y objetivo profesional.
3. Responsividad + Accesibilidad básica: navegación móvil (toggle con aria), skip link, focus states, tipografía fluida.
4. Sistema de proyectos dinámicos: `data/projects.json`, fetch con manejo de errores y fallback embebido si `file://` o fallo de red.
5. Modal de detalle accesible: apertura desde tarjeta, focus trap, cierre con Escape y overlay.
6. Deep link por hash: `#proyecto=slug` abre modal directo; limpieza de hash al cerrar.
7. Tema claro/oscuro: detección preferencia, persistencia `localStorage`, prevención FOUC, actualización dinámica de `meta theme-color`.
8. SEO base: meta tags esenciales, canonical, keywords, JSON-LD `Person` + `CreativeWork`, `robots.txt`, `sitemap.xml`.
9. Imagen Open Graph: `assets/img/og-default.svg` con dimensiones y tipo; documentación de posible fallback PNG.
10. Filtrado de proyectos: chips dinámicos por stack y estado, toggles accesibles (`aria-pressed`), botón "Limpiar" y mensaje de cero resultados.
11. Sección de Formación y Certificaciones: timeline dinámico desde `data/formacion.json`, estilos de línea de tiempo, JSON-LD ampliado (`alumniOf`, `hasCredential`).

## Roadmap priorizado (próximas iteraciones)
Orden sugerido; cada punto añade valor incremental. Marcar ✅ al completarse y mover al historial si procede.

1. Búsqueda textual (nombre / descripción) combinable con chips.
2. Persistir filtros y búsqueda en URL (hash o query) para compartir estado.
3. Añadir más proyectos (mínimo 3 adicionales) y actualizar JSON-LD (`hasPart`) + `sitemap.xml` + ampliar `formacion.json` (cursos previos).
4. Sección "Roadmap / Aprendizajes": changelog resumido + aprendizajes técnicos / experimentos.
5. Fallback raster OG (`og-default.png`) + favicon set completo (16/32/ico, mask-icon, manifest básico).
6. Optimización performance: preloads críticos (fuente si se auto-hosteada), lazy más granular, evaluación Lighthouse y mejoras (CLS, LCP, color contrast).
7. Auditoría de accesibilidad: roles adicionales, labels explícitas, verificación con herramientas (axe / Lighthouse A11y > 90).
8. Búsqueda avanzada opcional: ranking simple (coincidencias parciales), highlighting.
9. Automatización dev: configuración Prettier + (opcional) ESLint, scripts de formato, guidelines de commits convencionales.
10. Analítica ligera respetuosa (ej. Plausible) con consentimiento minimalista.
11. Backend/form handling: integración con Formspree / servicio serverless para contacto real; validación adicional y estado de envío.
12. Navegación dentro del modal: botones Prev/Sig para recorrer proyectos sin cerrar.
13. Tests ligeros (unitarios en JS para funciones de filtrado/hash) y GitHub Actions (lint + link checker + build estático).
14. Licencia (MIT) + sección de contacto extendida (enlaces profesionales, quizá clave PGP).
15. Internacionalización futura (en/es) si se amplía alcance.

## Notas de continuidad
- La línea de tiempo se ordena descendentemente por campo `inicio`. Ajustar a futuro para mezclar fin / inicio si hay muchas entradas.
- Campo `estado` admite valores sugeridos: `en-curso`, `pendiente`, `completado` para controlar dot animado y texto.
- Código de filtrado en `js/main.js` (funciones: `inicializarFiltros`, `aplicarFiltros`). Extender ahí para búsqueda textual.
- Al agregar proyectos: recordar actualizar `hasPart` en JSON-LD y regenerar `sitemap.xml` (puede automatizarse con script futuro).
- Mantener consistencia de campos en `projects.json` para evitar rupturas (usar `slug` único, `anio` número, `stack` array).
- Si se agrega persistencia de filtros, reutilizar lógica actual recogiendo chips activos para serializar en hash (`#f=stack:IoT,BLE;estado:Exploración`).

---
Este documento funciona como referencia rápida para reanudar el desarrollo sin perder contexto del progreso ni prioridades.

## Commits sugeridos
Tras estos cambios puedes registrar:
```
feat: agregar fallback dinámico y manejo de errores de proyectos
chore: añadir README con instrucciones de despliegue local
style: mejoras visuales tarjetas de proyectos
```

## Licencia
Por definir (MIT recomendada si deseas apertura). Añade un LICENSE más adelante.
