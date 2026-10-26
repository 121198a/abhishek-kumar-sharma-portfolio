
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Characters, Visitor } from "../characters/Characters";
import { send } from "../experience/ExperienceDirector";
import { useExperience } from "../store/experienceStore";
import { useLoading } from "../store/loadingStore";
import { useSettings } from "../store/settingsStore";
import { useUi } from "../store/uiStore";
import { OfficeWorld } from "../world/OfficeWorld";
import { CameraRig } from "./CameraRig";
import { getMoveInput } from "./useInput";
import { world } from "./worldRef";

function Runtime() {
  const previousNearby = useRef<unknown>(undefined);

  useFrame((state, dt) => {
    const { name, sub, context } = useExperience.getState();

    world.sim.update(
      dt,
      { name, sub, context },
      getMoveInput(),
      state.clock.elapsedTime,
    );

    const nearby = world.sim.nearby;

    if (previousNearby.current !== nearby) {
      previousNearby.current = nearby;
      useExperience.getState().setNearby(nearby);
    }
  });

  return null;
}

function Lights() {
  const quality = useSettings((s) => s.quality);
  const scene = useThree((t) => t.scene);
  const light = useRef<THREE.DirectionalLight>(null);

  const shadows = quality !== "low";
  const size = quality === "high" ? 2048 : 1024;

  useEffect(() => {
    const l = light.current;
    if (!l) return;

    l.target.position.set(0, 0, 24);
    scene.add(l.target);

    return () => {
      scene.remove(l.target);
    };
  }, [scene]);

  return (
    <>
      <hemisphereLight args={["#f0f5f7", "#8c8375", 1.05]} />

      <directionalLight
        ref={light}
        position={[34, 60, 62]}
        intensity={2.2}
        color="#fff4e0"
        castShadow={shadows}
        shadow-mapSize={[size, size]}
        shadow-camera-left={-62}
        shadow-camera-right={62}
        shadow-camera-top={62}
        shadow-camera-bottom={-62}
        shadow-camera-near={5}
        shadow-camera-far={190}
        shadow-bias={-0.0003}
      />

      {quality !== "low" && (
        <>
          <pointLight
            position={[3, 2.8, 12]}
            intensity={14}
            distance={14}
            color="#ffe2b5"
          />

          <pointLight
            position={[-21, 2.8, -11]}
            intensity={13}
            distance={13}
            color="#ffe2b5"
          />

          <pointLight
            position={[14, 2.8, -9.5]}
            intensity={14}
            distance={14}
            color="#ffe2b5"
          />

          <pointLight
            position={[24, 2.7, -12]}
            intensity={12}
            distance={11}
            color="#ffe0ac"
          />

          <pointLight
            position={[-11, 2.8, 9]}
            intensity={12}
            distance={12}
            color="#ffe2b5"
          />

          <pointLight
            position={[15, 2.8, 9]}
            intensity={12}
            distance={12}
            color="#ffe2b5"
          />

          <pointLight
            position={[1.4, 3.4, 66]}
            intensity={14}
            distance={14}
            color="#ffd89c"
          />
        </>
      )}
    </>
  );
}

/** Free 360-degree inspection controls. */
function Orbit() {
  const target = useMemo(
    () => [world.camTarget.x, 1.2, world.camTarget.z] as [number, number, number],
    [],
  );

  return (
    <OrbitControls
      makeDefault
      target={target}
      enableDamping
      dampingFactor={0.08}
      minDistance={2.5}
      maxDistance={65}
      maxPolarAngle={Math.PI / 2.12}
      minPolarAngle={0.15}
    />
  );
}

function WebGLRecovery() {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();

      send({
        type: "asset:failed",
        reason:
          "The 3D graphics context was lost. Reload the experience to recover.",
      });
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, {
      once: true,
    });

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
    };
  }, [gl]);

  return null;
}

function Ready() {
  const mark = useLoading((s) => s.mark);

  useEffect(() => {
    mark("renderer");
    mark("scene");

    const timer = window.setTimeout(() => {
      mark("renderer");
      mark("scene");
      mark("fonts");
    }, 400);

    const fonts = document.fonts;

    if (fonts) {
      fonts.ready.then(
        () => mark("fonts"),
        () => mark("fonts"),
      );
    } else {
      mark("fonts");
    }

    return () => window.clearTimeout(timer);
  }, [mark]);

  return null;
}

export default function Scene() {
  const quality = useSettings((s) => s.quality);
  const cameraMode = useUi((s) => s.cameraMode);

  const dpr: [number, number] =
    quality === "high"
      ? [1, 2]
      : quality === "medium"
        ? [1, 1.5]
        : [1, 1];

  return (
    <Canvas
      shadows={quality !== "low" ? { type: THREE.PCFShadowMap } : false}
      dpr={dpr}
      camera={{
        fov: 38,
        near: 0.5,
        far: 500,
        position: [0, 78, 86],
      }}
      gl={{
        antialias: quality !== "low",
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearColor("#a9c4cf");
      }}
      aria-label="3D virtual office"
    >
      <Lights />
      <OfficeWorld />
      <Characters />
      <Visitor />
      <CameraRig />

      {cameraMode === "orbit" && <Orbit />}

      <Runtime />
      <Ready />
      <WebGLRecovery />
    </Canvas>
  );
}
