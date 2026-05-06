import * as THREE from 'three';

const aspect = window.innerWidth / window.innerHeight;
const size = 100;

const createPerspectiveCamera = () => {
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.set(30, 30, 30);
    camera.lookAt(0, 0, 0);
    return camera;
}

const createOrthographicCamera = () => {
    const camera = new THREE.OrthographicCamera(
        -size * aspect, size * aspect,  // left, right
        size, -size,                    // top, bottom
        0.1, 1000                       // near, far
    )
    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);
    return camera;
}

const perspectiveCamera = createPerspectiveCamera();
const orthographicCamera = createOrthographicCamera();

export let activeCamera = orthographicCamera;

export const switchCamera = (event) => {
    switch (event.key) {
        case '1':
            activeCamera = perspectiveCamera;
            break;
        case '2':
            activeCamera = orthographicCamera;
            break;
    }
}


