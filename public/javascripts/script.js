//initialisation map
var map = L.map('worldmap').setView([48.866667, 2.333333], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var customIcon = L.icon({
    iconUrl: '/images/leaf-red.png',
    shadowUrl: '/images/leaf-shadow.png',

    iconSize: [38, 95],
    shadowSize: [50, 64],

    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],

    popupAnchor: [-3, -76]
});


var circle = L.circle(
    [48.858370, 2.294481],
    {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.2,
        radius: 500
    }
);

let cities = document.getElementsByClassName('city');
for (let i = 0; i < cities.length; i++) {
    let cityLat = cities[i].dataset.lat;
    let cityLon = cities[i].dataset.lon;
    let cityName = cities[i].dataset.name;

    //version custom
    // var marker = L.marker([cityLat, cityLon], { icon: customIcon }).addTo(map).bindPopup(cityName);

    //    version cercle
    // var marker = L.circle(
    //     [cityLat, cityLon],
    //     {
    //         color: 'red',
    //         fillColor: '#f03',
    //         fillOpacity: 0.2,
    //         radius: 500
    //     }
    // ).addTo(map).bindPopup(cityName);

    //version non custom
    var marker = L.marker([cityLat, cityLon]).addTo(map).bindPopup(cityName);
}


map.on('click', function (e) {
    // var container = L.DomUtil.create('div'),
    //     startBtn = createButton('Start from this location', container),
    //     destBtn = createButton('Go to this location', container);

    // L.popup()
    //     .setContent(container)
    //     .setLatLng(e.latlng)
    //     .openOn(map);

    // L.DomEvent.on(startBtn, 'click', function () {
    //     control.spliceWaypoints(0, 1, e.latlng);
    //     console.log(waypoints)
    //     map.closePopup();
    // });
    // L.DomEvent.on(destBtn, 'click', function () {
    //     console.log(control.getWaypoints())
    //     control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
    //     map.closePopup();
    // });

    let eventLat = e.latlng.lat;
    let eventLng = e.latlng.lng;

    document.getElementById('cityLat').setAttribute('name', 'eventLat')
    document.getElementById('cityLat').setAttribute('value', eventLat)
    document.getElementById('cityLng').setAttribute('name', 'eventLng')
    document.getElementById('cityLng').setAttribute('value', eventLng)
    document.getElementById('form').submit();




    console.log(eventLat, eventLng)
});