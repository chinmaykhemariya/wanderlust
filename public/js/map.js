

    console.log(mapToken)
    mapboxgl.accessToken =`${mapToken}`;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: userListings.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });console.log(userListings.geometry.coordinates)
     const marker1 = new mapboxgl.Marker({color:'red'})
        .setLngLat(userListings.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${userListings.title}</h4>
            <p>Exact location provided after booking</p>`))
        .addTo(map);
