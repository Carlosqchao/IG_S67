import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let scene, camera, cameraNave, renderer, controls;
let planetas = [], lunas = [];
let estrella, nave, explosion;
let planetTexturesLoaded = [];
let vistaNave = false;
let raycaster, mouse, plano;
let velocidad = 0.1, rotacionVel = 0.02;
let teclasPresionadas = {};
let naveCargada = false;
let explosionActiva = false;
let clock = new THREE.Clock();

// Lista de texturas de planetas
const planetTexturesPaths = [
  "2k_mercury.jpg",
  "2k_venus_surface.jpg",
  "2k_earth_daymap.jpg",
  "2k_mars.jpg",
  "2k_jupiter.jpg",
  "2k_saturn.jpg",
  "2k_uranus.jpg",
  "2k_neptune.jpg",
];

const moonTexturePath = "2k_moon.jpg";
let moonTexture;

init();
animate();

function init() {
  scene = new THREE.Scene();
  const fondo = new THREE.TextureLoader().load("2k_stars_milky_way.jpg");
  scene.background = fondo;

  // Cámaras
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 15, 30);

  cameraNave = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Luces
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);
  const pointLight = new THREE.PointLight(0xffffff, 2, 300);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);

  // Sol
  const solTex = new THREE.TextureLoader().load("2k_sun.jpg");
  const geoSol = new THREE.SphereGeometry(2, 64, 64);
  const matSol = new THREE.MeshStandardMaterial({
    map: solTex,
    emissive: 0xffff33,
    emissiveIntensity: 1.0,
  });
  estrella = new THREE.Mesh(geoSol, matSol);
  estrella.name = "sol";
  scene.add(estrella);

  // Cargar texturas planetarias
  const loader = new THREE.TextureLoader();
  planetTexturesPaths.forEach((path) =>
    planetTexturesLoaded.push(loader.load(path))
  );
  moonTexture = loader.load(moonTexturePath);

  // Crear planetas iniciales
  const planetDistances = [10, 16, 22, 28, 36];

  for (let i = 0; i < 5; i++) crearPlaneta(planetDistances[i], planetTexturesLoaded[i]);

  // Crear luna para el tercer planeta
  crearLuna(planetas[2], moonTexture);

  // Raycaster y plano invisible
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  const planeGeo = new THREE.PlaneGeometry(500, 500);
  const planeMat = new THREE.MeshBasicMaterial({ visible: false });
  plano = new THREE.Mesh(planeGeo, planeMat);
  scene.add(plano);
  const gltfLoader = new GLTFLoader();
  gltfLoader.load(
    "models/toyota_corolla.glb",
    (gltf) => {
      nave = gltf.scene;
      nave.scale.set(0.5, 0.5, 0.5);
      nave.position.set(0, 0, 40);
      scene.add(nave);
      naveCargada = true;

    },
    (xhr) => console.log(`Cargando nave: ${(xhr.loaded / xhr.total) * 100}%`),
    (error) => console.error("Error al cargar el modelo:", error)
  );

  // Eventos
  window.addEventListener("click", onClick);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "v") vistaNave = !vistaNave;
  });
}

function crearPlaneta(distancia, textura) {
  const radio = 0.5 + Math.random() * 0.5;
  const geo = new THREE.SphereGeometry(radio, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ map: textura });
  const planeta = new THREE.Mesh(geo, mat);
  planeta.position.set(distancia, 0, 0);
  planeta.userData = {
    distancia,
    angulo: Math.random() * Math.PI * 2,
    velocidad: 0.003 + Math.random() * 0.01,
    rotacion: 0.005 + Math.random() * 0.02,
  };
  planetas.push(planeta);
  scene.add(planeta);
}

function crearLuna(planetaPadre, textura) {
  const radio = 0.15 + Math.random() * 0.1;
  const geo = new THREE.SphereGeometry(radio, 16, 16);
  const mat = new THREE.MeshStandardMaterial({ map: textura });
  const luna = new THREE.Mesh(geo, mat);
  luna.userData = {
    planetaPadre,
    distancia: 1.5,
    angulo: Math.random() * Math.PI * 2,
    velocidad: 0.02,
  };
  luna.position.set(planetaPadre.position.x + luna.userData.distancia, 0, 0);
  lunas.push(luna);
  scene.add(luna);
}

// Crear planeta al hacer click
function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(plano);

  if (intersects.length > 0) {
    const punto = intersects[0].point;
    punto.z = 0;
    const randomTexture = planetTexturesLoaded[Math.floor(Math.random() * planetTexturesLoaded.length)];
    crearPlaneta(Math.sqrt(punto.x ** 2 + punto.y ** 2), randomTexture);
  }
}

function onKeyDown(e) {
  teclasPresionadas[e.key.toLowerCase()] = true;
}

function onKeyUp(e) {
  teclasPresionadas[e.key.toLowerCase()] = false;
}

function moverNave() {
  if (!naveCargada || explosionActiva) return;

  if (teclasPresionadas["w"]) nave.translateZ(-velocidad);
  if (teclasPresionadas["s"]) nave.translateZ(velocidad);
  if (teclasPresionadas["a"]) nave.rotation.y += rotacionVel;
  if (teclasPresionadas["d"]) nave.rotation.y -= rotacionVel;
  if (teclasPresionadas[" "]) nave.position.y += velocidad;
  if (teclasPresionadas["shift"]) nave.position.y -= velocidad;
}

function detectarColisiones() {
  if (!naveCargada || explosionActiva) return;

  const naveBox = new THREE.Box3().setFromObject(nave);
  const solBox = new THREE.Box3().setFromObject(estrella);
  if (naveBox.intersectsBox(solBox)) return activarExplosion();

  for (let p of planetas) {
    const planetaBox = new THREE.Box3().setFromObject(p);
    if (naveBox.intersectsBox(planetaBox)) return activarExplosion();
  }
}

function activarExplosion() {
  explosionActiva = true;

  // Partículas de explosión
  const particleCount = 100;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) positions[i] = (Math.random() - 0.5) * 2;
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xff4400,
    size: 0.3,
    transparent: true,
  });

  explosion = new THREE.Points(geometry, material);
  explosion.position.copy(nave.position);
  scene.add(explosion);
  scene.remove(nave);

  // Animar explosión
  setTimeout(() => {
    scene.remove(explosion);
    explosionActiva = false;
    resetNave();
  }, 3000);
}

function resetNave() {
  nave.position.set(0, 0, 40);
  nave.rotation.set(0, 0, 0);
  scene.add(nave);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  cameraNave.aspect = window.innerWidth / window.innerHeight;
  cameraNave.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Rotación del Sol
  estrella.rotation.y += 0.001;

  // Planetas (órbita horizontal en plano XZ)
  planetas.forEach((p) => {
    p.userData.angulo += p.userData.velocidad;
    p.position.x = Math.cos(p.userData.angulo) * p.userData.distancia;
    p.position.z = Math.sin(p.userData.angulo) * p.userData.distancia;
    p.rotation.y += p.userData.rotacion;
  });

  // Lunas
  lunas.forEach((l) => {
    const padre = l.userData.planetaPadre;
    l.userData.angulo += l.userData.velocidad;
    l.position.x = padre.position.x + Math.cos(l.userData.angulo) * l.userData.distancia;
    l.position.z = padre.position.z + Math.sin(l.userData.angulo) * l.userData.distancia;
  });

  // Vista nave
  if (vistaNave && naveCargada) {
    moverNave();
    detectarColisiones();
    const offset = new THREE.Vector3(0, 2, 8).applyQuaternion(nave.quaternion);
    cameraNave.position.copy(nave.position.clone().add(offset));
    const lookAtPos = nave.position.clone().add(new THREE.Vector3(0, 0, -5).applyQuaternion(nave.quaternion));
    cameraNave.lookAt(lookAtPos);
    renderer.render(scene, cameraNave);
  } else {
    renderer.render(scene, camera);
  }

  // Animar partículas de explosión
  if (explosion) {
    const positions = explosion.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i++) positions[i] *= 1.05;
    explosion.geometry.attributes.position.needsUpdate = true;
  }
}
