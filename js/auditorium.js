function setupAuditorium() {
  const auditoriumContainer = document.querySelector('#auditorium-container');
  if (!auditoriumContainer) return;

  document.addEventListener('player-teleported', (e) => {
    auditoriumContainer.setAttribute(
      'visible',
      e.detail.destination === 'auditorium'
    );
  });
}

window.addEventListener('DOMContentLoaded', setupAuditorium);
