
$(function(){
  var $lemail = $("#lemail");
  var $lpassword = $("#lpassword");
  
  $('#lbutton').on('click', function()
  {
    var userdata = {
      email: $lemail.val(),
      password: $lpassword.val(),
    };
    
    $.ajax({
      type: "POST", 
      url: "/login",
      data: {user: userdata}, 
      success: function(resp)
      {
        alert(resp);
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

window.onload = loadpages;

function togglelogin()
{
  $(document).ready(function(){
    var login = document.getElementById("loginbutton");
    if(login.value == "off")
    {
      $("#loginholder").slideDown();
      login.value = "on";
    }
      
    else if(login.value == "on")
    {
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