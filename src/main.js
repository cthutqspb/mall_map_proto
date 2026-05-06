import * as THREE from 'three';
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
import { createRenderer } from './renderer';
import { createScene, createGrid } from './scene';
import { switchCamera, activeCamera } from './camera';
import { generateShops } from './shops';
import { shelfPacking } from './layout/shelfPacking';
import './style.css';
import { int } from 'three/tsl';

const GRID_SIZE = 100;
const GRID_DIVISIONS = 10;



const scene = createScene();
const grid = createGrid(GRID_SIZE, GRID_DIVISIONS);
const renderer = createRenderer();
const ambientLight = new THREE.AmbientLight(0xfffff, 1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

scene.add(ambientLight);
scene.add(directionalLight);
scene.add(grid);

const shops = [];

generateShops().forEach((shop) => {
    const {width, depth, height, color} = shop;
    const shopGeom = new THREE.BoxGeometry(width, height, depth);
    const shopMaterial = new THREE.MeshStandardMaterial({
        color: color,
        //wireframe: true,
        transparent: true,
        opacity: .72        
    });
    const shopMesh = new THREE.Mesh(shopGeom, shopMaterial);
    shopMesh.customProps = {width: width, depth: depth, height: height};
    shops.push(shopMesh);
    scene.add(shopMesh);
})

shelfPacking(shops, 100);

window.addEventListener('keydown', (event) => {
    switchCamera(event);
});


let prevIntersectedObject = null;

window.addEventListener('pointermove', (event) =>{
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const intersects = raycaster.intersectObjects(scene.children);

    if (!prevIntersectedObject && intersects[0]) {
        renderer.domElement.style.cursor = 'pointer';
        intersects[0].object.material.opacity = 1;
        prevIntersectedObject = intersects[0]
    } else if (intersects.length == 0) {
        renderer.domElement.style.cursor = 'default';
        if (prevIntersectedObject) {
            prevIntersectedObject.object.material.opacity = 0.72;
            prevIntersectedObject = null;
        }
    } else if (prevIntersectedObject && prevIntersectedObject !== intersects[0]) { 
        prevIntersectedObject.object.material.opacity = 0.72;
        intersects[0].object.material.opacity = 1;
        prevIntersectedObject = intersects[0];
    } 
    
});

function animate() {
    requestAnimationFrame(animate);
    raycaster.setFromCamera(mouse, activeCamera);
            
    renderer.render(scene, activeCamera);
}
animate();
