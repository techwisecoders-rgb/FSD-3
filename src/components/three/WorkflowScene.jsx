import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * WorkflowScene: 3D interactive service network built with Three.js.
 * WorkForce Connect Blue-and-White Palette:
 * - Slate light background: #F8FAFC
 * - Deep Royal Blue: #1E40AF
 * - Electric Blue: #2563EB
 * - Sky Blue accent: #38BDF8
 * - Pure White: #FFFFFF
 * 
 * Features interactive mouse-parallax, orbiting trade glyphs, and dynamic geometric network links.
 */
export default function WorkflowScene({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // Scene & Fog with clean slate #F8FAFC
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F8FAFC');
    scene.fog = new THREE.FogExp2('#F8FAFC', 0.035);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Blue & White Palette Colors
    const colDeepBlue = new THREE.Color('#1E40AF');
    const colElectricBlue = new THREE.Color('#2563EB');
    const colSkyBlue = new THREE.Color('#38BDF8');
    const colSoftBlue = new THREE.Color('#93C5FD');
    const colWhite = new THREE.Color('#FFFFFF');

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#93C5FD', 2.0);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight('#38BDF8', 2.5, 15);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // Network Group
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Central Core Hub (Dual Interlocking Ring & Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(0.75, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: colDeepBlue,
      metalness: 0.15,
      roughness: 0.25,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    networkGroup.add(coreMesh);

    // Core Wireframe Cage
    const wireMat = new THREE.MeshBasicMaterial({
      color: colSkyBlue,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const wireMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.85, 1), wireMat);
    networkGroup.add(wireMesh);

    // Orbiting Concentric Torus Rings
    const ringMat1 = new THREE.MeshStandardMaterial({ color: colSoftBlue, roughness: 0.3 });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.03, 16, 64), ringMat1);
    ring1.rotation.x = Math.PI / 3;
    networkGroup.add(ring1);

    const ringMat2 = new THREE.MeshStandardMaterial({ color: colElectricBlue, roughness: 0.25 });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.025, 16, 64), ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    networkGroup.add(ring2);

    // 6 Floating Trade Nodes representing the Daily Labour Specialties
    const tradeNodes = [];
    const geometries = [
      new THREE.OctahedronGeometry(0.35),      // Construction
      new THREE.TetrahedronGeometry(0.38),     // Packers & Movers
      new THREE.CylinderGeometry(0.15, 0.28, 0.5, 6), // Loading/Unloading
      new THREE.BoxGeometry(0.42, 0.42, 0.42), // Cleaners
      new THREE.DodecahedronGeometry(0.32),    // Event Workers
      new THREE.SphereGeometry(0.3, 16, 16),   // General Labour
    ];

    const nodeDist = 3.2;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * nodeDist;
      const y = Math.sin(angle) * (nodeDist * 0.55);
      const z = Math.sin(angle * 2) * 0.8;

      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? colDeepBlue : colElectricBlue,
        roughness: 0.25,
        metalness: 0.2,
      });

      const mesh = new THREE.Mesh(geometries[i], mat);
      mesh.position.set(x, y, z);

      // Mini white halo around each trade node
      const haloMat = new THREE.MeshBasicMaterial({
        color: colWhite,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
      const halo = new THREE.Mesh(new THREE.SphereGeometry(0.48, 8, 8), haloMat);
      mesh.add(halo);

      networkGroup.add(mesh);
      tradeNodes.push({ mesh, basePos: new THREE.Vector3(x, y, z), angle, speed: 0.8 + i * 0.1 });
    }

    // Dynamic Connection Lines linking Nodes to Core and to Neighbors
    const lineMat = new THREE.LineBasicMaterial({
      color: colElectricBlue,
      transparent: true,
      opacity: 0.5,
      linewidth: 1.5,
    });

    const linePositions = new Float32Array(6 * 2 * 3 + 6 * 2 * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    networkGroup.add(linesMesh);

    // Orbiting Dust Particles in blue palette
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 1.5 + Math.random() * 4.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      particlePositions[i] = r * Math.cos(theta) * Math.cos(phi);
      particlePositions[i + 1] = r * Math.sin(phi);
      particlePositions[i + 2] = r * Math.sin(theta) * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: colSkyBlue,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    networkGroup.add(particles);

    // Pointer Interactivity
    let targetRotX = 0;
    let targetRotY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.35;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera / network orientation easing
      networkGroup.rotation.y += (targetRotY - networkGroup.rotation.y) * 0.05 + 0.003;
      networkGroup.rotation.x += (targetRotX - networkGroup.rotation.x) * 0.05;

      // Rotate core elements
      coreMesh.rotation.y = elapsedTime * 0.3;
      coreMesh.rotation.x = elapsedTime * 0.2;
      wireMesh.rotation.y = -elapsedTime * 0.4;

      ring1.rotation.z = elapsedTime * 0.25;
      ring2.rotation.z = -elapsedTime * 0.35;

      particles.rotation.y = elapsedTime * 0.05;

      // Animate trade nodes and update connection line endpoints
      const posAttr = lineGeo.attributes.position;
      let lineIdx = 0;

      tradeNodes.forEach((node, i) => {
        const floatOffset = Math.sin(elapsedTime * node.speed + i) * 0.25;
        node.mesh.position.y = node.basePos.y + floatOffset;
        node.mesh.rotation.x += 0.015;
        node.mesh.rotation.y += 0.02;

        // Line from core (0,0,0) to node
        posAttr.setXYZ(lineIdx++, 0, 0, 0);
        posAttr.setXYZ(lineIdx++, node.mesh.position.x, node.mesh.position.y, node.mesh.position.z);

        // Line to next neighboring node
        const nextNode = tradeNodes[(i + 1) % tradeNodes.length];
        posAttr.setXYZ(lineIdx++, node.mesh.position.x, node.mesh.position.y, node.mesh.position.z);
        posAttr.setXYZ(lineIdx++, nextNode.mesh.position.x, nextNode.mesh.position.y, nextNode.mesh.position.z);
      });
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      geometries.forEach((g) => g.dispose());
      coreGeo.dispose();
      lineGeo.dispose();
      particleGeo.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[420px] pointer-events-auto cursor-grab active:cursor-grabbing overflow-hidden ${className}`}
      aria-label="Interactive 3D WorkForce Connect service network visual"
    />
  );
}
