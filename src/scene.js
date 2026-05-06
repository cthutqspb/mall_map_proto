import * as THREE from 'three'

export const createScene = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('rgba(0,72,127)');
    return scene;
}
 
export const createGrid = (size, divisions) => {
    const grid = new THREE.GridHelper(size, divisions);
    return grid;
}
