

function saveLocations()
{
	var addresses = [];
	var groupid = $("#user_group_ids").val();

	$(".addrInput").each(function (){
		addresses.push($(this).val());
	});

	$.ajax({
		type: "POST",
		beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
		url: "/savelocations/" + groupid,
		datatype: "json",
		data: {locations: addresses}
	});
}

function loadLocations()
{
	var addresses = [];
	var groupid = $("#user_group_ids").val();

	$.ajax({
		type: "GET",
		beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
		url: "/loadlocations/" + groupid,
		datatype: "json",
		success: function (locations){
			
		},
	});
}

function increaseAddrInput(count)
{
	
}