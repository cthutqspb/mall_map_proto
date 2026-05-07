import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export const initLabelRenderer = () => {
    const renderer = new CSS2DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(renderer.domElement);
    return renderer;
}

export const createLabel = (text, width, depth) => {
    const div = document.createElement('div');
    div.className = 'shop-label';
    if (width < depth) {
        div.classList.add('vertical');
    }
    div.textContent = text;     
    return new CSS2DObject(div);
}

export const updateLabelsForCamera = (shops, isOrtho) => {
    shops.forEach(shop => {
        const label = shop.userData.label.element;
        if (isOrtho && shop.userData.isNarrow) {
            label.classList.add('vertical');
        } else {
            label.classList.remove('vertical');
        }
    });
}
