import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const ENVS = {
  studio: {
    label: 'Studio',
    bg: 0x0c0e11,
    fogNear: 12,
    fogFar: 22,
    exposure: 0.9,
    keyIntensity: 1.15,
    fillIntensity: 0.35,
    rimIntensity: 0.55,
  },
  gallery: {
    label: 'Gallery',
    bg: 0x1a1f27,
    fogNear: 14,
    fogFar: 28,
    exposure: 1.05,
    keyIntensity: 1.35,
    fillIntensity: 0.55,
    rimIntensity: 0.4,
  },
};

export function createShowroom(renderer) {
  const scene = new THREE.Scene();

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envMap;
  pmrem.dispose();

  const hemi = new THREE.HemisphereLight(0xdde4f0, 0x1a1510, 0.45);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xfff5e8, 1.15);
  key.position.set(5, 8, -3);
  key.castShadow = false;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xb8c8e0, 0.35);
  fill.position.set(-6, 3, 4);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffe0c0, 0.55);
  rim.position.set(-2, 4, -6);
  scene.add(rim);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(9, 64),
    new THREE.MeshStandardMaterial({
      color: 0x15181e,
      metalness: 0.85,
      roughness: 0.35,
      envMapIntensity: 0.6,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.001;
  floor.receiveShadow = true;
  scene.add(floor);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(3.2, 3.28, 64),
    new THREE.MeshBasicMaterial({
      color: 0xc4a574,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.002;
  scene.add(ring);

  const grid = new THREE.GridHelper(18, 36, 0xffffff, 0xffffff);
  grid.material.opacity = 0.06;
  grid.material.transparent = true;
  grid.material.depthWrite = false;
  grid.position.y = 0.003;
  scene.add(grid);

  let envId = 'studio';

  function applyEnvironment(id) {
    const cfg = ENVS[id] || ENVS.studio;
    envId = id;
    scene.background = new THREE.Color(cfg.bg);
    scene.fog = new THREE.Fog(cfg.bg, cfg.fogNear, cfg.fogFar);
    renderer.toneMappingExposure = cfg.exposure;
    key.intensity = cfg.keyIntensity;
    fill.intensity = cfg.fillIntensity;
    rim.intensity = cfg.rimIntensity;
    floor.material.color.set(id === 'gallery' ? 0x222830 : 0x15181e);
    return cfg.label;
  }

  applyEnvironment('studio');

  return {
    scene,
    floor,
    grid,
    lights: { key, fill, rim, hemi },
    applyEnvironment,
    getEnvironmentId: () => envId,
    toggleEnvironment() {
      return applyEnvironment(envId === 'studio' ? 'gallery' : 'studio');
    },
  };
}
