import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initCuboid({ mountEl, onExampleChange }) {
  /* Scene */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(5, 4, 6);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  mountEl.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
  gridHelper.position.y = -2;
  scene.add(gridHelper);

  /* Params (p, l, t) in unit */
  // p=length, l=width, t=height
  let length = 3;
  let width = 2;
  let height = 1.5;

  /* Materials */
  const baseMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 2,
  });

  /* State */
  let faces = [];
  let animating = false;
  let targetProgress = 0; // 0 folded, 1 unfolded
  let progress = 0;
  const animationSpeed = 2;
  let unfolded = false;

  /* Info labels */
  let showInfo = false;
  const infoLabels = [];

  function createInfoLabel(text) {
    const label = document.createElement("div");
    label.className = "info-label";
    label.textContent = text;
    label.style.display = "none";
    mountEl.appendChild(label);
    return label;
  }

  const labelP = createInfoLabel("Panjang (p)");
  const labelL = createInfoLabel("Lebar (l)");
  const labelT = createInfoLabel("Tinggi (t)");

  infoLabels.push(
    { element: labelP, offset: { x: 10, y: 0 }, getWorldPos: getLabelPosP },
    { element: labelL, offset: { x: 10, y: 10 }, getWorldPos: getLabelPosL },
    { element: labelT, offset: { x: 10, y: -10 }, getWorldPos: getLabelPosT },
  );

  function getLabelPosP() {
    return new THREE.Vector3(length / 2, 0, width / 2);
  }
  function getLabelPosL() {
    return new THREE.Vector3(0, 0, width / 2);
  }
  function getLabelPosT() {
    return new THREE.Vector3(length / 2, height / 2, 0);
  }

  function updateInfoLabels() {
    if (!showInfo || unfolded) {
      infoLabels.forEach((l) => (l.element.style.display = "none"));
      return;
    }

    const rect = mountEl.getBoundingClientRect();

    infoLabels.forEach((label) => {
      const world = label.getWorldPos().clone();
      const v = world.project(camera);

      const x = (v.x * 0.5 + 0.5) * rect.width;
      const y = (v.y * -0.5 + 0.5) * rect.height;

      label.element.style.left = `${x + label.offset.x}px`;
      label.element.style.top = `${y + label.offset.y}px`;
      label.element.style.display = "block";
    });
  }

  /* Example */
  function emitExample() {
    const p = length * 10;
    const l = width * 10;
    const t = height * 10;
    const v = p * l * t;
    const a = 2 * (p * l + p * t + l * t);

    onExampleChange?.({
      lines: [
        `p = ${p.toFixed(0)} cm, l = ${l.toFixed(0)} cm, t = ${t.toFixed(0)} cm`,
        `V = ${p.toFixed(0)} × ${l.toFixed(0)} × ${t.toFixed(0)} = ${v.toFixed(0)} cm³`,
        `A = 2(pl + pt + lt) = ${a.toFixed(0)} cm²`,
      ],
    });
  }

  /* Build */
  function clearFaces() {
    faces.forEach((g) => {
      g.traverse((o) => {
        if (o.geometry) o.geometry.dispose?.();
        if (o.material && o.material !== baseMaterial && o.material !== edgeMaterial) {
          o.material.dispose?.();
        }
      });
      scene.remove(g);
    });
    faces = [];
  }

  function makeFace(w, h, name) {
    const group = new THREE.Group();
    const geom = new THREE.PlaneGeometry(w, h);
    const mesh = new THREE.Mesh(geom, baseMaterial.clone());
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geom),
      edgeMaterial.clone(),
    );
    group.add(mesh);
    group.add(edges);
    group.userData.name = name;
    return group;
  }

  function buildCuboid() {
    clearFaces();

    const halfL = length / 2;
    const halfW = width / 2;
    const halfH = height / 2;

    const cfgs = [
      { name: "front", size: [length, height], pos: [0, 0, halfW], rot: [0, 0, 0] },
      { name: "back", size: [length, height], pos: [0, 0, -halfW], rot: [0, Math.PI, 0] },

      { name: "top", size: [length, width], pos: [0, halfH, 0], rot: [-Math.PI / 2, 0, 0] },
      { name: "bottom", size: [length, width], pos: [0, -halfH, 0], rot: [Math.PI / 2, 0, 0] },

      { name: "right", size: [width, height], pos: [halfL, 0, 0], rot: [0, Math.PI / 2, 0] },
      { name: "left", size: [width, height], pos: [-halfL, 0, 0], rot: [0, -Math.PI / 2, 0] },
    ];

    cfgs.forEach((c) => {
      const face = makeFace(c.size[0], c.size[1], c.name);
      face.position.set(c.pos[0], c.pos[1], c.pos[2]);
      face.rotation.set(c.rot[0], c.rot[1], c.rot[2]);

      face.userData.initialPos = face.position.clone();
      face.userData.initialRot = face.rotation.clone();

      const target = getUnfoldTarget(c.name, halfL, halfW, halfH);
      face.userData.targetPos = target.pos;
      face.userData.targetRot = target.rot;

      scene.add(face);
      faces.push(face);
    });

    applyProgress(progress);
    emitExample();
  }

  function getUnfoldTarget(name, halfL, halfW, halfH) {
    //        top
    // left  front  right  back
    //       bottom
    const pos = new THREE.Vector3();
    const rot = new THREE.Euler(0, 0, 0);

    switch (name) {
      case "front":
        pos.set(0, 0, 0);
        break;
      case "right":
        pos.set(halfL + halfW, 0, 0);
        break;
      case "left":
        pos.set(-(halfL + halfW), 0, 0);
        break;
      case "back":
        pos.set(length + width, 0, 0);
        break;
      case "top":
        pos.set(0, halfH + halfW, 0);
        break;
      case "bottom":
        pos.set(0, -(halfH + halfW), 0);
        break;
    }

    return { pos, rot };
  }

  /* Unfold math */
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function applyProgress(p) {
    const eased = easeInOutCubic(p);

    faces.forEach((face) => {
      face.position.lerpVectors(face.userData.initialPos, face.userData.targetPos, eased);

      face.rotation.x = THREE.MathUtils.lerp(face.userData.initialRot.x, face.userData.targetRot.x, eased);
      face.rotation.y = THREE.MathUtils.lerp(face.userData.initialRot.y, face.userData.targetRot.y, eased);
      face.rotation.z = THREE.MathUtils.lerp(face.userData.initialRot.z, face.userData.targetRot.z, eased);
    });
  }

  /* Resize */
  function resize() {
    const w = mountEl.clientWidth || 1;
    const h = mountEl.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  resize();
  buildCuboid();

  /* Loop */
  let raf = 0;
  let lastTime = 0;

  function animate(time = 0) {
    raf = requestAnimationFrame(animate);

    const dt = Math.min(0.05, (time - lastTime) / 1000 || 0);
    lastTime = time;

    if (animating) {
      progress = THREE.MathUtils.damp(progress, targetProgress, animationSpeed, dt);

      if (Math.abs(progress - targetProgress) < 0.0005) {
        progress = targetProgress;
        animating = false;
        unfolded = targetProgress > 0.5;
      }

      applyProgress(progress);
    }

    controls.update();
    renderer.render(scene, camera);
    updateInfoLabels();
  }
  animate();

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  /* API */
  function unfold() {
    targetProgress = 1;
    unfolded = true;
    if (showInfo) {
      showInfo = false;
      updateInfoLabels();
    }
    animating = true;
  }

  function fold() {
    targetProgress = 0;
    unfolded = false;
    animating = true;
  }

  function toggleInfo() {
    if (unfolded) return;
    showInfo = !showInfo;
    updateInfoLabels();
  }

  function zoomIn() {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, 0.5);
    controls.update();
  }

  function zoomOut() {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    camera.position.addScaledVector(dir, -0.5);
    controls.update();
  }

  function addSize() {
    if (length >= 5) return;
    length += 0.2;
    width += 0.15;
    height += 0.1;

    progress = 0;
    targetProgress = 0;
    animating = false;
    unfolded = false;
    showInfo = false;
    updateInfoLabels();

    buildCuboid();
  }

  function reduceSize() {
    if (length <= 1.2) return;
    length -= 0.2;
    width = Math.max(0.8, width - 0.15);
    height = Math.max(0.6, height - 0.1);

    progress = 0;
    targetProgress = 0;
    animating = false;
    unfolded = false;
    showInfo = false;
    updateInfoLabels();

    buildCuboid();
  }

  function resetView() {
    camera.position.set(5, 4, 6);
    controls.target.set(0, 0, 0);
    controls.update();
  }

  /* Cleanup */
  function destroy() {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);

    infoLabels.forEach((l) => l.element.remove());
    clearFaces();

    renderer.dispose();
    mountEl.removeChild(renderer.domElement);
  }

  return {
    unfold,
    fold,
    toggleInfo,
    zoomIn,
    zoomOut,
    addSize,
    reduceSize,
    resetView,
    destroy,
  };
}
