# Sistema Solar Interactivo con Nave - Práctica S67 IG

Este proyecto es una práctica de **Informática Gráfica (IG)** en la que se implementa un **sistema solar interactivo** en 3D, utilizando Three.js. El sistema incluye planetas, órbitas, una luna, texturas realistas, una nave controlable en tercera persona y colisiones con animaciones de explosión.

---

## Características

### Sistema Solar

- El **Sol** está en el centro con textura realista.
- **Cinco planetas iniciales** orbitan alrededor del Sol en el plano XZ.
- Cada planeta **rota sobre sí mismo** mientras orbita.
- Una **luna** orbita alrededor del tercer planeta.
- Se pueden **crear planetas adicionales** haciendo click sobre el plano invisible.
- Las texturas de los planetas se precargan para mejorar el rendimiento.

<img width="1892" height="879" alt="image" src="https://github.com/user-attachments/assets/8ff843ab-11e8-42c6-9809-08289699e8da" />


### Nave Espacial

- La nave está representada mediante un **modelo 3D en formato GLB** (`toyota_corolla.glb` en este ejemplo).
- **Controles de la nave** (vista en tercera persona):
  - `W` → Avanzar
  - `S` → Retroceder
  - `A` → Girar a la izquierda
  - `D` → Girar a la derecha
  - `SPACE` → Subir
  - `SHIFT` → Bajar
- Cámara en tercera persona siguiendo la nave.
- Si la nave **colisiona con un planeta o con el Sol**, se activa una animación de explosión con partículas y la nave se reinicia después de 3 segundos.

<img width="1900" height="870" alt="image" src="https://github.com/user-attachments/assets/26f4c5a8-b830-448a-afcf-38902dad009d" />


### Interacción

- Presiona `V` para alternar entre:
  - **Vista general** del sistema solar.
  - **Vista en tercera persona** desde la nave.
- Haz click sobre el plano invisible para **añadir planetas** con texturas aleatorias.

---

## Dependencias

- [Three.js](https://threejs.org/)
- `OrbitControls` de Three.js para rotar y desplazar la cámara.
- `GLTFLoader` de Three.js para cargar modelos 3D (nave, explosión si se utiliza).
- Texturas planetarias (`.jpg`).
- Modelo de nave 3D (`.glb`).

---

## Estructura de Archivos
/index.html
/script_entregable.js
/models/toyota_corolla.glb
/2k_mercury.jpg
/2k_venus_surface.jpg
/2k_earth_daymap.jpg
/2k_mars.jpg
/2k_jupiter.jpg
/2k_saturn.jpg
/2k_uranus.jpg
/2k_neptune.jpg
/2k_moon.jpg
/2k_sun.jpg
/2k_stars_milky_way.jpg

---

## Instrucciones de Uso

1. Abrir `index.html` en un navegador compatible con **WebGL**.
2. La **cámara por defecto** muestra todo el sistema solar.
3. Presionar `V` para alternar a la **vista de la nave**.
4. Controlar la nave con las teclas:
   - `W`, `S` → Avanzar / Retroceder
   - `A`, `D` → Girar
   - `SPACE`, `SHIFT` → Subir / Bajar
5. Evitar **colisiones** con planetas o el Sol, que activan la animación de explosión y reinician la nave tras 3 segundos.
6. Hacer **click sobre el plano invisible** para crear nuevos planetas aleatorios.

---

## Detalles Técnicos

- Las **órbitas de los planetas** están en el **plano horizontal XZ**.
- La **rotación de cada planeta** y la **luna** se calculan en cada frame.
- La **animación de explosión** se realiza con partículas (`THREE.PointsMaterial`) alrededor de la posición de la nave al colisionar.
- La **cámara de la nave** se coloca ligeramente por encima y detrás de la nave para simular una vista en tercera persona.

---

## Créditos

- **Texturas planetarias**: NASA Planetary Textures.
- **Modelo de nave**: `toyota_corolla.glb` (modelo de ejemplo GLB).
- **Three.js** y extensiones (`OrbitControls`, `GLTFLoader`).

---

- La nave se inicializa **más lejos de los planetas** para evitar explosiones al salir de la cámara.
- Puedes **modificar la velocidad** de la nave y la rotación en `script_entregable.js`.
- Puedes **añadir nuevas texturas y planetas** ampliando los arrays de texturas y distancias.

[![Ver demo](https://img.youtube.com/vi/L5MNoO3pEz0/0.jpg)](https://youtu.be/L5MNoO3pEz0))
