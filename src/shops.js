function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateShops = () => {
    const shops = [];
    //токионайт пушка
    const colors = [0x7aa2f7, 0x2ac3de, 0x9ece6a, 0xbb9af7, 0xf7768e, 0xe0af68, 0x565f89]   

    for (let i = 1; i <= 100; i++ ) {
        shops.push({
            id: i,
            name: `Барахолка номер ${i}`,
            width: getRandomInt(2, 8),
            depth: getRandomInt(2, 8),
            height: 2,
            color: colors[i % colors.length]
        })
    }
    return shops;
}
