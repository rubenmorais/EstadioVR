// Sistema de teleporte
function setupTeleportButtons() {
  const rig = document.querySelector('#rig');
  const camera = document.querySelector('#camera');
  const clickables = document.querySelectorAll('.clickable');

  clickables.forEach(clickable => {

    clickable.addEventListener('mouseenter', startCursorProgress);
    clickable.addEventListener('mouseleave', stopCursorProgress);

    clickable.addEventListener('click', function () {
      const x = parseFloat(this.dataset.targetX);
      const y = parseFloat(this.dataset.targetY);
      const z = parseFloat(this.dataset.targetZ);
      const destination = this.dataset.destination;

      if ([x, y, z].some(isNaN)) return;

      rig.object3D.position.set(x, y, z);
      camera.object3D.position.set(0, 1.6, 0);

      if (typeof previousPos !== 'undefined') {
        previousPos = { x, y, z };
      }

      resetCursorProgress();

      document.dispatchEvent(new CustomEvent('player-teleported', {
        detail: { x, y, z, destination }
      }));
    });
  });
}

window.addEventListener('DOMContentLoaded', setupTeleportButtons);

