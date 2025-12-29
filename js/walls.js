// CONFIGURAÇÃO DAS PAREDES
const WALLS = [
    // Paredes do campo
    { minX: -18.5, maxX: 18.5, minZ: 9, maxZ: 33, minY: 0, maxY: 6, color: '#ff0000' },      // Parede frontal (vermelho)
    { minX: -20, maxX: 20, minZ: -25, maxZ: -9, minY: 0, maxY: 6, color: '#00ff00' },    // Parede traseira (verde)
    { minX: -28, maxX: -6, minZ: -20, maxZ: 16, minY: 0, maxY: 6, color: '#0000ff' },    // Parede esquerda (azul)
    { minX: 6, maxX: 28, minZ: -20, maxZ: 16, minY: 0, maxY: 6, color: '#ffff00' },       // Parede direita (amarelo)
    // Balizas
    { minX: -2.2, maxX: 2.5, minZ: -7.9, maxZ: -5.6, minY: 0, maxY: 6, color: '#ffffff' },
    { minX: -2.2, maxX: 2.5, minZ: 5.6, maxZ: 7.9, minY: 0, maxY: 6, color: '#ffff00' },
];

// Criar paredes visualmente
function createWalls() {
    const container = document.querySelector('#walls-container');

    WALLS.forEach((wall, index) => {
        const centerX = (wall.minX + wall.maxX) / 2;
        const centerY = (wall.minY + wall.maxY) / 2;
        const centerZ = (wall.minZ + wall.maxZ) / 2;
        
        const width = wall.maxX - wall.minX;
        const height = wall.maxY - wall.minY;
        const depth = wall.maxZ - wall.minZ;
        
        const wallBox = document.createElement('a-box');
        wallBox.setAttribute('position', `${centerX} ${centerY} ${centerZ}`);
        wallBox.setAttribute('width', width);
        wallBox.setAttribute('height', height);
        wallBox.setAttribute('depth', depth);
        wallBox.setAttribute('material', `opacity: 0.0; transparent: true; color: ${wall.color}`);
        wallBox.setAttribute('id', `wall-${index}`);
        
        container.appendChild(wallBox);
    });
}