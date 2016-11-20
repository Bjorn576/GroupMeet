$(document).ready(function(){
  $("#user_group_ids").change(function(){
    //Groupid is set to the value of the option in the dropdown. This should be the corresponding groupid
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
});

$(document).ready(function(){
  $("#adduserbutton").click(function()
  {
    var addusers = [];
    var groupid = $("#user_group_ids").val();
    $("#selectaddusers > option").each(function(i){
      if(this.selected == true){
        alert("GOOD");
        addusers.push(this.value);
      }

    });
    alert(addusers);
    $.ajax({
      type: "POST",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: "/adduser",
      data: {addusers:addusers, groupid: groupid},
      success: function(resp){
        console.log("Success", resp);
      },
      error: function(resp){
        console.log("Error", resp);
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



function togglelogin()
{
  $(document).ready(function(){
    var login = document.getElementById("loginbutton");
    if(login.value == "off")
    {
      login.textContent = "Minimize";
      $("#loginholder").slideDown();
      login.value = "on";
    }

    else if(login.value == "on")
    {
      login.textContent = "Login";
      $("#loginholder").slideUp();
      login.value = "off";
    }
  });

}

function togglereg()
{
  var reg = document.getElementById("regbutton");
  if(reg.value == "off")
  {
    $("#regholder").slideDown();
    reg.value = "on";
  }

  else if(reg.value == "on")
  {
    $("#regholder").slideUp();
    reg.value = "off";
  }
}
