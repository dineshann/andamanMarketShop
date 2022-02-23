
$("#loginbtn").click(function(){
	$("#loginModal").modal();
});

$(document).on('click', '#openregisterbox', function(){
	$("#signinbox").hide(100);
	$("#signupbox").show(100);
});
$(document).on('click', '.openloginbox', function(){
	$("#signupbox").hide(100);
	$("#signinbox").show(100);
});
$(document).on('click', '.loginsigupbtn', function(){
	var rel = $(this).attr('rel');
	//alert(rel);
	//$("#loginiput").addClass('show-cac');
	$("#forgotPasswordModel").modal('hide');
	//$("#loginiput").removeClass('hide-cac');
	//$("#registerinput").removeClass('show-cac');
	//$("#registerinput").addClass('hide-cac');
	$('#regFrm').show();
	$('#alreadyloginbtn').show();
	$('#rtmodal-1').modal('show');
	
	if(rel == 'login')
	{
		$("#loginiput").addClass('show-cac');
		$("#loginiput").removeClass('hide-cac');
		
		$("#registerinput").addClass('hide-cac');
		$("#registerinput").removeClass('show-cac');
	}
	else
	{
		$("#loginiput").addClass('hide-cac');
		$("#loginiput").removeClass('show-cac');
		
		$("#registerinput").addClass('show-cac');
		$("#registerinput").removeClass('hide-cac');
	}
});

$(document).on('click', '.loginshow', function(){
	$("#loginiput").addClass('show-cac');
	$("#loginiput").removeClass('hide-cac');
	$("#registerinput").removeClass('show-cac');
	$("#forgotPasswordModel").modal('hide');
	$("#reg_opt_modal").modal('hide');
	$('#reg_opt_modal').on('hidden.bs.modal', function () {
		$(".loginsigupbtn").click();
		$('#rtmodal-1').modal('show');
	})
	
});

$(".forgotpass").click(function(){
	$("#forgotPasswordModel").modal();
});

$(document).on('keypress', '.otpnum', function(){
	$("#otperrormsg").html('');
	$(this).next().focus();
	
});

$(document).on('click', '.verifynow', function(){
	$("#rtmodal-1").modal('hide');
	$("#from_pg_1").val($("#from_pg").val());
	$("#reg_opt_modal").modal();
	resendotp();
});
//$("#reg_opt_modal").modal();
$("#regFrm").validate({
   rules: {
		fname: "required",
		lname: "required",
		mobile: "required",
		promocheck: "required",
		agreetermscond: "required",
		email: {
			email:true,
			required:true
		},
		password: "required",
		confirm_pass: {
			required:true,
			equalTo: '#passw'
		}
	},
	errorPlacement: function(error, element) {
		error.insertAfter(element);
	},
	messages: {
		 //email: "Please provide email address"       
	},      
	submitHandler: function()
	{
		$.ajax({
			type: "POST",
			url: website_url+'home/register',
			data: $('#regFrm').serialize(),
			success: function(response) {
				var obj = $.parseJSON(response);
				if(obj.status == '1')
				{
					//$("#regFrm").hide();
					//$("#regSuccess").show();
					$("#alreadyloginbtn").hide();
					/* if(obj.from_pg != '')
					{
						setTimeout(function(){
						   location.reload();
						}, 2000);
					} */
					//alert('asdfa');
					
					$("#registered_user_id").val(obj.registered_user_id);
					$("#from_pg_1").val(obj.from_pg);
					$("#otpphn").html(obj.phone);
					$("#reg_opt_modal").modal();
				}
				else
				{
					$(".regErrormsg").html('<div role="alert" class="alert alert-danger alert-dismissible">'+obj.message+'</div>');
				}
			},
			error: function() {
				alert("failure");
			}
		}); 
	}     
});

$("#otpfrm").validate({
   rules: {
		'otp[]': "required",
	},
	errorPlacement: function(error, element) {
		error.insertAfter($(".otpnum").last());
	},
	messages: {
		 'otp[]': "Please enter otp"       
	},      
	submitHandler: function()
	{
		$.ajax({
			type: "POST",
			url: website_url+'home/verify_otp',
			data: $('#otpfrm').serialize(),
			success: function(response) {
				var obj = $.parseJSON(response);
				if(obj.status == '1')
				{
					$("#otpfrm").hide();
					$("#regSuccess").show();
					$("#otperrormsg").html('');
					//$("#alreadyloginbtn").hide();
					if(obj.from_pg != '')
					{
						setTimeout(function(){
						   location.reload();
						}, 2000);
					}
					//alert('asdfa');
					
					/* $("#rtmodal-1").modal('hide');
					$("#reg_opt_modal").modal(); */
				}
				else
				{
					$("#otperrormsg").html('<div role="alert" class="alert alert-danger alert-dismissible">'+obj.message+'</div>');
				}
			},
			error: function() {
				alert("failure");
			}
		}); 
	}     
});

$("#loginfrm").validate({
   rules: {
		username: {
			required:true
		},
		password: "required"
	},
	errorPlacement: function(error, element) {
		error.insertAfter(element);
	},
	messages: {
		 //email: "Please provide email address"       
	},      
	submitHandler: function()
	{
		$.ajax({
			type: "POST",
			url: website_url+'home/signin/ajax',
			data: $('#loginfrm').serialize(),
			success: function(response) {
				var obj = $.parseJSON(response);
				if(obj.result == '1')
				{
					if(obj.redirect == '')
					{
						location.reload();
					}
					else
					{
						window.location.href = website_url+obj.redirect;
					}
					//window.location.href = '<?php echo base_url("user/my_account"); ?>';
				}
				else
				{
					if(obj.userid)
					{
						$("#registered_user_id").val(obj.userid);
					}
					$("#logerrormsg").html('<div role="alert" class="alert alert-danger alert-dismissible">'+obj.msg+'</div>');
				}
			},
			error: function() {
				alert("failure");
			}
		}); 
	}     
});


$("#forgotPsssfrm").validate({
   rules: {
		fp_email: {
			email:true,
			required:true
		}
	},
	errorPlacement: function(error, element) {
		error.insertAfter(element);
	},
	messages: {
		 //email: "Please provide email address"       
	},      
	submitHandler: function()
	{
		$.ajax({
			type: "POST",
			url: website_url+'api/forgot_password',
			data: $('#forgotPsssfrm').serialize(),
			dataType:'json',
			success: function(data) {
				//var obj = $.parseJSON(response);
				console.log(data);
				if(data.responce == true)
				{
					sweetalert_msg('success', 'Congrates!', data.error);
				}
				else
				{
					sweetalert_msg('error', 'Error!', data.error);
				}
			},
			error: function() {
				alert("failure");
			}
		}); 
	}     
});

$("#dashboardfrm").validate({
   rules: {
		first_name: "required",
		last_name: "required",
		dob_day: "required",
		dob_month: "required",
		dob_year: "required"
	},
	errorPlacement: function(error, element) {
		error.insertAfter(element);
	},
	messages: {
		 //email: "Please provide email address"       
	},      
	submitHandler: function()
	{
		$.ajax({
			type: "POST",
			url: website_url+'user/save_profileinfo',
			data: $('#dashboardfrm').serialize(),
			success: function(response) {
				//alert(response);
				var obj = $.parseJSON(response);
				if(obj.status == '1')
				{
					$(".dasherrormsg").html('<div role="alert" class="alert alert-success alert-dismissible">'+obj.message+'</div>');
					
					$("#regFrm").hide();
					$("#regSuccess").show();
					setTimeout(function(){
					   //$('#profleinfoformmodel').modal('hide');// or fade, css display however you'd like.
					   location.reload();
					}, 2000);
				}
				else
				{
					$(".dasherrormsg").html('<div role="alert" class="alert alert-danger alert-dismissible">'+obj.message+'</div>');
				}
			},
			error: function() {
				alert("failure");
			}
		}); 
	}     
});

/* $.validator.addMethod("pwcheck", function(value) {
   return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
       && /[a-z]/.test(value) // has a lowercase letter
       && /\d/.test(value) // has a digit
}, "There should be at least 1 digit and 1 charcter"); */

$.validator.addMethod('mypassword', function(value, element) {
        return this.optional(element) || (value.match(/[a-zA-Z]/) && value.match(/[0-9]/));
    },
    'Password must contain at least one numeric and one alphabetic character.');

$("#changepassfrm").validate({
   rules: {
		old_pass: "required",
		new_pass: {
			required:true,
			minlength: 8,
			mypassword:true
		},
		confirm_pass: {
			required:true,
			equalTo: '#new_pass'
		}
	},
	errorPlacement: function(error, element) {
		error.insertAfter(element);
	},
	messages: {
		 //email: "Please provide email address"       
	},      
	submitHandler: function()
	{
		$.ajax({
			type: "POST",
			url: website_url+'user/changepass_ajax',
			data: $('#changepassfrm').serialize(),
			success: function(response) {
				var obj = $.parseJSON(response);
				if(obj.status == '1')
				{
					$("#cpmsg").html('<div role="alert" class="alert alert-success alert-dismissible">'+obj.msg+'</div>');
				}
				else
				{
					$("#cpmsg").html('<div role="alert" class="alert alert-danger alert-dismissible">'+obj.msg+'</div>');
				}
			},
			error: function() {
				alert("failure");
			}
		}); 
	}     
});

function subscribenow()
{
	var subsEmail = $("#subsemail").val();
	if(subsEmail)
	{
		if(ValidateEmail(subsEmail))
		{
			var data = 'email='+subsEmail;
			$.ajax({
				type: "POST",
				url: website_url+'user/subscribe',
				data: data,
				success: function(response) {
					var obj = $.parseJSON(response);
					if(obj.result == '1')
					{
						$(".subsemailerror").removeClass('error').addClass('whitetext').html('you have successfully subscribed our newsletter.');
						$("#subsemail").val('');
					}
					else
					{
						$(".subsemailerror").html('Something is went wrong!');
					}
				},
				error: function() {
					alert("failure");
				}
			}); 
		}
		else
		{
			$(".subsemailerror").html('Please enter a valid email id.');
		}
	}
	else
	{
		$(".subsemailerror").html('Please enter email id.');
	}
}
function ValidateEmail(email) 
{
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
	{
		return (true)
	}
    //alert("You have entered an invalid email address!")
    return (false)
}
function resendotp()
{
	$.ajax({
		type: "POST",
		url: website_url+'home/resend_otp',
		data: $('#otpfrm').serialize(),
		success: function(response) {
			var obj = $.parseJSON(response);
			if(obj.status == '1')
			{
				$("#otperrormsg").html('<div role="alert" class="alert alert-success alert-dismissible">'+obj.message+'</div>');
				
				/* $("#otpfrm").hide();
				$("#regSuccess").show();
				$("#otperrormsg").html('');
				//$("#alreadyloginbtn").hide();
				if(obj.from_pg != '')
				{
					setTimeout(function(){
					   location.reload();
					}, 2000);
				} */
				//alert('asdfa');
				
				/* $("#rtmodal-1").modal('hide');
				$("#reg_opt_modal").modal(); */
			}
			else
			{
				$("#otperrormsg").html('<div role="alert" class="alert alert-danger alert-dismissible">'+obj.message+'</div>');
			}
		},
		error: function() {
			alert("failure");
		}
	}); 
}