import * as THREE from 'three';

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateShops = () => {
    const shops = [];
    //токионайт пушка
    const colors = [
        0x7aa2f7,
        0x2ac3de,
        0x9ece6a,
        0xbb9af7,
        0xf7768e,
        0xe0af68,
        0x565f89
    ]
    
    const names = [
        `Wildberries`,
        `OZON`,
        `Авито`,
        `Яндекс маркет`,
        `Химчистка`,
        `Burger King`,
        `Гнилое яблоко`,
        `Магазин c очень длинным название пря очень длинним аж не влезает а надо что влезал`
    ]

    for (let i = 1; i <= 100; i++ ) {
        shops.push({
            id: i,
            // name: `Магазин c очень длинным название пря очень длинним аж не влезает а надо что влезал ${i}`,
            name:  names [i % names.length],
            width: getRandomInt(2, 8),
            depth: getRandomInt(2, 8),
            height: 2,
            color: colors[i % colors.length]
        })
    }
    return shops;
}

export const getShops = (scene, createLabel) => {
    const shops = [];
    generateShops().forEach((shop) => {
        const {width, depth, height, color, id, name} = shop;
        const shopGeom = new THREE.BoxGeometry(width, height, depth);
        //люблю прозрачность
        const shopMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0,
            transparent: true,
            opacity: .72        
        });
        //текст
        const label = createLabel(name, width, depth);
        label.position.set(0, 1.5, 0); 
        const shopMesh = new THREE.Mesh(shopGeom, shopMaterial);
        //кастомные поля
        shopMesh.userData = {
            width: width,
            depth: depth,
            height: height,
            id: id,
            name: name,
            label: label,
            isNarrow: width < depth
        };

        shopMesh.add(label);
        shops.push(shopMesh);
        scene.add(shopMesh);
  })
  return shops;
}

