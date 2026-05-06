import { createRenderer } from './renderer';
import { createScene } from './scene';
import { createCamera } from './camera';
import './style.css'


const scene = createScene()
const camera = createCamera()
const renderer = createRenderer()
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate()
