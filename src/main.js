import * as THREE from 'three';
import { createRenderer } from './renderer';
import { createScene, createGrid } from './scene';
import { createPerspectiveCamera, createOrthographicCamera } from './camera';
import { generateShops } from './shops';
import './style.css'

const GRID_SIZE = 100;
const GRID_DIVISIONS = 10;


const perspectiveCamera = createPerspectiveCamera()
const orthoCamera = createOrthographicCamera()

let activeCamera = orthoCamera;

const scene = createScene();
const grid = createGrid(GRID_SIZE, GRID_DIVISIONS);
const renderer = createRenderer();

scene.add(grid);

const shops = [];

generateShops().forEach((shop) => {
    console.log('SHOP', shop)
    const {width, depth, height, color} = shop;
    const shopGeom = new THREE.BoxGeometry(width, depth, height);
    const shopMaterial = new THREE.MeshBasicMaterial({color: color});
    const shopMesh = new THREE.Mesh(shopGeom, shopMaterial);
    shopMesh.customProps = {width: width, depth: depth, height: height};
    shops.push(shopMesh);
    scene.add(shopMesh);
})
//console.log('shops', shops)
const packShops = (items, containerWidth, spacing = 1) => {
    let x = 0; //начальная позиция магазина по x
    let z = 0; //начальная позиция магазина по y
    let currentRowMaxDepth = 0; //высота строки

    items.sort((a,b) => b.customProps.depth - a.customProps.depth); //сортируем магазины по глубине(длине)

    items.forEach(item => {
        console.log('item', item)
        if (x + item.customProps.width + spacing > containerWidth) { //если позиция по Х больше чем ширина размерность сетки (x) то перенос на следующий ряд
            x = 0; //переносим
            z += currentRowMaxDepth; //запоминаю координату нового ряда, немного странно после того как неделю ковырялся над 2d в defold 
            currentRowMaxDepth = 0; //начинаем новый ряд
        }
        
        item.position.x = x + item.customProps.width / 2; // делим на два потому что объект все таки не точка 
        item.position.z = z + item.customProps.depth / 2;  //та же фигня
        item.position.y = item.customProps.height / 2;  //та же, но щас чет все равно утонили вниз
        console.log(item.position.y)
        x += item.customProps.width + spacing;// если не переносим то координата следующего магаза
        currentRowMaxDepth = Math.max(currentRowMaxDepth, item.customProps.depth); 
    })
}

packShops(shops, 100);

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case '1':
            activeCamera = perspectiveCamera;
            break;
        case '2':
            activeCamera = orthoCamera;
            break;
    }
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, activeCamera);
}
animate()
