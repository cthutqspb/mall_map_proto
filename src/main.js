import * as THREE from 'three';
const clock = new THREE.Clock();
import { createRenderer } from './renderer';
import { createScene, createGrid } from './scene';
import { initLights } from './lights';
import { 
    switchCamera,
    activeCamera,
    transitionCamera,
    orthographicCamera,
    perspectiveCamera
} from './camera';
import { getShops } from './generateData';
import { shelfPacking } from './layout/shelfPacking';
import { handleHover, handleClick } from "./interaction";
import { initLabelRenderer, createLabel, updateLabelsForCamera } from './labels';
import { 
    GRID_SIZE,
    GRID_DIVISIONS,
    ORTHOGRAPHIC_CAMERA_SIZE
} from './constants';
import './style.css';

const scene = createScene();
const grid = createGrid(GRID_SIZE, GRID_DIVISIONS);
const renderer = createRenderer();
const labelRenderer = initLabelRenderer();
initLights(scene);

scene.add(grid);

const shops = getShops(scene, createLabel);

//пакуем
shelfPacking(shops, 100);

//слушаем
window.addEventListener('keydown', (event) => {
    switchCamera(event);
    const orthoMode = activeCamera === orthographicCamera;
    updateLabelsForCamera(shops, orthoMode);
    if (orthoMode) {
        btn2d.classList.add('active');
        btn3d.classList.remove('active');
    } else {
        btn3d.classList.add('active');
        btn2d.classList.remove('active');
    }
});

window.addEventListener('pointermove', (event) => {
    handleHover(event, renderer, activeCamera, shops);
});

window.addEventListener('click', (event) => {
    handleClick(event, activeCamera, shops);
})

const btn2d = document.getElementById('btn-2d');
const btn3d = document.getElementById('btn-3d');

btn2d.addEventListener('click', () => {
    switchCamera({ key: '2' });    
    const orthoMode = activeCamera === orthographicCamera;
    updateLabelsForCamera(shops, orthoMode);
    btn2d.classList.add('active');
    btn3d.classList.remove('active');
})

btn3d.addEventListener('click', () => {
    switchCamera({ key: '1' });    
    const orthoMode = activeCamera === orthographicCamera;
    updateLabelsForCamera(shops, orthoMode);
    btn3d.classList.add('active');
    btn2d.classList.remove('active');
})

const onWindowResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    //персп
    perspectiveCamera.aspect = width / height;
    perspectiveCamera.updateProjectionMatrix();
    
    //для орто 
    const halfWorldSize = ORTHOGRAPHIC_CAMERA_SIZE / 2;
    const aspect = width / height;

    orthographicCamera.left = -halfWorldSize * aspect;
    orthographicCamera.right = halfWorldSize * aspect;
    orthographicCamera.top = halfWorldSize;
    orthographicCamera.bottom = -halfWorldSize;
    orthographicCamera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    labelRenderer.setSize(width, height);
}

window.addEventListener('resize', () => {
    onWindowResize();
});

let alpha = 1; // переход между камерыми, 1 перп, 0 орто
const speed = 1.0; 
//если подольше поковырять то можно будет анимацию вынести
function animate() {
    requestAnimationFrame(animate); 
    
    const delta = clock.getDelta();
    
    const targetAlpha = (activeCamera === orthographicCamera) ? 1 : 0;

    // прост камера если нет анимации
    if (alpha === targetAlpha) {
        renderer.render(scene, activeCamera);
        labelRenderer.render(scene, activeCamera);
        return;
    }

    // движение перехода
    if (alpha < targetAlpha) alpha = Math.min(alpha + delta * speed, targetAlpha);
    if (alpha > targetAlpha) alpha = Math.max(alpha - delta * speed, targetAlpha);

    // добавляет плавность
    const easedAlpha = THREE.MathUtils.smoothstep(alpha, 0, 1);

    // синк позиций камер, сложно
    transitionCamera.position.lerpVectors(perspectiveCamera.position, orthographicCamera.position, easedAlpha);
    transitionCamera.quaternion.slerpQuaternions(perspectiveCamera.quaternion, orthographicCamera.quaternion, easedAlpha);

    // ленейная интерполяция со смузом
    perspectiveCamera.updateProjectionMatrix();
    orthographicCamera.updateProjectionMatrix();
    
    for (let i = 0; i < 16; i++) {
        transitionCamera.projectionMatrix.elements[i] = THREE.MathUtils.lerp(
            perspectiveCamera.projectionMatrix.elements[i],
            orthographicCamera.projectionMatrix.elements[i],
            easedAlpha
        );
    }

    renderer.render(scene, transitionCamera);
    labelRenderer.render(scene, transitionCamera);
}
animate();
