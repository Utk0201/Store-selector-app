mapboxgl.accessToken = mapToken;
/* This will let you use the .remove() function later on */
if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

function buildLocationList(data) {
  data.features.forEach(function (store, i) {
    /**
     * Create a shortcut for `store.properties`,
     * which will be used several times below.
    **/
    var prop = store.properties;

    /* Add a new listing section to the sidebar. */
    var listings = document.getElementById('listings');
    var listing = listings.appendChild(document.createElement('div'));
    /* Assign a unique `id` to the listing. */
    listing.id = "listing-" + data.features[i].properties.id;
    /* Assign the `item` class to each listing for styling. */
    listing.className = 'item';

    /* Add the link to the individual listing created above. */
    var link = listing.appendChild(document.createElement('a'));
    link.href = '#';
    link.className = 'title';
    link.id = "link-" + prop.id;
    link.innerHTML = prop.address;

    /* Add details to the individual listing. */
    var details = listing.appendChild(document.createElement('div'));
    details.innerHTML = prop.city;
    if (prop.phone) {
      details.innerHTML += ' · ' + prop.phoneFormatted;
    }
    if (prop.distance) {
      var roundedDistance = Math.round(prop.distance * 100) / 100;
      details.innerHTML +=
        '<p><strong>' + roundedDistance + ' miles away</strong></p>';
    }
    link.addEventListener('click', function (e) {
      for (var i = 0; i < data.features.length; i++) {
        if (this.id === "link-" + data.features[i].properties.id) {
          var clickedListing = data.features[i];
          flyToStore(clickedListing);
          createPopUp(clickedListing);
        }
      }
      var activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');
    });
  });
}

function flyToStore(currentFeature) {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 15
  });
}

function createPopUp(currentFeature) {
  var popUps = document.getElementsByClassName('mapboxgl-popup');
  /** Check if there is already a popup on the map and if so, remove it */
  if (popUps[0]) popUps[0].remove();

  var popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML('<h3>Sweetgreen</h3>' +
      '<h4>' + currentFeature.properties.address + '</h4>')
    .addTo(map);
}
// console.log(stores.type);
// console.log("Here");
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-77.034084, 38.909671],
  //   center: [85.3362599468097,23.337905513886977], //  implement it later
  zoom: 13,
  scrollZoom: false
});
function addMarkers() {
  /* For each feature in the GeoJSON object above: */
  stores.features.forEach(function(marker) {
    /* Create a div element for the marker. */
    var el = document.createElement('div');
    
    /* Assign a unique `id` to the marker. */
    el.id = "marker-" + marker.properties.id;
    /* Assign the `marker` class to each marker for styling. */
    el.className = 'marker';
    el.addEventListener('click', function(e){
      /* Fly to the point */
      flyToStore(marker);
      /* Close all other popups and display popup for clicked store */
      createPopUp(marker);
      /* Highlight listing in sidebar */
      var activeItem = document.getElementsByClassName('active');
      e.stopPropagation();
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      var listing = document.getElementById('listing-' + marker.properties.id);
      listing.classList.add('active');
    });
    /**
     * Create a marker using the div element
     * defined above and add it to the map.
    **/
    new mapboxgl.Marker(el, { offset: [0, -23] })
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
  });
}
map.on('load', function (e) {
  map.addSource('places', {
    type: 'geojson',
    data: stores
  });
  addMarkers();
  buildLocationList(stores);
});