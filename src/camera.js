import * as THREE from 'three';

const aspect = window.innerWidth / window.innerHeight;
const SIZE = 50;

export const transitionCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

const createPerspectiveCamera = () => {
    const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    camera.position.set(25, 50, 50);
    camera.lookAt(0, 0, 0);
    return camera;
}

const createOrthographicCamera = () => {
    const camera = new THREE.OrthographicCamera(
        -SIZE * aspect, SIZE * aspect,  // справа слева
        SIZE, -SIZE,                    // сверх снизу
        0.1, 1000                       // близко далеко
    )
    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);
    return camera;
}

const perspectiveCamera = createPerspectiveCamera();
const orthographicCamera = createOrthographicCamera();

let activeCamera = orthographicCamera;

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

export { activeCamera, perspectiveCamera, orthographicCamera };
