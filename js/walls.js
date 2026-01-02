const orientedWalls = [
    //Parades exteriores do estádio
    { centerX: -9.57, centerZ: 44.79, dirX: -0.0540, dirZ: -0.9985, normalX: 0.9985, normalZ: -0.0540, length: 4.17, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -18.47, centerZ: 37.76, dirX: -0.8714, dirZ: -0.4906, normalX: 0.4906, normalZ: -0.8714, length: 20.16, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -28.61, centerZ: 21.47, dirX: -0.1192, dirZ: -0.9929, normalX: 0.9929, normalZ: -0.1192, length: 22.84, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -35.94, centerZ: 9.52, dirX: -0.9947, dirZ: -0.1028, normalX: 0.1028, normalZ: -0.9947, length: 12.00, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -41.66, centerZ: -0.33, dirX: 0.0275, dirZ: -0.9996, normalX: 0.9996, normalZ: 0.0275, length: 18.47, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -40.39, centerZ: -18.94, dirX: 0.1074, dirZ: -0.9942, normalX: 0.9942, normalZ: 0.1074, length: 18.87, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -33.42, centerZ: -28.06, dirX: 0.9990, dirZ: 0.0437, normalX: -0.0437, normalZ: 0.9990, length: 11.92, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -18.45, centerZ: -32.70, dirX: 0.8787, dirZ: -0.4773, normalX: 0.4773, normalZ: 0.8787, length: 20.52, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -0.33, centerZ: -37.73, dirX: 0.9999, dirZ: -0.0149, normalX: 0.0149, normalZ: 0.9999, length: 18.21, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 18.18, centerZ: -32.92, dirX: 0.8853, dirZ: 0.4650, normalX: -0.4650, normalZ: 0.8853, length: 21.26, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 33.35, centerZ: -28.30, dirX: 0.9985, dirZ: -0.0550, normalX: 0.0550, normalZ: 0.9985, length: 11.53, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 40.20, centerZ: -19.42, dirX: 0.1177, dirZ: 0.9931, normalX: -0.9931, normalZ: 0.1177, length: 18.51, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 41.33, centerZ: -0.84, dirX: 0.0047, dirZ: 1.0000, normalX: -1.0000, normalZ: 0.0047, length: 18.78, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 35.59, centerZ: 9.09, dirX: -0.9957, dirZ: 0.0925, normalX: -0.0925, normalZ: -0.9957, length: 11.63, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 28.64, centerZ: 21.04, dirX: -0.1005, dirZ: 0.9949, normalX: -0.9949, normalZ: -0.1005, length: 22.94, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 18.60, centerZ: 37.57, dirX: -0.8668, dirZ: 0.4987, normalX: -0.4987, normalZ: -0.8668, length: 20.51, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 9.39, centerZ: 44.88, dirX: -0.1431, dirZ: 0.9897, normalX: -0.9897, normalZ: -0.1431, length: 4.44, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -0.05, centerZ: 47.17, dirX: -0.9999, dirZ: 0.0102, normalX: -0.0102, normalZ: -0.9999, length: 18.26, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },

    //Paredes interiores do estádio
    { centerX: -9.19, centerZ: 10.38, dirX: -0.1316, dirZ: -0.9913, normalX: 0.9913, normalZ: -0.1316, length: 6.78, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -9.64, centerZ: -0.01, dirX: 0.0000, dirZ: -1.0000, normalX: 1.0000, normalZ: 0.0000, length: 14.05, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -9.22, centerZ: -10.37, dirX: 0.1251, dirZ: -0.9921, normalX: 0.9921, normalZ: 0.1251, length: 6.73, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -6.31, centerZ: -15.09, dirX: 0.8743, dirZ: -0.4854, normalX: 0.4854, normalZ: 0.8743, length: 5.69, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 0.08, centerZ: -16.45, dirX: 1.0000, dirZ: 0.0049, normalX: -0.0049, normalZ: 1.0000, length: 7.80, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 6.31, centerZ: -15.08, dirX: 0.8664, dirZ: 0.4993, normalX: -0.4993, normalZ: 0.8664, length: 5.38, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 9.08, centerZ: -10.31, dirX: 0.1274, dirZ: 0.9919, normalX: -0.9919, normalZ: 0.1274, length: 6.91, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 9.51, centerZ: -0.12, dirX: -0.0023, dirZ: 1.0000, normalX: -1.0000, normalZ: -0.0023, length: 13.52, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 9.08, centerZ: 10.17, dirX: -0.1143, dirZ: 0.9934, normalX: -0.9934, normalZ: -0.1143, length: 7.12, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 6.27, centerZ: 15.10, dirX: -0.8657, dirZ: 0.5006, normalX: -0.5006, normalZ: -0.8657, length: 5.56, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 0.12, centerZ: 16.43, dirX: -0.9998, dirZ: -0.0179, normalX: 0.0179, normalZ: -0.9998, length: 7.49, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -6.22, centerZ: 15.04, dirX: -0.8906, dirZ: -0.4548, normalX: 0.4548, normalZ: -0.8906, length: 5.82, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -8.78, centerZ: 13.73, dirX: 0.9196, dirZ: 0.3928, normalX: -0.3928, normalZ: 0.9196, length: 0.07, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    //Balizas
    { centerX: -3.04, centerZ: -10.07, dirX: 0.0314, dirZ: -0.9995, normalX: 0.9995, normalZ: 0.0314, length: 3.11, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 0.23, centerZ: -11.66, dirX: 0.9999, dirZ: -0.0112, normalX: 0.0112, normalZ: 0.9999, length: 6.44, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 3.44, centerZ: -10.17, dirX: -0.0110, dirZ: 0.9999, normalX: -0.9999, normalZ: -0.0110, length: 3.04, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 0.17, centerZ: -8.58, dirX: -0.9998, dirZ: 0.0216, normalX: -0.0216, normalZ: -0.9998, length: 6.51, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 3.35, centerZ: 10.06, dirX: 0.0022, dirZ: 1.0000, normalX: -1.0000, normalZ: 0.0022, length: 3.11, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 0.23, centerZ: 11.63, dirX: -1.0000, dirZ: 0.0056, normalX: -0.0056, normalZ: -1.0000, length: 6.23, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: -2.86, centerZ: 10.13, dirX: 0.0154, dirZ: -0.9999, normalX: 0.9999, normalZ: 0.0154, length: 3.05, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
    { centerX: 0.25, centerZ: 8.56, dirX: 0.9999, dirZ: -0.0158, normalX: 0.0158, normalZ: 0.9999, length: 6.18, thickness: 0.2, minY: 0, maxY: 9, color: '#00ff00' },
];

// Criar paredes  
function createWalls() {
    const container = document.querySelector('#walls-container');

    orientedWalls.forEach((wall, index) => {
        const wallBox = document.createElement('a-box');
        
        const angle = Math.atan2(wall.dirX, wall.dirZ) * (180 / Math.PI);
        
        wallBox.setAttribute('position', `${wall.centerX} ${(wall.minY + wall.maxY) / 2} ${wall.centerZ}`);
        wallBox.setAttribute('rotation', `0 ${angle} 0`);
        wallBox.setAttribute('width', wall.thickness);
        wallBox.setAttribute('height', wall.maxY - wall.minY);
        wallBox.setAttribute('depth', wall.length);
        wallBox.setAttribute('material', `opacity: 0.0; transparent: true; color: ${wall.color}`);
        wallBox.setAttribute('id', `wall-${index}`);
        
        container.appendChild(wallBox);
    });
}