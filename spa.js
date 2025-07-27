const pages = {
  map: `
    <div class="map-search-bar">
      <input id="mapSearchInput" type="text" placeholder="Search for a place or address" autocomplete="off" />
      <button id="mapSearchBtn" title="Search">🔍</button>
    </div>
    <div id="map"></div>
    <div class="map-topright-btns">
      <div id="mapPinBoxTopRight" title="Drop a Pin">
        <span class="pin-emoji">📍</span>
      </div>
      <div id="mapThemeBoxTopRight" title="Switch Map Theme">
        <button id="mapThemeSwitcher" class="theme-switch-btn">🖌️</button>
      </div>
    </div>
  `,
  drop: `<div class='empty-page'><h2>Drop a Pin</h2><p>Coming soon!</p></div>`,
  profile: `<div class='empty-page profile-green'></div>`,
  settings: `<div class='empty-page'><h2>Settings</h2><p>Coming soon!</p></div>`,
};

function setActivePage(page) {
  document.querySelectorAll('.sidebar-menu-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = pages[page] || '';
  if (page === 'map') {
    if (!window.flashbackMap) {
      const script = document.createElement('script');
      script.src = 'map.js';
      document.body.appendChild(script);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setActivePage('map');
  document.querySelectorAll('.sidebar-menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
      setActivePage(btn.dataset.page);
    });
  });
});
