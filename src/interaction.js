import * as THREE from 'three';
import gsap from 'gsap';

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let prevIntersectedObject = null;

export const handleHover = (event, renderer, camera, items) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(items);//только барахолки, а то грид еще рейкастится

    if (!prevIntersectedObject && intersects[0]) {
        renderer.domElement.style.cursor = 'pointer';
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
}

//если будет больше объектов то будем запоминать конкретный объект
const removeAllEdges = (objects) => {
     objects.forEach(object => {
        const edges = object.children.find(child => child.isLineSegments);
        if (edges) object.remove(edges);
    });
}

const addEdges = (object) => { 
    const edges = new THREE.EdgesGeometry(object.geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
    const lineSegments = new THREE.LineSegments(edges, lineMaterial);
    object.add(lineSegments);
}

let prevSelected = null;
let prevSelectedLabel = null;

export const handleClick = (event, camera, items) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(items);//только барахолки, а то грид еще рейкастится
    if(intersects[0]) {
        const object = intersects[0]?.object;
        const {id, name} = object.userData;
        console.log('id: ', id, 'name: ', name, 'position: ', object.position);

        removeAllEdges(items); 
        addEdges(intersects[0]?.object);

        const label = intersects[0].object.userData.label;
        if (prevSelectedLabel) {
            prevSelectedLabel.classList.remove('selected');
        }

        label?.element.classList.add('selected');
        prevSelectedLabel = label?.element;
    } else {
        removeAllEdges(items);
        prevSelected = null;
        if (prevSelectedLabel) {
            prevSelectedLabel.classList.remove('selected');
            prevSelectedLabel = null;
        }
    }
}
