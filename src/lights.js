import * as THREE from 'three';

export const initLights = (scene) => {
    const ambientLight = new THREE.AmbientLight(0xfffff, 1);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    scene.add(ambientLight);
    scene.add(directionalLight);
}

