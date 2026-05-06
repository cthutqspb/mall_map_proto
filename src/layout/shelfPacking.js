export const shelfPacking = (items, containerWidth, spacing = 1) => {
    let x = - containerWidth / 2 + spacing; //начальная позиция магазина по x
    let z = - 50 + spacing; //начальная позиция магазина по y
    let currentRowMaxDepth = 0; //высота строки

    items.sort((a,b) => b.customProps.depth - a.customProps.depth); //сортируем магазины по глубине(длине)

    items.forEach(item => {
        if (x - (-containerWidth / 2) + item.customProps.width + spacing > containerWidth) { //если позиция по Х больше чем ширина сетки (x) то перенос на следующий ряд
            x = - containerWidth / 2 + spacing; //переносим
            z += currentRowMaxDepth + spacing; //запоминаю координату нового ряда, немного странно после того как неделю ковырялся над 2d в defold 
            currentRowMaxDepth = 0; //начинаем новый ряд
        }
        
        item.position.x = x + item.customProps.width / 2; // делим на два потому что объект все таки не точка 
        item.position.z = z + item.customProps.depth / 2;  //та же фигня
        item.position.y = item.customProps.height / 2;  //та же, но щас чет все равно утонили вниз
        x += item.customProps.width + spacing;// если не переносим то координата следующего магаза
        currentRowMaxDepth = Math.max(currentRowMaxDepth, item.customProps.depth); 
    })
}
