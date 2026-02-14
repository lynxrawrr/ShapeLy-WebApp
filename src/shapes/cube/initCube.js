import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initCube({ mountEl, onExampleChange }) {
  /* Scene */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(4, 4, 6);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  mountEl.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI / 1.8;

  const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
  gridHelper.position.y = -2.2;
  scene.add(gridHelper);

  /* Params */
  let faceSize = 1;
  let halfSize = faceSize / 2;

  /* Materials */
  const materials = {
    front: new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
    back: new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
    top: new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
    bottom: new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
    right: new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
    left: new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }),
  };

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 2,
  });

  /* Face factory */
  function createFace(material, name) {
    const group = new THREE.Group();
    const geometry = new THREE.PlaneGeometry(faceSize, faceSize);
    const mesh = new THREE.Mesh(geometry, material);
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    group.add(mesh);
    group.add(edges);
    group.userData.name = name;
    return group;
  }

  /* Faces & pivots */
  const frontPivot = new THREE.Group();
  scene.add(frontPivot);
  const frontFace = createFace(materials.front, "front");
  frontFace.position.set(0, 0, halfSize);
  frontPivot.add(frontFace);
  frontPivot.userData.target = {
    rotation: new THREE.Euler(0, Math.PI, 0),
    position: new THREE.Vector3(faceSize * 2, 0, 0),
  };

  const leftPivot = new THREE.Group();
  scene.add(leftPivot);
  const leftFace = createFace(materials.left, "left");
  leftFace.rotation.y = -Math.PI / 2;
  leftFace.position.set(-halfSize, 0, 0);
  leftPivot.add(leftFace);
  leftPivot.userData.target = {
    rotation: new THREE.Euler(0, -Math.PI / 2, 0),
    position: new THREE.Vector3(-faceSize, 0, 0),
  };

  const rightPivot = new THREE.Group();
  scene.add(rightPivot);
  const rightFace = createFace(materials.right, "right");
  rightFace.rotation.y = Math.PI / 2;
  rightFace.position.set(halfSize, 0, 0);
  rightPivot.add(rightFace);
  rightPivot.userData.target = {
    rotation: new THREE.Euler(0, Math.PI / 2, 0),
    position: new THREE.Vector3(faceSize, 0, 0),
  };

  const topPivot = new THREE.Group();
  scene.add(topPivot);
  const topFace = createFace(materials.top, "top");
  topFace.rotation.x = -Math.PI / 2;
  topFace.position.set(0, halfSize, 0);
  topPivot.add(topFace);
  topPivot.userData.target = {
    rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
    position: new THREE.Vector3(0, faceSize, 0),
  };

  const bottomPivot = new THREE.Group();
  scene.add(bottomPivot);
  const bottomFace = createFace(materials.bottom, "bottom");
  bottomFace.rotation.x = Math.PI / 2;
  bottomFace.position.set(0, -halfSize, 0);
  bottomPivot.add(bottomFace);
  bottomPivot.userData.target = {
    rotation: new THREE.Euler(Math.PI / 2, 0, 0),
    position: new THREE.Vector3(0, -faceSize, 0),
  };

  const backFace = createFace(materials.back, "back");
  backFace.position.set(0, 0, -halfSize);
  scene.add(backFace);

  const pivots = [frontPivot, leftPivot, rightPivot, topPivot, bottomPivot];
  const allFaces = [frontFace, leftFace, rightFace, topFace, bottomFace, backFace];

  /* Animation */
  let animating = false;
  let progress = 0;
  const animationSpeed = 0.01;
  let targetProgress = 0;
  let unfold = false;

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

  const vertexLabel = createInfoLabel("Titik Sudut (8 total)");
  const edgeLabel = createInfoLabel("Rusuk (12 total)");
  const faceLabel = createInfoLabel("Sisi (6 total)");

  infoLabels.push(
    {
      element: vertexLabel,
      position: new THREE.Vector3(halfSize, halfSize, halfSize),
      offset: { x: 10, y: -10 },
    },
    {
      element: edgeLabel,
      position: new THREE.Vector3(halfSize, halfSize, 0),
      offset: { x: 10, y: 0 },
    },
    {
      element: faceLabel,
      position: new THREE.Vector3(0, 0, halfSize + 0.01),
      offset: { x: 10, y: 10 },
    },
  );

  function updateInfoLabels() {
    if (!showInfo) {
      infoLabels.forEach((label) => (label.element.style.display = "none"));
      return;
    }

    const rect = mountEl.getBoundingClientRect();

    infoLabels.forEach((label) => {
      const vector = label.position.clone().project(camera);

      const x = (vector.x * 0.5 + 0.5) * rect.width;
      const y = (vector.y * -0.5 + 0.5) * rect.height;

      label.element.style.left = x + label.offset.x + "px";
      label.element.style.top = y + label.offset.y + "px";
      label.element.style.display = "block";
    });
  }

  /* Example */
  function emitExample() {
    const a = faceSize * 10;
    const v = a ** 3;
    const area = 6 * a ** 2;

    onExampleChange?.({
      lines: [
        `a = ${a.toFixed(0)} cm`,
        `V = ${a.toFixed(0)}³ = ${v.toFixed(0)} cm³`,
        `A = 6 x ${a.toFixed(0)}² = ${area.toFixed(0)} cm²`,
      ],
    });
  }

  /* Unfold math */
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function applyProgress(p) {
    const eased = easeInOutCubic(p);
    pivots.forEach((pivot) => {
      const target = pivot.userData.target;

      pivot.rotation.x = THREE.MathUtils.lerp(0, target.rotation.x, eased);
      pivot.rotation.y = THREE.MathUtils.lerp(0, target.rotation.y, eased);
      pivot.rotation.z = THREE.MathUtils.lerp(0, target.rotation.z, eased);

      pivot.position.x = THREE.MathUtils.lerp(0, target.position.x, eased);
      pivot.position.y = THREE.MathUtils.lerp(0, target.position.y, eased);
      pivot.position.z = THREE.MathUtils.lerp(0, target.position.z, eased);
    });
  }

  /* Size update */
  function updateCubeSize() {
    halfSize = faceSize / 2;
    emitExample();

    allFaces.forEach((face) => {
      const mesh = face.children[0];
      const edges = face.children[1];

      mesh.geometry.dispose();
      edges.geometry.dispose();

      const newGeometry = new THREE.PlaneGeometry(faceSize, faceSize);
      const newEdgeGeometry = new THREE.EdgesGeometry(newGeometry);

      mesh.geometry = newGeometry;
      edges.geometry = newEdgeGeometry;
    });

    frontFace.position.set(0, 0, halfSize);
    leftFace.position.set(-halfSize, 0, 0);
    rightFace.position.set(halfSize, 0, 0);
    topFace.position.set(0, halfSize, 0);
    bottomFace.position.set(0, -halfSize, 0);
    backFace.position.set(0, 0, -halfSize);

    infoLabels[0].position = new THREE.Vector3(halfSize, halfSize, halfSize);
    infoLabels[1].position = new THREE.Vector3(halfSize, halfSize, 0);
    infoLabels[2].position = new THREE.Vector3(0, 0, halfSize + 0.01);

    frontPivot.userData.target.position = new THREE.Vector3(faceSize * 2, 0, 0);
    leftPivot.userData.target.position = new THREE.Vector3(-faceSize, 0, 0);
    rightPivot.userData.target.position = new THREE.Vector3(faceSize, 0, 0);
    topPivot.userData.target.position = new THREE.Vector3(0, faceSize, 0);
    bottomPivot.userData.target.position = new THREE.Vector3(0, -faceSize, 0);

    applyProgress(progress);
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
  emitExample();
  applyProgress(progress);

  /* Loop */
  let raf = 0;

  function animate() {
    raf = requestAnimationFrame(animate);

    if (animating) {
      if (Math.abs(progress - targetProgress) > 0.001) {
        progress += (targetProgress - progress) * animationSpeed * 3;
      } else {
        progress = targetProgress;
        animating = false;
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
  function unfoldNet() {
    targetProgress = 1;
    unfold = true;
    if (showInfo) {
      infoLabels.forEach((l) => (l.element.style.display = "none"));
      showInfo = false;
    }
    animating = true;
  }

  function foldNet() {
    targetProgress = 0;
    unfold = false;
    animating = true;
  }

  function toggleInfo() {
    if (unfold) return;
    showInfo = !showInfo;
    updateInfoLabels();
  }

  function zoomIn() {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    camera.position.addScaledVector(direction, 0.5);
    controls.update();
  }

  function zoomOut() {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    camera.position.addScaledVector(direction, -0.5);
    controls.update();
  }

  function addSize() {
    if (faceSize <= 2.5) {
      faceSize += 0.1;
      updateCubeSize();
    }
  }

  function reduceSize() {
    if (faceSize > 0.3) {
      faceSize -= 0.1;
      updateCubeSize();
    }
  }

  function resetView() {
    camera.position.set(4, 4, 6);
    controls.target.set(0, 0, 0);
    controls.update();
  }

  /* Cleanup */
  function destroy() {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);

    infoLabels.forEach((l) => l.element.remove());

    renderer.dispose();
    mountEl.removeChild(renderer.domElement);

    allFaces.forEach((face) => {
      const mesh = face.children[0];
      const edges = face.children[1];
      mesh.geometry?.dispose?.();
      edges.geometry?.dispose?.();
    });
  }

  return {
    unfold: unfoldNet,
    fold: foldNet,
    toggleInfo,
    zoomIn,
    zoomOut,
    addSize,
    reduceSize,
    resetView,
    destroy,
  };
}