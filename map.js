window.onload = function () {
  if (document.getElementById('map')) {
    const map = L.map('map', { zoomControl: false }).setView([20, 0], 2);
    window.map = map; // Make map globally accessible for search
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://carto.com/attributions">CARTO</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map);
    L.control.zoom({ position: 'topright' }).addTo(map);
    if (typeof L.Control.Geocoder !== 'undefined') {
      L.Control.geocoder({
        defaultMarkGeocode: true,
        placeholder: 'Search for a place...',
      }).addTo(map);
    }
    window.flashbackMap = map;
    window.map = map; // Ensure global

    if (window.firebase && firebase.firestore) {
      const db = firebase.firestore();
      // Helper to add markers from a collection
      function addMarkersFromCollection(collectionName) {
        db.collection(collectionName)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              const pin = doc.data();
              // Try both lat/lng and latitude/longitude field names
              const lat = pin.lat ?? pin.latitude;
              const lng = pin.lng ?? pin.longitude;
              if (typeof lat === 'number' && typeof lng === 'number') {
                const marker = L.marker([lat, lng]).addTo(map);
                marker.bindPopup(
                  `<b>${pin.title || ''}</b><br>${pin.place || ''}<br>${
                    pin.memory || ''
                  }`
                );
              }
            });
          });
      }
      addMarkersFromCollection('memoryPins');
      addMarkersFromCollection('pins');
    }
  }

  const pins = [];
  const pinForm = document.getElementById('pinForm');
  const pinsList = document.getElementById('pins');

  pinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(pinForm);
    const location = data.get('location');
    const memory = data.get('memory');
    const photo = data.get('photo');
    const pin = { location, memory, photo };
    pins.push(pin);
    renderPins();
    pinForm.reset();
  });

  function renderPins() {
    pinsList.innerHTML = '';
    pins.forEach(pin => {
      const li = document.createElement('li');
      if (pin.photo) {
        const img = document.createElement('img');
        img.src = pin.photo;
        img.alt = pin.location;
        li.appendChild(img);
      }
      const details = document.createElement('div');
      details.innerHTML = `<strong>${pin.location}</strong><br>${pin.memory}`;
      li.appendChild(details);
      pinsList.appendChild(li);
    });
  }
};
