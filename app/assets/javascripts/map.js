var locationType;
var locationIndex = 5;
var map;
var addressPoints;
var markers;
var bounds;
var autocompletes = [];

var addrCount = 2;
var addrLength = 0;
var addrMinimum = 2;

$( document ).ready(function() {
    console.log( "ready!" );
		var options = {
		  componentRestrictions: {country: 'ca'}
		};

		$('.addrInput').each(function() {
			var autocomplete = new google.maps.places.Autocomplete($(this)[0], options);
			autocompletes.push(autocomplete);
		});


});

//Note: this gets called from a callback on the script include in the html!
//Although, probably a better way to do it...
function addAddressHTML() {
	addrCount++;
	var addrStr = 'addr' + addrCount;
	var newHTML = 'Address ' + addrCount + ': <input id="' + addrStr + '" type="text" class="addrInput" name="'+ addrStr +'"><br>'

	$( "#addressList" ).append(newHTML);
}

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 49.277469, lng: -122.914338},
		zoom: 13,
		mapTypeControl: false,
		streetViewControl: false,
  		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	setOptionModal();
}

function clearMarkers() {
	if(markers != null || markers && undefined) {
		for(var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
	}
}

function setOptionModal() {
	$('#locList').change(function(){
	  if($('#locList').val() == "Other...") {
			$('#optionModal').addClass("show").removeClass("fade");

	  }
	  else {
			$('#optionModal').addClass("fade").removeClass("show");
	  }
	});

	//Click function to hide modal on 'x' press
	$('#optionModalClose').click(function() {
		$('#optionModal').addClass("fade").removeClass("show");
		$("#locList").val($('#initOption').val()).trigger('change');
	});

	//Add user specified option, re-order so 'Other...' is @ bottom of list
	$('#optionModalSave').click(function() {
		if($('#optionModalInput').val().length > 0) {
			$('#optionModalClose').click(); //hide the modal

			$('#otherOption').remove();

			//Add user option
			$('#locList').append($('<option/>', {
        text : $('#optionModalInput').val(),
    	}).attr('index', locationIndex));
			$("#locList").val($('#optionModalInput').val()).trigger('change');

			//Re add "other" at bottom of list
			$('#locList').append($('<option/>', {
        text : 'Other...',
        id : 'otherOption'
    	}).attr('index', locationIndex += 1).attr('data-toggle', 'modal').attr('data-target', '#optionModal'));

    	//Reset modal val
    	$('#optionModalInput').val('');
		}
	});
}

function loadLocation() {
	if(locationType == undefined || locationType == null)
		locationType = "";
	else
		locationType = $("#locList").val();

}

function calculateAddr() {
	addressPoints = [];
	bounds = new google.maps.LatLngBounds();

	locationType = "";
	clearMarkers();
	markers = [];
	addrLength = 0;

	loadLocation();

	//gets expected count of addresses, so not calculating >1 time
	$(".addrInput").each(function() {
		if($(this) != null && $(this).val().length > 0)
			addrLength += 1;
	});

	$(".addrInput").each(function() {
		var addr = $(this).val();
		addAddress(addr);
	});

}

function addAddress(addr) {
	if(addr != null && addr.length > 0) {
		console.log(addr);
		//load the data
		$.getJSON( {
			url  : 'https://maps.googleapis.com/maps/api/geocode/json',
			data : {
				componentRestrictions: {
					country: 'CA'
				  },
				sensor  : false,
				address : addr
			},
			success : function( data, textStatus ) {
				addAddressToArray(data);
			} //should add popup window on error
		} );
	}
}

function addAddressToArray(data) {
	if(data != null) {
		var address = data.results[0].geometry.location;
		addressPoints.push(address);

		if(addressPoints.length == addrLength && addrLength >= addrMinimum) {
			calculateMidpoint();
		}
	}
}

function calculateMidpoint() {

	var lat = 0.0;
	var lng = 0.0;

	console.log("addresspoints len: " + addressPoints.length);

	for(var i = 0; i < addressPoints.length; i++) {
		console.log("adding: lat:" + addressPoints[i].lat + " lng: " + addressPoints[i].lng);
		lat = lat + addressPoints[i].lat;
		lng = lng + addressPoints[i].lng;
	}

	lat = lat / addressPoints.length;
	lng = lng / addressPoints.length;

	var pointStr = lat + "," + lng;
	console.log(pointStr);

	//After calculating midpoint, now need to get its nearest address
	$.getJSON( {
		url  : 'https://maps.googleapis.com/maps/api/geocode/json',
		data : {
			latlng : pointStr
		},
		success : function( data, textStatus ) {
			addPointToMap(data.results[0]);
		} //should add popup window on error
	} );
}

//Adds calculated midpoint to the map, looks for surround locations by keyword
function addPointToMap(addr, isUserLocation) {
	if(addr != null) { //don't really need to check for null, as this only gets called on success of ajax function
		var iconColor = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
		if(isUserLocation != undefined && isUserLocation == true)
			iconColor = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';

		var infoWindow = new google.maps.InfoWindow({
			  content: buildContentString('Calculated Location', addr.formatted_address)
			});

		var marker = new google.maps.Marker({
			position: addr.geometry.location,
			map: map,
			title: addr.formatted_address,
			icon: iconColor
		});

		addMarkerToMap(marker, infoWindow);
		loadLocationsForMarkerByKeyword(locationType, marker.getPosition());
	}
}

function addMarkerToMap(marker, infoWindow) {
	marker.addListener('click', function() {
		if(infoWindow)
		  infoWindow.open(map, marker);
		});

	markers.push(marker);

	var current_bounds = map.getBounds();
	var marker_pos = marker.getPosition();

	bounds.extend(marker.getPosition()); //extend the bounds to include the marker
}

function loadLocationsForMarkerByKeyword(keyword, markerPos) {
	console.log("loading " + keyword +"...\n")
	var request = {
		location: markerPos,
		radius: 2000,
		keyword: keyword
	  };

	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, addNearbyLocations);
}

function buildContentString(title, subtitle) {
	var contentString;
	if(title != null) {
		contentString =
			'<div id="content"><h4 id="firstHeading" class="firstHeading">'
			+ title + '</h4>';
	}
	if(subtitle != null) {
		contentString += '<p id="secondHeading" class="secondHeading">'
		+ subtitle + '</p>';
	}
	return contentString;
}

function addNearbyLocations(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			var addr = results[i];

			var infoWindow = new google.maps.InfoWindow({
				  content: buildContentString(addr.name, addr.vicinity)
				});

			var marker = new google.maps.Marker({
				position: addr.geometry.location,
				map: map,
				title: addr.formatted_address
			});

			addMarkerToMap(marker, infoWindow);
		}

		//now set bounds to include our calculated locations
		map.fitBounds(bounds);
	}
}


