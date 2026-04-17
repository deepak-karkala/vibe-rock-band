"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getThemeById } from "@/lib/theme-data";

type StageCanvasProps = {
  themeId: string;
  audioLevel: number;
  setCaptureHandler: (handler: () => string | null) => void;
};

export default function StageCanvas({
  themeId,
  audioLevel,
  setCaptureHandler,
}: StageCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioLevelRef = useRef(audioLevel);

  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const theme = getThemeById(themeId);
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0a0a, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 3, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    setCaptureHandler(() => {
      try {
        return renderer.domElement.toDataURL("image/png");
      } catch {
        return null;
      }
    });

    const ambient = new THREE.AmbientLight(0xf4e7d3, 0.9);
    scene.add(ambient);

    const warmSpot = new THREE.SpotLight(0xf4e7d3, 12, 30, 0.7, 0.6);
    warmSpot.position.set(0, 10, 5);
    scene.add(warmSpot);

    const emberLight = new THREE.PointLight(0xa23621, 10, 18);
    emberLight.position.set(-3, 2, 2);
    scene.add(emberLight);

    const tealLight = new THREE.PointLight(0x2f5d50, 4, 18);
    tealLight.position.set(3, 2, 2);
    scene.add(tealLight);

    const floor = new THREE.Mesh(
      new THREE.CylinderGeometry(8, 10, 0.4, 64),
      new THREE.MeshStandardMaterial({
        color: 0x171312,
        roughness: 0.85,
        metalness: 0.1,
      }),
    );
    floor.position.set(0, -2.2, 0);
    scene.add(floor);

    const group = new THREE.Group();
    const pulseMeshes: THREE.Mesh[] = [];

    theme.members.forEach((member, index) => {
      const root = new THREE.Group();
      root.position.set(index * 2.3 - 4.6, -1.25, Math.sin(index) * 0.35);

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.78, 2.6, 24),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(member.accent).getHex(),
          roughness: 0.4,
          metalness: 0.18,
        }),
      );
      root.add(body);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 24, 24),
        new THREE.MeshStandardMaterial({
          color: 0xf4e7d3,
          roughness: 0.3,
          metalness: 0.08,
        }),
      );
      head.position.y = 1.7;
      root.add(head);

      const pulse = new THREE.Mesh(
        new THREE.PlaneGeometry(1.8, 3.2),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(member.accent).getHex(),
          transparent: true,
          opacity: 0.08,
        }),
      );
      pulse.position.z = -0.5;
      root.add(pulse);
      pulseMeshes.push(pulse);

      group.add(root);
    });

    scene.add(group);

    const bars = Array.from({ length: 18 }, (_, index) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 1, 0.24),
        new THREE.MeshBasicMaterial({
          color: index % 3 === 0 ? 0xa23621 : index % 2 === 0 ? 0xcbb89d : 0x2f5d50,
          transparent: true,
          opacity: 0.75,
        }),
      );
      mesh.position.set(index * 0.5 - 4.25, -1.9, 3.4);
      scene.add(mesh);
      return mesh;
    });

    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const level = audioLevelRef.current;

      group.children.forEach((child, index) => {
        child.position.y = Math.sin(elapsed * 2 + index * 0.8) * (0.08 + level * 0.34);
        child.rotation.z = Math.sin(elapsed * 1.2 + index) * (0.03 + level * 0.06);
      });

      pulseMeshes.forEach((pulse, index) => {
        const scale = 1 + level * 0.9 + Math.sin(elapsed * 2 + index) * 0.04;
        pulse.scale.set(scale, scale, 1);
        const material = pulse.material as THREE.MeshBasicMaterial;
        material.opacity = 0.08 + level * 0.16;
      });

      bars.forEach((bar, index) => {
        bar.scale.y = 0.4 + level * 3 + Math.sin(elapsed * 4 + index) * 0.25;
        bar.position.y = -1.9 + bar.scale.y / 2;
      });

      warmSpot.intensity = 10 + level * 8;
      emberLight.intensity = 8 + level * 12;
      tealLight.intensity = 3 + level * 4;

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    const onResize = () => {
      if (!container) {
        return;
      }
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    let frame = requestAnimationFrame(animate);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      container.removeChild(renderer.domElement);
    };
  }, [setCaptureHandler, themeId]);

  return <div ref={containerRef} className="h-[28rem] w-full md:h-[42rem]" />;
}
