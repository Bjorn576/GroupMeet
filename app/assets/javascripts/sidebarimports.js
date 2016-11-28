
function load_group()
{
  $(document).ready(function(){
    var $users = $("#userbox")
    $users.empty();
    var groupid = $("#user_group_ids").val();
    console.log("GROUPIDFOUND", groupid);
    $(function(){
      $.ajax({
        type: 'GET',
        url: '/groups/'+groupid,
        dataType: "json",
        success: function(users){
          console.log('success', users);
          $.each(users, function(i, user){
            $users.append("<li>Name:" + user.firstName + " " + user.lastName + " | Email:" + user.email + "</li>")

          });
        },
        error: function(data){
          console.log("fail", data);
        }

      });
    });
  });
}

window.onload = load_group();

$(document).ready(function(){
  $("#user_group_ids").change(function(){
    //Groupid is set to the value of the option in the dropdown. This should be the corresponding groupid
    load_group();
  });
});

$(document).ready(function(){
  $("#adduserbutton").click(function()
  {
    var $users = $("#userbox")
    var addusers = [];
    var groupid = $("#user_group_ids").val();
    $("#selectaddusers > option").each(function(i){
      if(this.selected == true){
        addusers.push(this.value);
      }

    });
    $.ajax({
      type: "POST",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: "/adduser",
      dataType: "json",
      data: {addusers:addusers, groupid: groupid},
      success: function(users){
        $.each(users, function(i, user){
          $users.append("<li>Name:" + user.firstName + " " + user.lastName + " | Email:" + user.email + "</li>")
        });
        console.log("Success", users);
      },
      error: function(resp){
        console.log("Error", users);
      }
    });
  });
});


function loadpages()
{
  $(document).ready(function(){
    $("#loginholder").load("/login").hide();
    $("#regholder").load("/signup").hide();
  });
}
