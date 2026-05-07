export const shelfPacking = (items, containerWidth, spacing = 1) => {
    let x = - containerWidth / 2 + spacing; //начальная позиция магазина по x
    let z = - 25 + spacing; //начальная позиция магазина по y, нехай будет в центре
    let currentRowMaxDepth = 0; //высота строки

    items.sort((a,b) => b.userData.depth - a.userData.depth); //сортируем магазины по глубине(длине)

    items.forEach(item => {
        if (x - (-containerWidth / 2) + item.userData.width + spacing > containerWidth) { //если позиция по Х больше чем позиция на сетке (x) то перенос на следующий ряд
            x = - containerWidth / 2 + spacing; //переносим
            z += currentRowMaxDepth + spacing; //увеличиваем Z на максимальную глубину ряда    
            currentRowMaxDepth = 0; //обнуляем глубину
        }
        
        item.position.x = x + item.userData.width / 2; // делим на два потому что объект все таки не точка 
        item.position.z = z + item.userData.depth / 2;  //та же фигня
        item.position.y = item.userData.height / 2;  //та же, но щас чет все равно утонили вниз
        x += item.userData.width + spacing;// продолжаем ряд
        currentRowMaxDepth = Math.max(currentRowMaxDepth, item.userData.depth); //обновляем глубину
    })
}
