var base_url = window.location.origin;
var host = window.location.host;
//alert(host);
var website_url = base_url+'/';
if(host == 'localhost')
{
	website_url = base_url+'/grocery/demo/'
}

function add_to_cart(product_id, parentElement, from='', action='')
{
	//alert(product_id);
	if(from != 'detailpg')
	{
		$('#'+parentElement).find('.add-to-cart-btn').hide();
		$('#'+parentElement).find('.qtyboxhome').show();
	}
	var other_price_id = $('#'+parentElement).find('.selected_price_id').val();
	//alert(other_price_id);
	var qty = $('#'+parentElement).find('input.qty').val();
	
	if(from == 'qtybtn')
	{
		if(action == '+')
		{
			qty = parseInt(qty)+1;
			
			var msgtxt = 'Product has been added Successfully. Continue Shopping';
			
		}
		else
		{
			qty = parseInt(qty)-1;
			var msgtxt = 'Product Qty Updated Successfully, Continue Shoping';
		}	
	}
	
	//alert(qty);
	$.ajax({
		type: "POST",
		url: website_url+'home/add_to_cart',
		data: {product_id:product_id, qty:qty, other_price_id:other_price_id},
		dataType:'json',
		success: function(response) {
			var obj = response;
			
			if(obj.responce == true)
			{
				$(".price_"+product_id).html(obj.cart_product_price);
				$(".mrp_"+product_id).html(obj.cart_product_mrp);
				
				$(".httcartitem").html(obj.total_cart_items);
				$(".ttlcartamt").html(obj.total_cart_amount);
				$(".cartbtns").show();
				$(".usercartItems").html(obj.cart_data);
				
				if(obj.removed == '1')
				{
					if(from != 'detailpg')
					{
						$('#'+parentElement).find('.add-to-cart-btn').show();
						$('#'+parentElement).find('.qtyboxhome').hide();
					}
				}
				else
				{
					sweetalert_msg('success', '', msgtxt);
				}
				//addtocartAnimation($(".minicart-contain"), $('#'+parentElement).parent().parent());
			}
			else
			{
				sweetalert_msg('error', 'Error!', 'Something is went wrong, please try after some time');
			}
		},
		error: function() {
			alert("failure");
		}
	}); 
}

function addtocartAnimation(cart, imgtodrag)
{
	//alert(imgtodrag.attr('id'));
	if (imgtodrag) {
		var imgclone = imgtodrag.clone()
			.offset({
			top: imgtodrag.offset().top,
			left: imgtodrag.offset().left
		})
			.css({
			'opacity': '0.5',
			'position': 'absolute'
		})
			.appendTo($('body'))
			.animate({
			'top': cart.offset().top + 10,
				'left': cart.offset().left + 10,
				'width': 75,
				'height': 75
		}, 2000, 'easeInOutExpo');
		
		setTimeout(function () {
			cart.effect("shake", {
				times: 2
			}, 200);
			$(".fdetails:eq(2)").effect("shake", {
				times: 2
			}, 200);
			$("#bookNow").effect("shake", {
				times: 2
			}, 200);
			$(".mrpicesec").effect("shake", {
				times: 2
			}, 200);
		}, 2500);

		imgclone.animate({
			'width': 0,
				'height': 0
		}, function () {
			$(this).detach()
		});
		
	}
}


$(".other_price_id").change(function(){
	//alert($(this).val());
	var selectedId = $(this).val();
	$(this).parent().parent().parent().parent().find('.selected_price_id').val(selectedId);
});

function remove_cart_item(cartId, productId, pg='')
{
	$.ajax({
		type: "POST",
		url: website_url+'home/remove_from_cart/'+cartId,
		dataType:'json',
		success: function(response) {
			var obj = response;
			if(obj.status == '1')
			{
				$(".cart_"+cartId).remove();
				
				$(".httcartitem").html(obj.total_cart_items);
				$(".ttlcartamt").html(obj.total_cart_amount);
				$(".cartbtns").show();
				$(".usercartItems").html(obj.cart_data);
				
				sweetalert_msg('success', '', 'Product removed from cart');
				if(pg == 'viewcart')
				{
					location.reload();
				}
			}
			else
			{
				sweetalert_msg('error', 'Error!', 'Something is went wrong, please try after some time');
			}
		},
		error: function() {
			alert("failure");
		}
	});
}

function sweetalert_msg(type, title, message)
{
	swal(title, message, type)
}


$("#addressfrm").validate({
   rules: {
		name: "required",
		mobile: "required",
		ward: "required",
		house_num: "required",
		address: "required",
		postal_code: "required"
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
			url: website_url+'home/save_address',
			data: $('#addressfrm').serialize(),
			success: function(response) {
				var obj = $.parseJSON(response);
				if(obj.responce == true)
				{
					if($("#address_pg").val() != 'dashbaord')
					{
						window.location.href = website_url+'home/checkout/2';
					}
					else
					{
						location.reload();
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

$(".selected_slot").change(function(){
	if($(this).prop('checked', true))
	{
		var date = $(this).attr('rel');
		$("#delevery_date").val(date);
	}
});

$("#deleveyoptfrm").validate({
   rules: {
		selected_slot: "required",
	},    
	submitHandler: function()
	{
		$.ajax({
			type: "POST",
			url: website_url+'home/save_deleveryoption',
			data: $('#deleveyoptfrm').serialize(),
			success: function(response) {
				var obj = $.parseJSON(response);
				if(obj.responce == true)
				{
					window.location.href = website_url+'home/checkout/3';
					
				}
				else
				{
					sweetalert_msg('error', 'Error!', 'Something is went wrong, please try after some time');
				}
			},
			error: function() {
				alert("failure");
			}
		}); 
	}     
});

$(".seladdress").change(function(){
	if($(this).prop('checked', true))
	{
		var addressid = $(this).val();
		var ward_socityId = $(this).attr('rel');
		$("#address_id").val(addressid);
		$("#ward_area_id").val(ward_socityId);
	}
});

$(".addnewaddress").click(function(){
	$("#addressfieldbox").toggle();
});

$(".checkoutchangelink").click(function(){
	var type = $(this).attr('rel');
	if(type == 'address')
	{
		window.location.href = website_url+'home/checkout';
	}
	if(type == 'datetime')
	{
		window.location.href = website_url+'home/checkout/2';
	}
});

/* $(document).mouseup(function(e) 
{
    var container = $("#homesearchedres");

    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        container.hide();
    }
}); */

$(document).on("click", function(event){
	var $trigger = $(".homesearchbox");
	var tagetElement = event.target;
	//console.log(event.target);
	//console.log($(tagetElement).hasClass('confirm'));
	//console.log();
	if($trigger !== event.target && !$trigger.has(event.target).length && !$(tagetElement).hasClass('confirm') && !$(event.target).closest( ".showSweetAlert" ).length){
		$(".homesearchbox").slideUp("fast");
	}            
});

$(".homesearchinput").keyup(function(){
	var keyword = $(this).val();
	console.log(keyword);
	$.ajax({
		type: "POST",
		url: website_url+'home/searchProducts',
		data: {keyword:keyword},
		dataType:'html',
		success: function(response) {
			$(".homesearchbox").show();
			$(".homesearchbox").html(response);
		},
		error: function() {
			alert("failure");
		}
	}); 
});

$(".reeem_rewards").click(function(){
	var user_id = $("#loggedin_user_id").val();
	$.ajax({
		type: "POST",
		url: website_url+'api/shift',
		data: {user_id:user_id},
		dataType:'json',
		success: function(response) {
			if(response.wallet_amount[0].rewards == '0')
			{
				sweetalert_msg('error', 'Sorry!', "you don't have any rewards points in your account");
			}
			else
			{
				sweetalert_msg('success', '', 'Your points converted to amount and added to your wallet, please check your wallet.');
				$('.reeem_rewards').hide();
				$(".ttlrepoints").html(0);
			}
		},
		error: function() {
			alert("failure");
		}
	}); 
});

function apply_coupon(){
	var coupon_code = $("#copon_code").val();
	var payable_amount = $("#cart_subtotal_amt").val();
	$.ajax({
		type: "POST",
		url: website_url+'api/get_coupons',
		data: {coupon_code:coupon_code,payable_amount:payable_amount},
		dataType:'json',
		success: function(data) {
			if(data.responce == true)
			{
				var delevey_charge = $("#delevey_charge").val();
				$("#applied_coupon_code").val(coupon_code);
				$("#cart_amount_after_discount").val(data.Total_amount);
				var discountAmt = parseFloat(data.coupon_value);
				$("#discounted_amount").val(data.coupon_value);
				
				var cartTotalAmt = parseFloat(data.Total_amount) + parseFloat(delevey_charge);
				$("#cart_total_amt").val(cartTotalAmt);
				$("#all_total_amount").html(cartTotalAmt.toFixed(2));
				alert(discountAmt);
				$("#discountamt").html(discountAmt.toFixed(2));
				
				sweetalert_msg('success', '', 'Coupon Applied Successfully');
			}
			else
			{
				sweetalert_msg('error', 'Sorry!', data.msg);
			}
		},
		error: function() {
			alert("failure");
		}
	}); 
}

// Custom JS - 19052020 - Dinesh
$(document).ready(function(){
	

	// Hiding Logos
	$('.fssai').delay(20000).hide(0);
	$('.appStore').delay(60000).hide(0);

	// Side Div
	$(".salesOffer_btn").click(function () {
		var options = { direction: "right" };
		var duration = 1000;

		$('.salesOffer').toggle(options, duration);
	});
	
	// Slick-Slide
    $(".slick-5").slick({
        slidesToShow: 5,
        infinite: true,
        speed: 500,
        responsive: [
            {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '1rem',
                slidesToShow: 3
            }
            },
            {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
            }
            }
        ]
	});
	
    $(".slick-4").slick({
        slidesToShow: 4,
        infinite: true,
        speed: 500,
        responsive: [
            {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 3
            }
            },
            {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
            }
            }
        ]
	});

    $(".slick-3").slick({
        slidesToShow: 3,
        infinite: true,
        speed: 500,
        responsive: [
            {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 3
            }
            },
            {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
            }
            }
        ]
	});

	// Health Benefit
	$(".hw-benefit").slick({
		dots: true,
        slidesToShow: 2,
        infinite: true,
        speed: 500,
		autoplay: true,
		autoplaySpeed: 2000,
        responsive: [
            {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 2
            }
            },
            {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
            }
            }
        ]
	});

	// Fitness Slot
	$(".hw-fitness").slick({
		dots: true,
        slidesToShow: 3,
        infinite: true,
        speed: 500,
		autoplay: true,
		autoplaySpeed: 2000,
        responsive: [
            {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 2
            }
            },
            {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
            }
            }
        ]
	});

	// Customer Speak
	$(".hw-custspeak").slick({
		dots: true,
        slidesToShow: 2,
        infinite: true,
        speed: 500,
		// autoplay: true,
		// autoplaySpeed: 2000,
        responsive: [
            {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 2
            }
            },
            {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
            }
            }
        ]
	});

	// Trainers Speak
	$(".hw-trainers").slick({
		dots: true,
        slidesToShow: 5,
        infinite: true,
        speed: 500,
		// autoplay: true,
		// autoplaySpeed: 2000,
        responsive: [
            {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 2
            }
            },
            {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
            }
            }
        ]
	});

	// Slick-Slide Center
	$(".events-banner").slick({
		dots: true,
		centerMode: true,
        slidesToShow: 2,
        infinite: true,
        speed: 500,
		autoplay: true,
		autoplaySpeed: 2000,
        responsive: [
            {
            breakpoint: 768,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 2
            }
            },
            {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
            }
            }
        ]
	});
	
	// Love and Share
	$('.lv-banner').slick({
		dots: true,
		infinite: true,
		speed: 500,
		autoplay: true,
		autoplaySpeed: 2000,
		fade: true,
		cssEase: 'linear'
	});

	// Display Product 
	$('.pro-display').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		fade: true,
		asNavFor: '.slider-nav'
	});
	$('.slider-nav').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		asNavFor: '.pro-display',
		dots: true,
		centerMode: true,
		focusOnSelect: true
	});
	
	// Sticky Navbar
	window.onscroll = function() {
		stickyFunction();
	};

	let navbar = document.getElementById("navbar");
	let sticky = navbar.offsetTop;

	function stickyFunction() {
		if (window.pageYOffset >= sticky) {
			navbar.classList.add("sticky");
		} else {
			navbar.classList.remove("sticky");
		}
	}
});