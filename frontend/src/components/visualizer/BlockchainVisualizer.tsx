import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FontLoader, TextGeometry, OrbitControls } from 'three-stdlib';
import * as Tone from 'tone';
import { ExpandIcon, MinimizeIcon } from 'lucide-react';

const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

interface BlockchainVisualizerProps {
  darkMode: boolean;
  blocks: any[];
  transactions: any[];
}

const BLOCK_RADIUS = 8;
const BLOCK_COLORS = ['#a259ff', '#6b46c1', '#00cfff', '#ffb6ff', '#805AD5'];
const EQ_BAR_COUNT = 16;
const EQ_RADIUS = 11;
const EQ_COLORS = ['#a259ff', '#00cfff', '#ffb6ff', '#ff5c8a', '#fff200'];
const TEXT_COLOR = '#fff';
const SWING_RADIUS = 13;

const BlockchainVisualizer = ({
  darkMode,
  blocks = [],
  transactions = [],
}: BlockchainVisualizerProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const blocksGroupRef = useRef<THREE.Group>(new THREE.Group());
  const textGroupRef = useRef<THREE.Group>(new THREE.Group());
  const txGroupRef = useRef<THREE.Group>(new THREE.Group());
  const shootingStarsRef = useRef<THREE.Group>(new THREE.Group());
  const eqBarsRef = useRef<THREE.Group>(new THREE.Group());
  const animationFrameId = useRef<number | null>(null);
  const [hoverInfo, setHoverInfo] = useState<any | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);
  const fftRef = useRef<any>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    if (!isWebGLAvailable()) {
      setError("WebGL is not supported in your browser.");
      return;
    }

    try {
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      scene.background = new THREE.Color(darkMode ? '#0a0a0a' : '#F3F4F6');

      const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
      cameraRef.current = camera;
      camera.position.set(0, 8, 22);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      rendererRef.current = renderer;
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      mountRef.current.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
      directionalLight.position.set(10, 10, 10);
      scene.add(directionalLight);

      const floorGeo = new THREE.CircleGeometry(22, 64);
      const floorMat = new THREE.MeshPhongMaterial({
        color: darkMode ? '#1a0a2a' : '#eaeaff', transparent: true, opacity: 0.7,
        shininess: 100, emissive: darkMode ? '#1a0a2a' : '#eaeaff', emissiveIntensity: 0.3,
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.5;
      scene.add(floor);

      scene.add(blocksGroupRef.current);
      scene.add(textGroupRef.current);
      scene.add(txGroupRef.current);
      scene.add(shootingStarsRef.current);
      scene.add(eqBarsRef.current);
      
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      
      const startAudio = () => {
        if (!audioStarted) {
          Tone.start();
          fftRef.current = new Tone.FFT(EQ_BAR_COUNT).toDestination();
          setAudioStarted(true);
        }
      };
      renderer.domElement.addEventListener('click', startAudio);

      let swingPhase = 0;
      let eqPhases = Array(EQ_BAR_COUNT).fill(0);

      const animate = () => {
        animationFrameId.current = requestAnimationFrame(animate);
        controls.update();

        if (blocksGroupRef.current) blocksGroupRef.current.rotation.y += 0.002;

        shootingStarsRef.current.children.forEach((star: any) => {
          if (star.userData.progress < 1) {
            star.userData.progress += 0.025;
            star.position.lerpVectors(star.userData.from, star.userData.to, star.userData.progress);
          } else {
            shootingStarsRef.current.remove(star);
          }
        });

        let eqValues: number[] = [];
        if (audioStarted && fftRef.current) {
          eqValues = fftRef.current.getValue().map((v: number) => Math.max(0.2, (v + 140) / 60));
        } else {
          eqValues = eqPhases.map((p, i) => 1 + 0.7 * Math.abs(Math.sin(p + swingPhase + i)));
          eqPhases = eqPhases.map((p, i) => p + 0.04 + 0.01 * i);
        }

        if (eqBarsRef.current.children.length === 0) {
            for (let i = 0; i < EQ_BAR_COUNT; i++) {
                const barGeo = new THREE.BoxGeometry(0.7, 1, 0.7);
                const barMat = new THREE.MeshPhongMaterial({ color: EQ_COLORS[i % EQ_COLORS.length] });
                const bar = new THREE.Mesh(barGeo, barMat);
                eqBarsRef.current.add(bar);
            }
        }
        
        eqBarsRef.current.children.forEach((bar: any, i: number) => {
            const angle = (i / EQ_BAR_COUNT) * Math.PI * 2;
            bar.position.x = Math.cos(angle) * EQ_RADIUS;
            bar.position.z = Math.sin(angle) * EQ_RADIUS;
            bar.position.y = eqValues[i] / 2;
            bar.scale.y = eqValues[i];
        });

        swingPhase += 0.012;
        textGroupRef.current.children.forEach((mesh: any, i: number) => {
          const angle = swingPhase + (i / (textGroupRef.current.children.length || 1)) * Math.PI * 2;
          mesh.position.x = Math.cos(angle) * SWING_RADIUS;
          mesh.position.z = Math.sin(angle) * SWING_RADIUS;
          mesh.position.y = 3 + Math.sin(angle * 2) * 1.2;
          mesh.lookAt(cameraRef.current!.position);
        });

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (mountRef.current && cameraRef.current && rendererRef.current) {
          const width = mountRef.current.clientWidth;
          const height = mountRef.current.clientHeight;
          cameraRef.current.aspect = width / height;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(width, height);
        }
      };
      window.addEventListener('resize', handleResize);

      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', handleFullscreenChange);

      return () => {
        if (animationFrameId.current !== null) cancelAnimationFrame(animationFrameId.current);
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        if (mountRef.current && rendererRef.current) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
      };
    } catch (err) {
      console.error("Failed to initialize visualizer:", err);
      setError("Failed to initialize 3D visualizer.");
    }
  }, [darkMode]);

  useEffect(() => {
    const blocksToRender = blocks;
    const txToRender = transactions;

    if (!blocksGroupRef.current || !textGroupRef.current || !txGroupRef.current || !shootingStarsRef.current || !blocksToRender) return;

    while (blocksGroupRef.current.children.length > 0) blocksGroupRef.current.remove(blocksGroupRef.current.children[0]);
    while (textGroupRef.current.children.length > 0) textGroupRef.current.remove(textGroupRef.current.children[0]);
    while (txGroupRef.current.children.length > 0) txGroupRef.current.remove(txGroupRef.current.children[0]);
    while (shootingStarsRef.current.children.length > 0) shootingStarsRef.current.remove(shootingStarsRef.current.children[0]);

    if (blocksToRender.length === 0) return;

    const N = Math.min(12, blocksToRender.length);
    for (let i = 0; i < N; i++) {
      const block = blocksToRender[blocksToRender.length - N + i];
      if (!block) continue;
      const blockGeometry = new THREE.BoxGeometry(2, 1, 1);
      const blockMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(BLOCK_COLORS[i % BLOCK_COLORS.length]),
        transparent: true, opacity: 0.95, shininess: 180,
        emissive: new THREE.Color(BLOCK_COLORS[i % BLOCK_COLORS.length]), emissiveIntensity: 0.45,
      });
      const mesh = new THREE.Mesh(blockGeometry, blockMaterial);
      mesh.userData.block = block;
      const angle = i / N * Math.PI * 2;
      mesh.position.x = Math.cos(angle) * BLOCK_RADIUS;
      mesh.position.z = Math.sin(angle) * BLOCK_RADIUS;
      mesh.position.y = 0.5;
      mesh.rotation.y = -angle + Math.PI / 2;
      blocksGroupRef.current.add(mesh);
    }

    const loader = new FontLoader();
    loader.load('https://cdn.jsdelivr.net/npm/three@0.150.1/examples/fonts/helvetiker_regular.typeface.json', (font: any) => {
      blocksToRender.slice(-5).forEach((block) => {
        const textGeo = new TextGeometry(`#${parseInt(block.number, 16)}`, { font, size: 0.7, height: 0.2 });
        const textMat = new THREE.MeshBasicMaterial({ color: TEXT_COLOR, transparent: true, opacity: 0.9 });
        const textMesh = new THREE.Mesh(textGeo, textMat);
        textGroupRef.current.add(textMesh);
      });
    });

    txToRender.slice(-10).forEach(tx => {
        const fromIdx = blocksToRender.findIndex(b => b.hash === tx.blockHash);
        const toIdx = Math.floor(Math.random() * N); // Random destination for visual flair
        if (fromIdx === -1 || fromIdx === toIdx) return;
        
        const fromAngle = (fromIdx % N) / N * Math.PI * 2;
        const toAngle = (toIdx % N) / N * Math.PI * 2;
        const fromPos = new THREE.Vector3(Math.cos(fromAngle) * BLOCK_RADIUS, 0, Math.sin(fromAngle) * BLOCK_RADIUS);
        const toPos = new THREE.Vector3(Math.cos(toAngle) * BLOCK_RADIUS, 0, Math.sin(toAngle) * BLOCK_RADIUS);

        const starGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const starMat = new THREE.MeshBasicMaterial({ color: '#00cfff' });
        const star = new THREE.Mesh(starGeo, starMat);
        star.position.copy(fromPos);
        star.userData = { from: fromPos, to: toPos, progress: 0 };
        shootingStarsRef.current.add(star);
    });

  }, [blocks, transactions]);

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch((err) => {
        alert(`Error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-700/50 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="w-full h-full relative" style={{ touchAction: 'none' }}>
      <div ref={mountRef} className="w-full h-full" />
      <button onClick={toggleFullscreen} className="absolute top-2 right-2 z-10 p-2 text-white bg-black/30 hover:bg-black/50 rounded-full">
        {isFullscreen ? <MinimizeIcon size={18} /> : <ExpandIcon size={18} />}
      </button>
      {hoverInfo && hoverPos && (
        <div style={{
          position: 'fixed', left: hoverPos.x + 16, top: hoverPos.y + 8, zIndex: 9999,
          background: 'rgba(30, 10, 60, 0.98)', color: '#fff', border: '1.5px solid #a259ff',
          borderRadius: 10, padding: '12px 18px', fontSize: 14, pointerEvents: 'none',
        }}>
          <div style={{ fontWeight: 700, color: '#a259ff', marginBottom: 4 }}>Block #{parseInt(hoverInfo.number, 16)}</div>
          <div style={{ fontSize: 12, color: '#bdb4e6', wordBreak: 'break-all' }}>Hash: {hoverInfo.hash}</div>
        </div>
      )}
    </div>
  );
};

export default BlockchainVisualizer;