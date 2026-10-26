import { Html } from "../components/HtmlOverlay";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Look } from "../data/types";
import type { Anim } from "../engine/WorldSimulation";

export type PersonState = { x: number; z: number; yaw: number; anim: Anim; moving: boolean };

type Props = {
  outfit: string;
  skin: string;
  hair: string;
  /** Called every frame to read the latest simulated state. */
  read: () => PersonState;
  look?: Look;
  label?: string;
  labelClass?: string;
  /** Show label only when within this distance of the visitor (pass -1 to always show). */
  bubble?: () => string | null;
  /** Direct interaction or click-to-select callback */
  onSelect?: () => void;
};

/**
 * Semi-realistic corporate 3D employee model with natural proportions, tailored business attire,
 * detailed facial features, segmented limbs, and smooth organic animations.
 */
export function Person({ outfit, skin, hair, look, read, label, labelClass, bubble, onSelect }: Props) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const chest = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  
  // Segmented arms
  const armL = useRef<THREE.Group>(null);
  const forearmL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const forearmR = useRef<THREE.Group>(null);
  
  // Segmented legs
  const legL = useRef<THREE.Group>(null);
  const shinL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const shinR = useRef<THREE.Group>(null);

  const bubbleEl = useRef<HTMLDivElement>(null);
  const lastBubble = useRef<string | null>("");

  const jacket = look?.jacket;
  const tie = look?.tie;
  const hairStyle = look?.hair ?? "short";
  const longTop = look?.longTop ?? false;
  const hasGlasses = look?.glasses ?? false;
  const accessory = look?.accessory ?? "none";

  const mats = useMemo(
    () => ({
      outfit: new THREE.MeshStandardMaterial({ color: outfit, roughness: 0.75 }),
      top: new THREE.MeshStandardMaterial({ color: jacket ?? outfit, roughness: 0.65 }),
      shirtCollar: new THREE.MeshStandardMaterial({ color: "#f8f7f4", roughness: 0.7 }),
      tie: new THREE.MeshStandardMaterial({ color: tie ?? "#caa35a", roughness: 0.35, metalness: 0.2 }),
      trousers: new THREE.MeshStandardMaterial({ color: longTop ? (jacket ?? outfit) : "#25282c", roughness: 0.8 }),
      skin: new THREE.MeshStandardMaterial({ color: skin, roughness: 0.6, metalness: 0.05 }),
      hair: new THREE.MeshStandardMaterial({ color: hair, roughness: 0.72 }),
      shoe: new THREE.MeshStandardMaterial({ color: "#161618", roughness: 0.35 }),
      belt: new THREE.MeshStandardMaterial({ color: "#1c1c1e", roughness: 0.4 }),
      buckle: new THREE.MeshStandardMaterial({ color: "#c5c9cc", roughness: 0.2, metalness: 0.9 }),
      glasses: new THREE.MeshStandardMaterial({ color: "#1a1a1c", roughness: 0.2, metalness: 0.8 }),
      glassesLens: new THREE.MeshPhysicalMaterial({ color: "#cce4ed", transparent: true, opacity: 0.3, roughness: 0.05 }),
      lanyard: new THREE.MeshStandardMaterial({ color: "#2563eb", roughness: 0.6 }),
      badge: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.3 }),
      shadow: new THREE.MeshBasicMaterial({ color: "#000000", transparent: true, opacity: 0.28, depthWrite: false }),
      propMetal: new THREE.MeshStandardMaterial({ color: "#2b2d30", roughness: 0.35, metalness: 0.8 }),
      propCeramic: new THREE.MeshStandardMaterial({ color: "#e8e5dc", roughness: 0.4 }),
    }),
    [outfit, skin, hair, jacket, tie, longTop],
  );

  useFrame(({ clock }) => {
    const s = read();
    const t = clock.elapsedTime;
    const r = root.current;
    if (!r) return;
    r.position.set(s.x, 0, s.z);
    r.rotation.y = s.yaw;
    const sc = look?.scale ?? 1;
    r.scale.setScalar(sc);

    const sitting = s.anim === "sit" || s.anim === "type";
    
    // Natural torso sway & breathing
    if (body.current) {
      body.current.position.y = sitting ? -0.32 : 0;
      body.current.position.z = sitting ? -0.14 : 0;
      // Subtle organic weight shift during idle
      const sway = s.anim === "idle" ? Math.sin(t * 1.2) * 0.012 : 0;
      body.current.rotation.z = sway;
      body.current.rotation.y = s.anim === "walk" ? Math.sin(t * 7.5) * 0.06 : 0;
    }

    if (chest.current) {
      // Breathing expansion
      const breath = 1 + Math.sin(t * 1.8) * 0.012;
      chest.current.scale.set(breath, breath, breath);
    }

    // Kinematic walking stride with knee articulation
    const isWalking = s.anim === "walk";
    const walkCycle = t * 7.2;
    const hipSwing = Math.sin(walkCycle) * 0.58;

    if (legL.current && legR.current && shinL.current && shinR.current) {
      if (sitting) {
        legL.current.rotation.x = -Math.PI / 2 + 0.08;
        legR.current.rotation.x = -Math.PI / 2 + 0.08;
        shinL.current.rotation.x = Math.PI / 2 - 0.08;
        shinR.current.rotation.x = Math.PI / 2 - 0.08;
      } else if (isWalking) {
        legL.current.rotation.x = hipSwing;
        legR.current.rotation.x = -hipSwing;
        // Knee flexes on backward swing phase
        shinL.current.rotation.x = Math.max(0, -Math.cos(walkCycle)) * 0.65;
        shinR.current.rotation.x = Math.max(0, Math.cos(walkCycle)) * 0.65;
      } else {
        // Natural relaxed standing stance
        legL.current.rotation.x = 0;
        legR.current.rotation.x = 0;
        shinL.current.rotation.x = 0;
        shinR.current.rotation.x = 0;
      }
    }

    // Segmented upper body & arm articulation
    if (armL.current && armR.current && forearmL.current && forearmR.current) {
      if (isWalking) {
        armL.current.rotation.x = -hipSwing * 0.55;
        armR.current.rotation.x = hipSwing * 0.55;
        armL.current.rotation.z = 0.08;
        armR.current.rotation.z = -0.08;
        forearmL.current.rotation.x = -0.25;
        forearmR.current.rotation.x = -0.25;
      } else if (s.anim === "wave") {
        // Friendly greeting wave on approach
        armL.current.rotation.x = 0.05;
        armL.current.rotation.z = 0.06;
        forearmL.current.rotation.x = 0;
        
        armR.current.rotation.x = -2.1 + Math.sin(t * 8) * 0.12;
        armR.current.rotation.z = -0.38;
        forearmR.current.rotation.x = -0.6 + Math.sin(t * 8) * 0.25;
      } else if (s.anim === "talk") {
        // Natural speech hand gesturing
        armL.current.rotation.x = -0.15;
        armL.current.rotation.z = 0.08;
        forearmL.current.rotation.x = -0.3;
        
        armR.current.rotation.x = -0.55 + Math.sin(t * 3.2) * 0.28;
        armR.current.rotation.z = -0.22;
        forearmR.current.rotation.x = -0.75 + Math.sin(t * 3.2) * 0.35;
      } else if (s.anim === "type") {
        // Professional desk typing motion
        armL.current.rotation.x = -0.85;
        armL.current.rotation.z = 0.22;
        forearmL.current.rotation.x = -0.70 + Math.sin(t * 11) * 0.05;
        
        armR.current.rotation.x = -0.85;
        armR.current.rotation.z = -0.22;
        forearmR.current.rotation.x = -0.70 + Math.sin(t * 13 + 1) * 0.05;
      } else if (s.anim === "sit") {
        // Relaxed lap rest or holding tablet
        armL.current.rotation.x = -0.55;
        armL.current.rotation.z = 0.15;
        forearmL.current.rotation.x = -0.55;
        
        armR.current.rotation.x = -0.55;
        armR.current.rotation.z = -0.15;
        forearmR.current.rotation.x = -0.55;
      } else {
        // Subtle natural idle arm breathing
        armL.current.rotation.x = Math.sin(t * 1.5) * 0.035;
        armL.current.rotation.z = 0.08;
        forearmL.current.rotation.x = -0.06;
        
        armR.current.rotation.x = -Math.sin(t * 1.5) * 0.035;
        armR.current.rotation.z = -0.08;
        forearmR.current.rotation.x = -0.06;
      }
    }

    // Head gesturing
    if (head.current) {
      if (s.anim === "talk") {
        head.current.rotation.x = Math.sin(t * 2.8) * 0.06;
        head.current.rotation.y = Math.sin(t * 1.4) * 0.08;
      } else if (s.anim === "type") {
        // Occasional glance between screens
        head.current.rotation.x = 0.08;
        head.current.rotation.y = Math.sin(t * 0.5) * 0.14;
      } else {
        head.current.rotation.x = 0;
        head.current.rotation.y = 0;
      }
    }

    if (bubble && bubbleEl.current) {
      const b = bubble();
      if (b !== lastBubble.current) {
        lastBubble.current = b;
        bubbleEl.current.textContent = b ?? "";
        bubbleEl.current.style.display = b ? "block" : "none";
      }
    }
  });

  return (
    <group
      ref={root}
      onPointerDown={
        onSelect
          ? (e) => {
              e.stopPropagation();
              onSelect();
            }
          : undefined
      }
    >
      {/* Ground contact shadow */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={mats.shadow}>
        <circleGeometry args={[0.34, 16]} />
      </mesh>

      <group ref={body}>
        {/* === LEGS (Segmented hip, thigh, knee, calf, leather oxford shoe) === */}
        {/* Left Leg */}
        <group ref={legL} position={[-0.12, 0.88, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.20, 0]} material={mats.trousers} castShadow>
            <cylinderGeometry args={[0.078, 0.068, 0.40, 12]} />
          </mesh>
          {/* Knee & Calf */}
          <group ref={shinL} position={[0, -0.40, 0]}>
            <mesh position={[0, -0.20, 0]} material={mats.trousers} castShadow>
              <cylinderGeometry args={[0.066, 0.058, 0.40, 12]} />
            </mesh>
            {/* Oxford Shoe */}
            <group position={[0, -0.44, 0.04]}>
              <mesh position={[0, 0.02, 0]} material={mats.shoe} castShadow>
                <boxGeometry args={[0.13, 0.07, 0.25]} />
              </mesh>
              {/* Shoe sole welt */}
              <mesh position={[0, -0.02, 0]} material={mats.shoe}>
                <boxGeometry args={[0.135, 0.02, 0.26]} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Right Leg */}
        <group ref={legR} position={[0.12, 0.88, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.20, 0]} material={mats.trousers} castShadow>
            <cylinderGeometry args={[0.078, 0.068, 0.40, 12]} />
          </mesh>
          {/* Knee & Calf */}
          <group ref={shinR} position={[0, -0.40, 0]}>
            <mesh position={[0, -0.20, 0]} material={mats.trousers} castShadow>
              <cylinderGeometry args={[0.066, 0.058, 0.40, 12]} />
            </mesh>
            {/* Oxford Shoe */}
            <group position={[0, -0.44, 0.04]}>
              <mesh position={[0, 0.02, 0]} material={mats.shoe} castShadow>
                <boxGeometry args={[0.13, 0.07, 0.25]} />
              </mesh>
              {/* Shoe sole welt */}
              <mesh position={[0, -0.02, 0]} material={mats.shoe}>
                <boxGeometry args={[0.135, 0.02, 0.26]} />
              </mesh>
            </group>
          </group>
        </group>

        {/* === TORSO & TAILORED SUIT JACKET === */}
        {/* Hips & Belt line */}
        <mesh position={[0, 0.94, 0]} material={mats.trousers} castShadow>
          <cylinderGeometry args={[0.18, 0.16, 0.14, 14]} />
        </mesh>
        <mesh position={[0, 1.01, 0]} material={mats.belt}>
          <cylinderGeometry args={[0.182, 0.182, 0.04, 14]} />
        </mesh>
        <mesh position={[0, 1.01, 0.184]} material={mats.buckle}>
          <boxGeometry args={[0.04, 0.035, 0.01]} />
        </mesh>

        <group ref={chest}>
          {/* Tailored Suit Jacket Torso */}
          <mesh position={[0, 1.20, 0]} material={mats.top} castShadow>
            <cylinderGeometry args={[0.22, 0.185, 0.38, 14]} />
          </mesh>
          {/* Inner Collared Shirt */}
          <mesh position={[0, 1.30, 0.08]} material={mats.shirtCollar}>
            <boxGeometry args={[0.14, 0.20, 0.14]} />
          </mesh>
          {/* Tailored Notch Lapels */}
          {jacket && (
            <>
              <mesh position={[-0.08, 1.25, 0.17]} rotation={[0, 0, -0.22]} material={mats.top} castShadow>
                <boxGeometry args={[0.06, 0.28, 0.03]} />
              </mesh>
              <mesh position={[0.08, 1.25, 0.17]} rotation={[0, 0, 0.22]} material={mats.top} castShadow>
                <boxGeometry args={[0.06, 0.28, 0.03]} />
              </mesh>
              {/* Breast pocket & pocket square */}
              <mesh position={[-0.12, 1.28, 0.165]} material={mats.top}>
                <boxGeometry args={[0.06, 0.015, 0.02]} />
              </mesh>
              <mesh position={[-0.12, 1.295, 0.17]} material={mats.shirtCollar}>
                <boxGeometry args={[0.04, 0.015, 0.01]} />
              </mesh>
            </>
          )}
          {/* Silk Necktie */}
          {tie && (
            <group position={[0, 1.24, 0.18]}>
              <mesh position={[0, 0.07, 0]} material={mats.tie}>
                <boxGeometry args={[0.045, 0.04, 0.02]} />
              </mesh>
              <mesh position={[0, -0.06, 0]} material={mats.tie}>
                <boxGeometry args={[0.042, 0.24, 0.015]} />
              </mesh>
            </group>
          )}

          {/* Corporate ID Lanyard & Badge */}
          <group position={[0, 1.25, 0.185]}>
            <mesh position={[-0.04, 0.12, 0]} rotation={[0, 0, -0.3]} material={mats.lanyard}>
              <cylinderGeometry args={[0.005, 0.005, 0.24, 6]} />
            </mesh>
            <mesh position={[0.04, 0.12, 0]} rotation={[0, 0, 0.3]} material={mats.lanyard}>
              <cylinderGeometry args={[0.005, 0.005, 0.24, 6]} />
            </mesh>
            <mesh position={[0, -0.04, 0]} material={mats.badge}>
              <boxGeometry args={[0.055, 0.075, 0.005]} />
            </mesh>
          </group>

          {/* === ARMS (Segmented shoulder, upper arm, elbow, forearm with cuff, detailed hand) === */}
          {/* Left Arm */}
          <group ref={armL} position={[-0.26, 1.36, 0]}>
            {/* Shoulder cap */}
            <mesh position={[0, 0, 0]} material={mats.top} castShadow>
              <sphereGeometry args={[0.075, 12, 10]} />
            </mesh>
            {/* Upper arm */}
            <mesh position={[0, -0.16, 0]} material={mats.top} castShadow>
              <cylinderGeometry args={[0.068, 0.062, 0.30, 12]} />
            </mesh>
            {/* Forearm & Hand */}
            <group ref={forearmL} position={[0, -0.31, 0]}>
              <mesh position={[0, -0.14, 0]} material={mats.top} castShadow>
                <cylinderGeometry args={[0.060, 0.054, 0.28, 12]} />
              </mesh>
              {/* White shirt sleeve cuff reveal */}
              <mesh position={[0, -0.27, 0]} material={mats.shirtCollar}>
                <cylinderGeometry args={[0.056, 0.056, 0.02, 12]} />
              </mesh>
              {/* Hand */}
              <mesh position={[0, -0.32, 0]} material={mats.skin} castShadow>
                <boxGeometry args={[0.06, 0.08, 0.03]} />
              </mesh>
            </group>
          </group>

          {/* Right Arm */}
          <group ref={armR} position={[0.26, 1.36, 0]}>
            {/* Shoulder cap */}
            <mesh position={[0, 0, 0]} material={mats.top} castShadow>
              <sphereGeometry args={[0.075, 12, 10]} />
            </mesh>
            {/* Upper arm */}
            <mesh position={[0, -0.16, 0]} material={mats.top} castShadow>
              <cylinderGeometry args={[0.068, 0.062, 0.30, 12]} />
            </mesh>
            {/* Forearm & Hand */}
            <group ref={forearmR} position={[0, -0.31, 0]}>
              <mesh position={[0, -0.14, 0]} material={mats.top} castShadow>
                <cylinderGeometry args={[0.060, 0.054, 0.28, 12]} />
              </mesh>
              {/* White shirt sleeve cuff reveal */}
              <mesh position={[0, -0.27, 0]} material={mats.shirtCollar}>
                <cylinderGeometry args={[0.056, 0.056, 0.02, 12]} />
              </mesh>
              {/* Hand */}
              <mesh position={[0, -0.32, 0]} material={mats.skin} castShadow>
                <boxGeometry args={[0.06, 0.08, 0.03]} />
              </mesh>
              {/* Optional role-based accessory */}
              {accessory === "mug" && (
                <group position={[0, -0.36, 0.08]}>
                  <mesh material={mats.propCeramic} castShadow>
                    <cylinderGeometry args={[0.038, 0.034, 0.08, 12]} />
                  </mesh>
                </group>
              )}
              {accessory === "tablet" && (
                <group position={[0, -0.34, 0.08]} rotation={[0.4, 0, 0]}>
                  <mesh material={mats.propMetal} castShadow>
                    <boxGeometry args={[0.18, 0.24, 0.012]} />
                  </mesh>
                </group>
              )}
            </group>
          </group>
        </group>

        {/* === NECK, SCULPTED HEAD & FACIAL FEATURES === */}
        {/* Anatomical Neck */}
        <mesh position={[0, 1.46, 0]} material={mats.skin}>
          <cylinderGeometry args={[0.075, 0.085, 0.14, 12]} />
        </mesh>
        {/* Shirt Collar Points */}
        <mesh position={[-0.06, 1.44, 0.08]} rotation={[0, 0, -0.4]} material={mats.shirtCollar}>
          <boxGeometry args={[0.05, 0.04, 0.02]} />
        </mesh>
        <mesh position={[0.06, 1.44, 0.08]} rotation={[0, 0, 0.4]} material={mats.shirtCollar}>
          <boxGeometry args={[0.05, 0.04, 0.02]} />
        </mesh>

        <group ref={head} position={[0, 1.64, 0]}>
          {/* Cranium & face shape */}
          <mesh material={mats.skin} castShadow>
            <sphereGeometry args={[0.165, 18, 16]} />
          </mesh>
          {/* Tapered chin & jaw */}
          <mesh position={[0, -0.07, 0.04]} material={mats.skin}>
            <cylinderGeometry args={[0.12, 0.085, 0.12, 12]} />
          </mesh>

          {/* Defined Nose Bridge */}
          <mesh position={[0, 0.01, 0.165]} rotation={[-0.1, 0, 0]} material={mats.skin}>
            <boxGeometry args={[0.032, 0.065, 0.04]} />
          </mesh>

          {/* Realistic Eyes with Sclera & Iris */}
          <group position={[-0.055, 0.032, 0.155]}>
            <mesh material={mats.shirtCollar}>
              <sphereGeometry args={[0.02, 8, 8]} />
            </mesh>
            <mesh position={[0, 0, 0.012]} material={mats.shoe}>
              <sphereGeometry args={[0.012, 8, 8]} />
            </mesh>
          </group>
          <group position={[0.055, 0.032, 0.155]}>
            <mesh material={mats.shirtCollar}>
              <sphereGeometry args={[0.02, 8, 8]} />
            </mesh>
            <mesh position={[0, 0, 0.012]} material={mats.shoe}>
              <sphereGeometry args={[0.012, 8, 8]} />
            </mesh>
          </group>

          {/* Defined Eyebrows */}
          <mesh position={[-0.055, 0.065, 0.16]} rotation={[0, 0, 0.08]} material={mats.hair}>
            <boxGeometry args={[0.055, 0.012, 0.018]} />
          </mesh>
          <mesh position={[0.055, 0.065, 0.16]} rotation={[0, 0, -0.08]} material={mats.hair}>
            <boxGeometry args={[0.055, 0.012, 0.018]} />
          </mesh>

          {/* Ears */}
          <mesh position={[-0.165, 0.01, 0]} material={mats.skin}>
            <boxGeometry args={[0.025, 0.06, 0.035]} />
          </mesh>
          <mesh position={[0.165, 0.01, 0]} material={mats.skin}>
            <boxGeometry args={[0.025, 0.06, 0.035]} />
          </mesh>

          {/* Designer Spectacles */}
          {hasGlasses && (
            <group position={[0, 0.032, 0.17]}>
              <mesh position={[-0.055, 0, 0]} material={mats.glasses}>
                <boxGeometry args={[0.054, 0.036, 0.01]} />
              </mesh>
              <mesh position={[0.055, 0, 0]} material={mats.glasses}>
                <boxGeometry args={[0.054, 0.036, 0.01]} />
              </mesh>
              {/* Glasses bridge */}
              <mesh position={[0, 0.01, 0]} material={mats.glasses}>
                <boxGeometry args={[0.025, 0.008, 0.01]} />
              </mesh>
            </group>
          )}

          {/* Sculpted Hairstyles */}
          {hairStyle === "short" && (
            <group>
              <mesh position={[0, 0.075, -0.015]} material={mats.hair}>
                <sphereGeometry args={[0.175, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
              </mesh>
              {/* Tapered back & sides */}
              <mesh position={[0, -0.01, -0.09]} material={mats.hair}>
                <boxGeometry args={[0.31, 0.14, 0.16]} />
              </mesh>
            </group>
          )}
          {hairStyle === "long" && (
            <group>
              <mesh position={[0, 0.075, -0.015]} material={mats.hair}>
                <sphereGeometry args={[0.175, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              </mesh>
              {/* Flowing styled hair over shoulders */}
              <mesh position={[-0.12, -0.12, 0.02]} material={mats.hair}>
                <boxGeometry args={[0.10, 0.36, 0.16]} />
              </mesh>
              <mesh position={[0.12, -0.12, 0.02]} material={mats.hair}>
                <boxGeometry args={[0.10, 0.36, 0.16]} />
              </mesh>
              <mesh position={[0, -0.14, -0.08]} material={mats.hair}>
                <boxGeometry args={[0.30, 0.40, 0.14]} />
              </mesh>
            </group>
          )}
          {hairStyle === "bun" && (
            <group>
              <mesh position={[0, 0.075, -0.015]} material={mats.hair}>
                <sphereGeometry args={[0.175, 16, 14, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              </mesh>
              {/* Professional updo chignon bun */}
              <mesh position={[0, 0.18, -0.12]} material={mats.hair}>
                <sphereGeometry args={[0.08, 12, 12]} />
              </mesh>
            </group>
          )}
          {hairStyle === "cap" && (
            <group>
              <mesh position={[0, 0.085, -0.01]} material={mats.top}>
                <sphereGeometry args={[0.18, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
              </mesh>
              <mesh position={[0, 0.085, 0.18]} material={mats.top}>
                <boxGeometry args={[0.26, 0.02, 0.15]} />
              </mesh>
              {/* Security badge on cap */}
              <mesh position={[0, 0.14, 0.16]} material={mats.buckle}>
                <boxGeometry args={[0.03, 0.035, 0.01]} />
              </mesh>
            </group>
          )}
        </group>
      </group>

      {/* Floating 3D/HTML Tag Badge */}
      <Html position={[0, 2.15, 0]} center zIndexRange={[20, 10]} style={{ pointerEvents: "none" }}>
        <div className="person-tag">
          {bubble && <div ref={bubbleEl} className="speech-bubble" style={{ display: "none" }} aria-hidden="true" />}
          {label && <span className={labelClass ?? "person-label"}>{label}</span>}
        </div>
      </Html>
    </group>
  );
}

