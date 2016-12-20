//addapted from:
//http://pemboo.com/post/real-time-location-sharing-with-nodejs-and-socketio-on-google-maps
var map;
//RUN MAP
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {center: {lat: 49.037, lng: 14.974}, zoom: 2, options: {draggable: true}});
}

//GET LOCATION VIA IP ADDRESS
function ipPosition(){
	$.get("http://ipinfo.io", function(response){
		var loc = response.loc.split(',');
		pos = {
			lat: parseFloat(loc[0]),
			lng: parseFloat(loc[1])
		};
	}, "json");
}
ipPosition();

//MAKE MARKERS AT LOCATIONS
var markersArray = [];
var getMarkerID = function(lat, lng){
	return lat + '_' + lng;
}
//add marker and push to array
function addMarker(location){
	//give the marker an id
	var markerID = getMarkerID(location.lat, location.lng);
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		animation: google.maps.Animation.DROP, 
		id: markerID
	});
	markersArray[markerID] = marker
}

var removeMarker = function(marker, markerID) {
	marker.setMap(null);
	delete markers[markerID];
}

//SOCKET STUFF
var socket = io();


$(document).ready(function(){
	check_pos = setInterval(function(){ //create a loop and wait for the response
		if(typeof pos != 'undefined'){ 
			socket.emit('new_user', {pos: pos}); //send position of new user
			clearInterval(check_pos);
		}
	}, 500);
	socket.on('connected', function(data){
		addMarker(data.pos);
	});
	socket.on('disconnected', function(data){
		//we can now delete this position:
		var markerId = getMarkerUniqueId(data.del.lat, data.del.lng); // get marker id by using clicked point's coordinate
		var marker = markers[markerId]; // find marker
		removeMarker(marker, markerId); // remove it
	});
});

