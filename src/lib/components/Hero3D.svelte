<script>
    // @ts-nocheck
    import { onMount, onDestroy } from "svelte";
    import * as THREE from "three";

    let container;
    let animationFrame;
    let scene, camera, renderer;

    onMount(() => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000,
        );
        camera.position.z = 5;

        const isMobile = window.innerWidth < 768;
        
        renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
        container.appendChild(renderer.domElement);

        // Glowing tech object (Icosahedron wireframe + solid core)
        const geometry = new THREE.IcosahedronGeometry(isMobile ? 1.4 : 1.8, isMobile ? 0 : 1);

        const material = new THREE.MeshBasicMaterial({
            color: 0xd4af37, // Gold
            wireframe: true,
            transparent: true,
            opacity: 0.4,
        });

        const coreMaterial = new THREE.MeshStandardMaterial({
            color: 0xceb28d, // Gold variant from primary
            emissive: 0x8b5331,
            emissiveIntensity: 0.8,
            roughness: 0.2,
            metalness: 0.8,
        });

        const sphereGroup = new THREE.Group();

        const wireframe = new THREE.Mesh(geometry, material);
        const core = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.0, 0),
            coreMaterial,
        );

        sphereGroup.add(wireframe);
        sphereGroup.add(core);

        // Add particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = isMobile ? 100 : 300;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * (isMobile ? 8 : 12); // spread
        }

        particlesGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(posArray, 3),
        );
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xd4af37, // Gold
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });

        const particlesMesh = new THREE.Points(
            particlesGeometry,
            particlesMaterial,
        );

        scene.add(sphereGroup);
        scene.add(particlesMesh);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 2);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const animate = () => {
            animationFrame = requestAnimationFrame(animate);

            wireframe.rotation.x += 0.002;
            wireframe.rotation.y += 0.003;

            core.rotation.x -= 0.005;
            core.rotation.y -= 0.004;

            particlesMesh.rotation.y += 0.001;
            particlesMesh.rotation.x -= 0.0005;

            // Floating effect
            sphereGroup.position.y = Math.sin(Date.now() * 0.001) * 0.2;

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationFrame) cancelAnimationFrame(animationFrame);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            coreMaterial.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            renderer.dispose();
        };
    });
</script>

<div
    bind:this={container}
    class="w-full h-full relative cursor-crosshair"
></div>
