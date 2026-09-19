import * as THREE from 'three';
import { createShowroom } from './showroom.js';
import { createCarSystem } from './car.js';
import { createCameraTour } from './camera-tour.js';
import { bindUI } from './ui.js';

const canvas = document.getElementById('viewport');
const loaderEl = document.getElementById('loader');
const loaderBar = document.getElementById('loader-bar');
const loaderLabel = document.getElementById('loader-label');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(4.25, 1.4, -4.5);

const showroom = createShowroom(renderer);
const cameraTour = createCameraTour(camera, canvas);
const car = createCarSystem(showroom.scene, {
  onProgress(p) {
    loaderBar.style.width = `${Math.round(p * 100)}%`;
    loaderLabel.textContent = `Loading vehicle… ${Math.round(p * 100)}%`;
  },
});

function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  cameraTour.controls.update(0);
}

window.addEventListener('resize', onResize);

function animate() {
  const { delta } = cameraTour.update();
  car.update(delta);
  renderer.render(showroom.scene, camera);
  requestAnimationFrame(animate);
}

async function boot() {
  try {
    loaderLabel.textContent = 'Preparing showroom…';
    await car.load();
    loaderBar.style.width = '100%';
    loaderLabel.textContent = 'Ready';
    bindUI({ car, cameraTour, showroom });
    loaderEl.classList.add('is-done');
    animate();
  } catch (err) {
    console.error(err);
    loaderLabel.textContent = 'Failed to load model. Check console / network.';
    loaderBar.style.background = '#d64545';
  }
}

boot();
