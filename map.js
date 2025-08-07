window.onload = function () {
  if (document.getElementById('map')) {
    const map = L.map('map', { zoomControl: false }).setView([20, 0], 2);
    window.map = map;
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://carto.com/attributions">CARTO</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    window.flashbackMap = map;
    window.map = map;

    // Only show pins for the logged-in user
    if (window.firebase && firebase.firestore && firebase.auth) {
      firebase.auth().onAuthStateChanged(function (user) {
        if (!user) return;
        const db = firebase.firestore();
        db.collection('pins')
          .where('userId', '==', user.uid)
          .get()
          .then(snapshot => {
            console.log(`[flashback] User pins fetched: ${snapshot.size}`);
            if (snapshot.empty) {
              console.warn(
                '[flashback] No pins found in Firestore for this user.'
              );
            }
            snapshot.forEach(doc => {
              const pin = doc.data();
              console.log('[flashback] Pin data:', pin);
              const lat = pin.lat ?? pin.latitude;
              const lng = pin.lng ?? pin.longitude;
              if (typeof lat === 'number' && typeof lng === 'number') {
                const marker = L.marker([lat, lng]).addTo(map);
                marker.bindPopup(
                  `<b>${pin.title || ''}</b><br>${pin.place || ''}<br>${
                    pin.memory || ''
                  }`
                );
              } else {
                console.warn('[flashback] Pin missing lat/lng:', pin);
              }
            });
          })
          .catch(err => {
            console.error('[flashback] Error fetching user pins:', err);
          });
      });
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
