import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
import gsap from 'gsap'
import { createRenderer } from './renderer';
import { createScene, createGrid } from './scene';
import { switchCamera, activeCamera } from './camera';
import { generateShops } from './shops';
import { shelfPacking } from './layout/shelfPacking';
import './style.css';

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

//названия
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);


const createLabel = (label) => {
    const textDiv = document.createElement('div');
    textDiv.className = 'shop-label';
    textDiv.textContent = label;
    textDiv.style.color = '#000F0F';
    textDiv.style.fontSize = '12px';
    textDiv.style.marginTop = '-20px'; 
    return textDiv;
}

generateShops().forEach((shop) => {
    const {width, depth, height, color, name} = shop;
    const shopGeom = new THREE.BoxGeometry(width, height, depth);
    const shopMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0,
        //wireframe: true,
        transparent: true,
        opacity: .72        
    });

    
    const label = new CSS2DObject(createLabel(name));
    label.position.set(0, 1.5, 0); 
    const shopMesh = new THREE.Mesh(shopGeom, shopMaterial);
    shopMesh.customProps = {width: width, depth: depth, height: height};
    console.log('label', name, label)
    shopMesh.add(label);
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

    const intersects = raycaster.intersectObjects(shops);//только барахолки, а то грид еще рейкастится

    if (!prevIntersectedObject && intersects[0]) {
        renderer.domElement.style.cursor = 'pointer';
        //intersects[0].object.material.opacity = 1;
        gsap.killTweensOf(intersects[0].object.material);
        gsap.to(intersects[0].object.material, {
            duration: .3,
            opacity: 1,
            ease: "power2.out"
        });
        gsap.to(intersects[0].object.material, {
            emissiveIntensity: .42,
            duration: .3
        })
        prevIntersectedObject = intersects[0]
    } else if (intersects.length == 0) {
        renderer.domElement.style.cursor = 'default';
        if (prevIntersectedObject) {
            gsap.killTweensOf(prevIntersectedObject.object.material);
            gsap.to(prevIntersectedObject.object.material, {
                duration: .3,
                opacity: .72,
                ease: "power2.out"
            });
            gsap.to(prevIntersectedObject.object.material, {
                emissiveIntensity: 0,
                duration: .3
            })
            prevIntersectedObject = null;
        }
    } else if (prevIntersectedObject && prevIntersectedObject !== intersects[0]) { 
        gsap.killTweensOf(prevIntersectedObject.object.material);
        gsap.to(prevIntersectedObject.object.material, {
            duration: .3,
            opacity: .72,
            ease: "power2.out"
        });
        gsap.to(prevIntersectedObject.object.material, {
            emissiveIntensity: 0,
            duration: .3
        });
        gsap.killTweensOf(intersects[0].object.material);
        gsap.to(intersects[0].object.material, {
            duration: .3,
            opacity: 1,
            ease: "power2.out"
        });
        gsap.to(intersects[0].object.material, {
            emissiveIntensity: .42,
            duration: .3
        });
        prevIntersectedObject = intersects[0];
    } 
    
});

function animate() {
    requestAnimationFrame(animate);
    raycaster.setFromCamera(mouse, activeCamera);
            
    renderer.render(scene, activeCamera);
    labelRenderer.render(scene, activeCamera);
}
animate();
