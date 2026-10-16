# Carta en Google Sheets — configuración paso a paso

## 1. Crear la hoja de cálculo

1. Entra en [Google Sheets](https://sheets.google.com) y crea un libro en blanco.
2. Nómbralo, por ejemplo: **La Marea - Carta**.
3. Renombra la primera pestaña a **Carta** (clic derecho en la pestaña → Cambiar nombre).
4. Añade una segunda pestaña llamada **Secciones**.

## 2. Cabeceras y datos

### Pestaña **Carta** (fila 1)

| Sección | Plato | Descripción | Precio | Visible |
|---------|-------|-------------|--------|---------|
| Para compartir | Torrezno de la casa | Puré de patata... | 12.5 | sí |

- Puedes copiar y pegar desde `plantilla-carta.tsv` (archivo de esta carpeta) en la celda A1.
- **Visible**: `sí` (o vacío) = se muestra en la web. `no` = oculto pero la fila sigue en la hoja. Para quitar del todo, borra la fila.

### Pestaña **Secciones** (fila 1)

| Sección | Nota | Visible | Orden |
|---------|------|---------|-------|
| Burgers | Todas nuestras burgers se sirven con patatas | sí | 3 |

- **Visible**: `sí` (o vacío) = la sección aparece en el inicio de la carta. `no` = oculta (los platos de esa sección no se ven en la web, pero puedes dejarlos en **Carta**).
- **Orden**: número opcional para ordenar en el inicio (menor = más arriba). Si lo dejas vacío, se usa el orden de las filas en la hoja.
- Para **añadir** una sección: nueva fila aquí (nombre exacto que usarás en **Carta**) y luego platos en **Carta**.
- Para **quitar** una sección un tiempo: **Visible** → `no`. Para volver: `sí`.

Copia desde `plantilla-secciones.tsv` si quieres.

## 3. Validaciones (recomendado)

En **Carta**:

1. Columna **Sección** (desde A2): Datos → Validación de datos → **Lista de un rango** → `=Secciones!A2:A` (así, al añadir filas en **Secciones**, el desplegable se actualiza solo). Si prefieres lista fija, puedes seguir usando nombres separados por comas.
2. Columna **Precio**: escribe con **coma** decimal (`8,5` no `8.5`). Formato → **Número** (nunca Fecha).
3. Columna **Visible**: lista `sí, no`.

En **Secciones**:

1. Columna **Visible**: lista `sí, no` (misma lógica que en **Carta**).

### Si los precios salen como 46.150,00 o números enormes

Eso pasa cuando Sheets guardó la celda como **fecha** (muy habitual al pegar `8.5` con punto en España). Hay que **volver a poner los precios**:

1. Selecciona **D2:D** (solo precios, sin la cabecera).
2. **Supr** para borrar.
3. Menú **Formato → Número → Número** (2 decimales).
4. Abre `plantilla-carta.tsv`, copia **solo la columna Precio** (desde `12,5` hasta el final) o copia de nuevo toda la plantilla en A1.
5. En D2: **Pegar** (los valores deben verse como `8,50`, `12,50`, etc., no como 46.xxx).
6. Al editar a mano, usa siempre coma: `9,5` + Enter.

Los precios correctos en carta de restaurante suelen estar entre **4** y **25**. Si ves miles, la columna sigue mal.

Congela la fila 1 (Ver → Inmovilizar → 1 fila).

## 4. Compartir (solo tú y el dueño)

1. Clic en **Compartir**.
2. Añade el correo del dueño como **Editor**.
3. Acceso general: **Restringido** (solo personas con acceso).
4. No uses “Cualquiera con el enlace puede editar”.

## 5. Apps Script (JSON para la web)

1. En la hoja: **Extensiones → Apps Script**.
2. Borra el contenido por defecto y pega todo el archivo `apps-script.js` de esta carpeta.
3. Guarda el proyecto (nombre ej. “La Marea API”).
4. **Implementar → Nueva implementación**:
   - Tipo: **Aplicación web**
   - Descripción: ej. “Carta v1”
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquiera**
5. Copia la **URL de la aplicación web** (termina en `/exec`).

La primera vez Google pedirá autorizar el script (revisar permisos → Avanzado → permitir). Es normal: el script solo lee tu hoja.

## 6. Enlazar la web

1. Abre `config.js` en el proyecto.
2. Pega la URL en `CARTA_URL`:
   ```js
   const CARTA_URL = "https://script.google.com/macros/s/XXXX/exec";
   ```
3. Sube los cambios a Git; Vercel hará deploy automático.

Si `CARTA_URL` está vacía, la web usa `menu-data.js` (respaldo).

## 7. Probar

### Probar el script (sin la web)

Abre la URL `/exec` en el navegador. Debes ver un JSON con secciones y platos. Si sale error, revisa nombres de pestañas **Carta** y **Secciones** y las cabeceras de la fila 1.

### Probar la web en local

`fetch` no funciona bien abriendo `index.html` como archivo. Usa un servidor local, por ejemplo:

```bash
cd la-marea
npx --yes serve .
```

Abre la URL que indique (ej. `http://localhost:3000`), con `CARTA_URL` ya configurada.

### Probar en Vercel

Tras el deploy, recarga la carta en el móvil. Cambia un precio en Sheets, espera unos segundos y recarga la página (recarga forzada si hace falta).

## 8. Uso diario del dueño

| Quiero… | Dónde |
|--------|--------|
| Cambiar precio | **Carta** → **Precio** |
| Cambiar nombre o descripción del plato | **Carta** → **Plato** / **Descripción** |
| Ocultar un plato temporalmente | **Carta** → **Visible** → `no` |
| Quitar un plato para siempre | **Carta** → borrar la fila |
| Añadir plato | **Carta** → nueva fila (sección del desplegable, **Visible** = sí) |
| Nota bajo el título de una sección | **Secciones** → **Nota** |
| Ocultar una sección entera (ej. Burgers) | **Secciones** → **Visible** → `no` |
| Volver a mostrar una sección | **Secciones** → **Visible** → `sí` |
| Añadir una sección nueva | **Secciones** → nueva fila con nombre; luego platos en **Carta** |
| Cambiar el orden en el inicio | **Secciones** → columna **Orden** (o reordenar filas) |

**Importante:** tras actualizar el script en Google (sección 9), añade las columnas **Visible** y **Orden** en **Secciones** si aún no las tienes (puedes pegar de nuevo `plantilla-secciones.tsv` o añadir cabeceras en la fila 1).

## 9. Si cambias el código del script

Cada vez que edites `apps-script.js` en Google: **Implementar → Nueva implementación** (misma URL suele actualizarse si editas la implementación existente en “Gestionar implementaciones”).

## 10. Seguridad (resumen)

- Solo editores invitados de la hoja pueden cambiar la carta.
- La URL pública del script solo **lee** datos; no permite escribir en la hoja.
- No publiques la hoja como “página web” ni CSV público.
