import { useRef, useState, useEffect, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import s from "../App.module.css";
class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className={s.chromeFallback} aria-hidden="true">
        ✳
      </div>
    ) : (
      this.props.children
    );
  }
}
function Knot({ reduced, mobile }) {
  const mesh = useRef();
  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x +=
      (state.pointer.y * 0.28 - mesh.current.rotation.x) * 0.025;
    mesh.current.rotation.y +=
      (state.pointer.x * 0.45 - mesh.current.rotation.y) * 0.025;
    if (!reduced) mesh.current.rotation.z += delta * 0.09;
  });
  return (
    <mesh ref={mesh} rotation={[0.2, 0.2, -0.5]}>
      <torusKnotGeometry
        args={[1.75, 0.57, mobile ? 80 : 160, mobile ? 12 : 24, 2, 3]}
      />
      <meshStandardMaterial color="#b8bdbb" metalness={1} roughness={0.16} />
    </mesh>
  );
}
export default function Sculpture({ reduced }) {
  const holder = useRef();
  const [active, setActive] = useState(true);
  const mobile = matchMedia("(max-width:767px)").matches;
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setActive(entry.isIntersecting),
    );
    if (holder.current) observer.observe(holder.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={holder} style={{ width: "100%", height: "100%" }}>
      <Boundary>
        <Canvas
          frameloop={active && !reduced ? "always" : "demand"}
          dpr={[1, mobile ? 1 : 1.5]}
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          aria-label="Slowly rotating interactive chrome knot"
        >
          <ambientLight intensity={0.25} />
          <Knot reduced={reduced} mobile={mobile} />
          <Environment resolution={128}>
            <Lightformer
              intensity={5}
              position={[0, 5, -2]}
              scale={[10, 2, 1]}
            />
            <Lightformer
              intensity={3}
              position={[-5, 0, 3]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[6, 10, 1]}
            />
            <Lightformer
              intensity={5}
              position={[5, 1, 2]}
              rotation={[0, -Math.PI / 2, 0]}
              scale={[3, 10, 1]}
            />
            <Lightformer
              color="#d7ff3f"
              intensity={1.5}
              position={[0, -5, 1]}
              scale={[8, 1, 1]}
            />
          </Environment>
        </Canvas>
      </Boundary>
    </div>
  );
}
