import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initPyramid({ mountEl, onExampleChange }) {
  /* Scene */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const ambient = new THREE.AmbientLight(0xffffff, 3.33);
  scene.add(ambient);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(6.5, 5.5, 6.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  mountEl.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI / 1.8;

  const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
  gridHelper.position.y = -2;
  scene.add(gridHelper);

  /* Params */
  let halfSide = 1; // setengah sisi alas (karena v0=[s,0,s])
  let height = 2;

  /* Animation state */
  let isUnfolding = false;
  let animationTime = 0; // 0 folded -> 1 unfolded
  const animationSpeed = 0.015;
  let unfolded = false;

  /* Info labels (DOM) */
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

  const labelVertex = createInfoLabel("Titik sudut (5 total)");
  const labelEdge = createInfoLabel("Rusuk (8 total)");
  const labelFace = createInfoLabel("Sisi (5 total)");

  infoLabels.push(
    {
      element: labelVertex,
      getPos: () => new THREE.Vector3(0, height, 0),
      offset: { x: 10, y: -10 },
    },
    {
      element: labelEdge,
      getPos: () => new THREE.Vector3(0, 0, halfSide),
      offset: { x: 10, y: 0 },
    },
    {
      element: labelFace,
      getPos: () => new THREE.Vector3(halfSide * 0.7, height / 2, 0),
      offset: { x: 10, y: 10 },
    },
  );

  function updateInfoLabels() {
    // info cuma saat folded
    if (!showInfo || unfolded) {
      infoLabels.forEach((l) => (l.element.style.display = "none"));
      return;
    }

    const rect = mountEl.getBoundingClientRect();

    infoLabels.forEach((label) => {
      const world = label.getPos().clone();
      const v = world.project(camera);

      const x = (v.x * 0.5 + 0.5) * rect.width;
      const y = (v.y * -0.5 + 0.5) * rect.height;

      label.element.style.left = `${x + label.offset.x}px`;
      label.element.style.top = `${y + label.offset.y}px`;
      label.element.style.display = "block";
    });
  }

  /* Pyramid model data */
  let pyramidGroup = new THREE.Group();
  const rotationAxes = []; // axis engsel tiap sisi
  const sideData = []; // { group, axisIndex, dir }

  function disposeGroup(group) {
    group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose?.();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.());
        else obj.material.dispose?.();
      }
    });
  }

  function makeSideFace(t1, t2, apex) {
    const tri = new THREE.BufferGeometry();

    const p1 = new THREE.Vector3(t1[0], t1[1], t1[2]);
    const p2 = new THREE.Vector3(t2[0], t2[1], t2[2]);

    const axis = new THREE.Vector3().subVectors(p2, p1).normalize();
    rotationAxes.push(axis);

    const centerX = (t1[0] + t2[0]) / 2;
    const centerZ = (t1[2] + t2[2]) / 2;
    const centerY = t1[1];

    const v1 = [t1[0] - centerX, t1[1] - centerY, t1[2] - centerZ];
    const v2 = [t2[0] - centerX, t2[1] - centerY, t2[2] - centerZ];
    const v3 = [apex[0] - centerX, apex[1] - centerY, apex[2] - centerZ];

    tri.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([...v1, ...v2, ...v3]), 3),
    );
    tri.setIndex([0, 1, 2]);
    tri.computeVertexNormals();

    const faceMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.6,
      side: THREE.DoubleSide,
    });

    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      wireframe: true,
    });

    const face = new THREE.Mesh(tri, faceMat);
    const wire = new THREE.Mesh(tri, wireMat);

    const hinge = new THREE.Group();
    hinge.position.set(centerX, centerY, centerZ);
    hinge.add(face, wire);

    return hinge;
  }

  function emitExample() {
    // style skala kamu: 1 unit = 5 cm, dan halfSide = setengah sisi alas
    const a = halfSide * 2 * 5; // sisi alas (cm)
    const t = height * 5; // tinggi (cm)

    const baseArea = a * a;
    const V = (baseArea * t) / 3;

    // tetap gaya kamu (bukan slant height presisi)
    const A = baseArea + 4 * ((a * t) / 2);

    onExampleChange?.({
      lines: [
        `anggap s = ${a.toFixed(0)} cm, t = ${t.toFixed(0)} cm`,
        `V = (1/3) × ${a.toFixed(0)}² × ${t.toFixed(0)} = ${V.toFixed(0)} cm³`,
        `A = ${a.toFixed(0)}² + 4 × (1/2 × ${a.toFixed(0)} × ${t.toFixed(0)}) = ${A.toFixed(0)} cm²`,
      ],
    });
  }

  function buildPyramid(size, h) {
    scene.remove(pyramidGroup);
    disposeGroup(pyramidGroup);

    pyramidGroup = new THREE.Group();
    rotationAxes.length = 0;
    sideData.length = 0;

    const s = size;

    const v0 = [s, 0, s];
    const v1 = [s, 0, -s];
    const v2 = [-s, 0, -s];
    const v3 = [-s, 0, s];
    const v4 = [0, h, 0];

    const baseGeom = new THREE.BufferGeometry();
    baseGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([...v0, ...v1, ...v2, ...v3]), 3),
    );
    baseGeom.setIndex([0, 1, 2, 2, 3, 0]);
    baseGeom.computeVertexNormals();

    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.6,
      side: THREE.DoubleSide,
    });

    const base = new THREE.Mesh(baseGeom, baseMat);
    pyramidGroup.add(base);

    const side1 = makeSideFace(v0, v1, v4);
    const side2 = makeSideFace(v1, v2, v4);
    const side3 = makeSideFace(v2, v3, v4);
    const side4 = makeSideFace(v3, v0, v4);

    pyramidGroup.add(side1, side2, side3, side4);
    scene.add(pyramidGroup);

    sideData.push(
      { group: side1, axisIndex: 0, dir: 1 },
      { group: side2, axisIndex: 1, dir: 1 },
      { group: side3, axisIndex: 2, dir: 1 },
      { group: side4, axisIndex: 3, dir: 1 },
    );

    emitExample();
  }

  function resize() {
    const w = mountEl.clientWidth || 1;
    const h = mountEl.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  resize();
  buildPyramid(halfSide, height);

  /* Loop */
  let raf = 0;

  function animate() {
    raf = requestAnimationFrame(animate);

    if (isUnfolding) {
      animationTime += animationSpeed;
      if (animationTime > 1) animationTime = 1;
    } else {
      animationTime -= animationSpeed;
      if (animationTime < 0) animationTime = 0;
    }

    const maxAngle = Math.PI / 1.69;
    const targetAngle = animationTime * maxAngle;

    sideData.forEach((side) => {
      side.group.rotation.set(0, 0, 0);

      const axis = rotationAxes[side.axisIndex];
      const q = new THREE.Quaternion();
      q.setFromAxisAngle(axis, targetAngle * side.dir);
      side.group.setRotationFromQuaternion(q);
    });

    unfolded = animationTime > 0.5;

    controls.update();
    updateInfoLabels();
    renderer.render(scene, camera);
  }
  animate();

  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  /* API for React buttons */
  function unfold() {
    isUnfolding = true;
    if (showInfo) {
      showInfo = false;
      updateInfoLabels();
    }
  }

  function fold() {
    isUnfolding = false;
    if (showInfo) {
      showInfo = false;
      updateInfoLabels();
    }
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
    if (halfSide >= 2) return;

    halfSide += 0.1;
    height += 0.2;

    isUnfolding = false;
    animationTime = 0;
    unfolded = false;
    showInfo = false;
    updateInfoLabels();

    buildPyramid(halfSide, height);
  }

  function reduceSize() {
    if (halfSide <= 0.51) return;

    halfSide -= 0.1;
    height = Math.max(0.6, height - 0.2);

    isUnfolding = false;
    animationTime = 0;
    unfolded = false;
    showInfo = false;
    updateInfoLabels();

    buildPyramid(halfSide, height);
  }

  function resetView() {
    camera.position.set(6.5, 5.5, 6.5);
    controls.target.set(0, 0, 0);
    controls.update();
  }

  function destroy() {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);

    infoLabels.forEach((l) => l.element.remove());

    scene.remove(pyramidGroup);
    disposeGroup(pyramidGroup);

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
