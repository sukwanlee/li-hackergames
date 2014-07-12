function createHospital(hospitalName, long, lat, hospitalAddress, hospitalNumber)
{
	var HospitalObj = Parse.Object.extend("hospital");
	var hospitalObj = new HospitalObj();
	var point = new Parse.GeoPoint({latitude: long, longitude: lat});
	hospitalObj.save({
		name: hospitalName, 
		location: point, 
		address: hospitalAddress,
		number: hospitalNumber}, {
		success: function(object) {
			console.log("Successfully created the hospital "+hospitalName);
		},
		error: function(model, error) {
			console.log("Failed to create the hospital "+hospitalName);
		}
	});
}

function getHospitals()
{
	var hospital = Parse.Object.extend("hospital");
	var query = new Parse.Query(hospital);
	query.find({
		success: function(results) {
			console.log("Successfully retrieved " + results.length + " hospitals");
			//TODO: update the UI
			for (var i = 0; i < results.length; i++) { 
				var object = results[i];
				console.log(object.id + ' - ' + object.get('name'));
			}
		},
		error: function(error) {
			console.log("Failed to retrieve hospitals");
		}
	});
}

function distanceInMiles(lat1, long1, lat2, long2)
{
	var p1 = new Parse.GeoPoint({latitude: lat1, longitude: long1});
	var p2 = new Parse.GeoPoint({latitude: lat2,longitude: long2});
	return p1.milesTo(p2);
}


function addPatient(patientName, number, hospitalName, atHospital, isValidated, sym, ets)
{
    var PatientObj = Parse.Object.extend("patient");
    var patient = new PatientObj();
    patient.save({
      name: patientName,
      is_validated:isValidated,
      hospital:hospitalName,
      at_hospital:atHospital,
      is_finished: false,
      number: number,
      symptom: sym,
      estimate_treatment_duration: ets}, {
      success: function(object) {
        console.log("Successfully created the patient "+patientName);
      },
      error: function(model, error) {
        console.log("Failed to create the patient "+patientName+" : "+error.message);
      }
    });
}

function initializeGoogleMap() {
		var mapOptions = {
			center: new google.maps.LatLng(-34.397, 150.644),
			zoom: 8
		};
		var map = new google.maps.Map(document.getElementById("map-canvas"),
				mapOptions);
}

function getWaitingAtHospital(hospitalName)
{
	var PatientObj = Parse.Object.extend("patient");
	var query = new Parse.Query(PatientObj);
	query.equalTo("is_validated", true);
	query.equalTo("at_hospital", true);
	query.equalTo("is_finished", false);
	query.equalTo("hospital", hospitalName);
	query.find({
		success: function(results) {
			console.log("Successfully counted num waiting at hospital "+hospitalName+" : "+results.length);
		},
		error: function(error) {
			console.log("Failed to count num waiting at hospital "+hospitalName);
		}
	});
}

function getSignedUp(hospitalName)
{
	var PatientObj = Parse.Object.extend("patient");
	var query = new Parse.Query(PatientObj);
	query.equalTo("is_validated", true);
	query.equalTo("at_hospital", false);
	query.equalTo("is_finished", false);
	query.equalTo("hospital", hospitalName);
	query.find({
		success: function(results) {
			console.log("Successfully counted num waiting at hospital "+hospitalName+" : "+results.length);
		},
		error: function(error) {
			console.log("Failed to count num waiting at hospital "+hospitalName);
		}
	});
}

function changePatientStatus(objectId, at_hospital, is_finished)
{
	var PatientObj = Parse.Object.extend("patient");
	var query = new Parse.Query(PatientObj);
	query.get(objectId, {
		success: function(patient) {
				patient.set("at_hospital", at_hospital);
				patient.set("is_finished", is_finished);
				patient.save();
				console.log("Successfully updated "+objectId);
		},
		error: function(object, error) {
			console.log("Failed to update "+objectId);
		}
	});
}

function getShortestRoute(origin, destination, hospital)
{
	//var origin = new google.maps.LatLng(55.930385, -3.118425);
	//var destination = new google.maps.LatLng(50.087692, 14.421150);
	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix(
		{
			origins: [origin],
			destinations: [destination],
			travelMode: google.maps.TravelMode.DRIVING,
			durationInTraffic: true
		}, googleMapDistanceCallback);

	function googleMapDistanceCallback(response, status) {
		if (status == google.maps.DistanceMatrixStatus.OK) {
			var origins = response.originAddresses;
			var destinations = response.destinationAddresses;
			//Get the route that takes the shortest time
			var minDistance = Number.MAX_VALUE;
			var minDuration = Number.MAX_VALUE;
			var minDistanceText;
			var minDurationText;
			for (var i = 0; i < origins.length; i++) {
				var results = response.rows[i].elements;
				for (var j = 0; j < results.length; j++) {
					var element = results[j];
					if(element.duration.value < minDuration)
					{
						minDistance = element.distance.value;
						minDuration = element.distance.value;
						minDurationText = element.duration.text;
						minDistanceText = element.distance.text;
					}
				}
			}
			console.log(minDurationText);
			console.log(minDistanceText);
		}
	}
}

function getEstimatedTime(hospitalName)
{
  var PatientObj = Parse.Object.extend("patient");
  var query = new Parse.Query(PatientObj);
  query.equalTo("is_validated", true); 
  query.equalTo("is_finished", false);
  query.equalTo("hospital", hospitalName);
        query.find({
    success: function(results) {
      var sum = 0;
      for(var i = 0; i< results.length;i++)
      {
        sum += results[i].attributes.estimate_treatment_duration;
      }
      console.log(sum);
    },
    error: function(error) {
      console.log("Failed to count num waiting at hospital "+hospitalName);
    }
  });
}