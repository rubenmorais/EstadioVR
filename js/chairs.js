const positions = [-7, -5, -3, 3, 5, 7]; 
const container = document.querySelector('#chairs-container');

positions.forEach(z => {
  const chair = document.createElement('a-entity');
  chair.setAttribute('gltf-model', '#chair');
  chair.setAttribute('position', `8.3 7 ${z}`);
  chair.setAttribute('rotation', '0 -90 0');
  chair.setAttribute('scale', '1.5 1.5 1.5');
  container.appendChild(chair);
});