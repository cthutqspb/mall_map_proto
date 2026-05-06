import * as THREE from 'three';

const aspect = window.innerWidth / window.innerHeight;
const size = 100;

export const createPerspectiveCamera = () => {
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 150, 0);
    camera.lookAt(0, 0, 0);
    return camera;
}

export const createOrthographicCamera = () => {
    const camera = new THREE.OrthographicCamera(
        -size * aspect, size * aspect,  // left, right
        size, -size,                    // top, bottom
        0.1, 1000                       // near, far
    )
    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);
    return camera;
}
