import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export function createCarSystem(scene, { onProgress } = {}) {
  const materials = {
    body: new THREE.MeshPhysicalMaterial({
      color: 0xc40000,
      metalness: 1,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      envMapIntensity: 1.1,
    }),
    details: new THREE.MeshStandardMaterial({
      color: 0xd8d8d8,
      metalness: 1,
      roughness: 0.28,
      envMapIntensity: 1,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.05,
      transmission: 1,
      transparent: true,
      opacity: 1,
      envMapIntensity: 1.2,
    }),
    caliper: new THREE.MeshStandardMaterial({
      color: 0xd10000,
      metalness: 0.55,
      roughness: 0.4,
    }),
    leather: new THREE.MeshStandardMaterial({
      color: 0x8b1a1a,
      metalness: 0.05,
      roughness: 0.72,
    }),
    headlightOn: new THREE.MeshStandardMaterial({
      color: 0xfff6e0,
      emissive: 0xfff0c8,
      emissiveIntensity: 2.4,
      metalness: 0.1,
      roughness: 0.25,
    }),
    headlightOff: null,
    ledOn: new THREE.MeshStandardMaterial({
      color: 0xe8f4ff,
      emissive: 0xb8d8ff,
      emissiveIntensity: 3.2,
      metalness: 0.2,
      roughness: 0.2,
    }),
    ledOff: null,
  };

  const state = {
    root: null,
    wheels: [],
    meshIndex: new Map(),
    highlighted: [],
    headlightsOn: false,
    spinWheels: true,
    originalMaterials: new Map(),
  };

  function indexObject(root) {
    state.meshIndex.clear();
    root.traverse((obj) => {
      if (obj.name) {
        if (!state.meshIndex.has(obj.name)) state.meshIndex.set(obj.name, []);
        state.meshIndex.get(obj.name).push(obj);
      }
    });
  }

  function getByName(name) {
    return state.meshIndex.get(name) || [];
  }

  function applyMaterial(names, material) {
    for (const name of names) {
      for (const obj of getByName(name)) {
        if (obj.isMesh) obj.material = material;
      }
    }
  }

  function load() {
    return new Promise((resolve, reject) => {
      const draco = new DRACOLoader();
      draco.setDecoderPath('./vendor/draco/');
      draco.preload();

      const loader = new GLTFLoader();
      loader.setDRACOLoader(draco);

      loader.load(
        './assets/models/ferrari.glb',
        (gltf) => {
          const carModel = gltf.scene.children[0] || gltf.scene;
          carModel.position.set(0, 0, 0);
          indexObject(carModel);

          // Cache originals for headlights toggle (clone so we can restore)
          for (const obj of getByName('lights')) {
            if (obj.isMesh && !materials.headlightOff) {
              materials.headlightOff = obj.material.clone();
            }
          }
          for (const obj of getByName('leds')) {
            if (obj.isMesh && !materials.ledOff) {
              materials.ledOff = obj.material.clone();
            }
          }

          applyMaterial(['body'], materials.body);
          applyMaterial(
            ['rim_fl', 'rim_fr', 'rim_rl', 'rim_rr', 'trim', 'chrome', 'metal', 'nuts', 'centre'],
            materials.details
          );
          applyMaterial(['glass'], materials.glass);
          applyMaterial(['brakes', 'brake'], materials.caliper);
          applyMaterial(['leather', 'steering_leather'], materials.leather);

          state.wheels = [
            ...getByName('wheel_fl'),
            ...getByName('wheel_fr'),
            ...getByName('wheel_rl'),
            ...getByName('wheel_rr'),
          ];

          // Ground shadow decal
          const shadowTex = new THREE.TextureLoader().load('./assets/textures/ferrari_ao.png');
          shadowTex.colorSpace = THREE.NoColorSpace;
          const shadow = new THREE.Mesh(
            new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
            new THREE.MeshBasicMaterial({
              map: shadowTex,
              blending: THREE.MultiplyBlending,
              toneMapped: false,
              transparent: true,
              premultipliedAlpha: true,
            })
          );
          shadow.rotation.x = -Math.PI / 2;
          shadow.position.y = 0.004;
          shadow.renderOrder = 2;
          carModel.add(shadow);

          state.root = carModel;
          scene.add(carModel);
          resolve(carModel);
        },
        (ev) => {
          if (onProgress && ev.total) onProgress(ev.loaded / ev.total);
        },
        reject
      );
    });
  }

  function setBodyColor(hex) {
    materials.body.color.set(hex);
  }

  function setDetailsColor(hex) {
    materials.details.color.set(hex);
  }

  function setCaliperColor(hex) {
    materials.caliper.color.set(hex);
  }

  function setGlassColor(hex, transmission = 1) {
    materials.glass.color.set(hex);
    materials.glass.transmission = transmission;
  }

  function setLeatherColor(hex) {
    materials.leather.color.set(hex);
  }

  function setHeadlights(on) {
    state.headlightsOn = on;
    applyMaterial(['lights'], on ? materials.headlightOn : materials.headlightOff || materials.headlightOn);
    applyMaterial(['leds'], on ? materials.ledOn : materials.ledOff || materials.ledOn);
    // Taillights subtle when headlights on
    for (const obj of getByName('lights_red')) {
      if (obj.isMesh && obj.material && obj.material.emissive) {
        obj.material.emissiveIntensity = on ? 1.2 : 0.2;
      } else if (obj.isMesh && on) {
        const m = obj.material.clone();
        m.emissive = new THREE.Color(0xff2200);
        m.emissiveIntensity = 1.4;
        obj.material = m;
      }
    }
  }

  function setWheelSpin(on) {
    state.spinWheels = on;
  }

  function clearHighlight() {
    for (const entry of state.highlighted) {
      if (entry.mesh.material && entry.mesh.material.emissive) {
        entry.mesh.material.emissive.copy(entry.emissive);
        entry.mesh.material.emissiveIntensity = entry.intensity;
      }
    }
    state.highlighted = [];
  }

  function highlightMeshes(names = []) {
    clearHighlight();
    const nameSet = new Set(names);
    for (const name of nameSet) {
      for (const obj of getByName(name)) {
        if (!obj.isMesh) continue;
        const mat = obj.material;
        if (!mat) continue;
        // Clone to avoid shared-material side effects across parts
        const cloned = mat.clone();
        obj.material = cloned;
        if (!cloned.emissive) cloned.emissive = new THREE.Color(0x000000);
        state.highlighted.push({
          mesh: obj,
          emissive: cloned.emissive.clone(),
          intensity: cloned.emissiveIntensity ?? 0,
        });
        cloned.emissive.set(0xc4a574);
        cloned.emissiveIntensity = 0.35;
      }
    }
  }

  function update(delta) {
    if (!state.spinWheels) return;
    const speed = delta * Math.PI * 1.4;
    for (const wheel of state.wheels) {
      wheel.rotation.x += speed;
    }
  }

  return {
    load,
    materials,
    state,
    setBodyColor,
    setDetailsColor,
    setCaliperColor,
    setGlassColor,
    setLeatherColor,
    setHeadlights,
    setWheelSpin,
    highlightMeshes,
    clearHighlight,
    update,
    getByName,
  };
}
