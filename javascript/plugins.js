/*
 * pageAnimation Function
 * Event handlers for each page so the elements fadeIn/fadeOut appropriately.
 * Call pageAnimation.createEvents() to initiate page animations on scroll.
 */
var pageAnimation = (function(w, d, pub){
	var siteNav = $("#siteNav");
	var nameHeader = $("#nameHeader");

	pub.createEvents = function(){
		indexPage();
		skillsPage();
		contactPage();

		$("#contactPage [name='tel']").mask('(000) 000-0000');
		$("#contactPage form").submit(contactFormSubmit);
	}
	pub.navScroll = function(){
		$(".js-navLink").click(function(e){
			e.preventDefault();
			var id = $(this).attr('href');
			$('html, body').animate({
			    scrollTop: $(id).offset().top
			}, 1000);
		});
	}
	indexPage = function(){
		$("#indexPage").fracs(function(data){
			if($(w).width() > 776){
				if(data.visible > .50 && siteNav.hasClass('contact')){
					siteNav.removeClass();
					nameHeader.removeClass();
					nameHeader.addClass('rotateElement');
				}

				var fade = data.visible;
					fade = (fade != 1) ? fade * .75 : 1;
					fade = (fade <= .15) ? 0 : fade,
					yuriah = $("#yuriah");

				yuriah.css('opacity',fade);
				$("#addToTimelineMsg").css('opacity',fade);

				// Hide the Picture from the DOM so it doesn't overlay text on additional page(s)
				if(fade == 0 && yuriah.is(':visible')){
					yuriah.hide();
				}else if(fade > 0 && !yuriah.is(':visible')){
					yuriah.show();
				}
			}
		});
		$("#indexPageAdditional").fracs(function(data){
			if($(w).width() > 776){
				if(data.visible > .50 && (siteNav.hasClass('contact') || siteNav.hasClass('skills'))){
					siteNav.removeClass();
					nameHeader.removeClass();
					nameHeader.addClass('rotateElement');
				}

				$("#summary").css('opacity',data.visible);
			}
		});
	}
	skillsPage = function(){
		$("#skillsPage").fracs(function(data){
			if($(w).width() > 776){
				if(data.visible > .50 && !siteNav.hasClass('skills')){
					siteNav.removeClass();
					siteNav.addClass('skills');
					nameHeader.removeClass();
					nameHeader.addClass('skills rotateElement');
				}

				$("#skillsBlock").css('opacity',data.visible);
			}

			if(data.visible >= .75){
				loadSkillFiller();
			}

			if(data.visible < .25){
				resetSkillFiller();
			}
		});
	}
	loadSkillFiller = function(){
		$(".skillBar").each(function(){
			var num 		= parseInt($(this).find('.fill').attr('data-number')),
				percentage 	= (num / 10) * 100,
				text;

			if(percentage <= 40){
				text = "Beginner";
			}else if(percentage <= 70){
				text = "Skilled";
			}else{
				text = "Expert";
			}

			$(this).find('.text').text(text);
			$(this).find('.fill').css('width', percentage+"%");
		});
	}
	resetSkillFiller = function(){
		$(".skillBar").each(function(){
			$(this).find('.text').text('');
			$(this).find('.fill').css('width','0%');
		});
	}
	contactPage = function(){
		$("#contactPage").fracs(function(data){
			if($(w).width() > 776){
				if(data.visible > .50 && !siteNav.hasClass('contact')){
					siteNav.removeClass();
					siteNav.addClass('contact');
					nameHeader.removeClass();
					nameHeader.addClass('contact rotateElement');
				}

				$("#contactForm").css('opacity',data.visible);
			}
		});
	}
	contactFormSubmit = function(e){
		e.preventDefault();

		// We're going to grab the form data, and if it passes the requirements we'll send it using Mandrill's API
		$("#contactPage form").fadeOut(250, function(){
			$(".simpleLoading").fadeIn(250);
			$("#errorBlock").html(""); // Reset Error Block

			var obj = {
				firstName 	: $.trim($("#contactPage [name='firstName']").val()),
				lastName	: $.trim($("#contactPage [name='lastName']").val()),
				email		: $.trim($("#contactPage [name='email']").val()),
				tel			: $.trim($("#contactPage [name='tel']").val()),
				company		: $.trim($("#contactPage [name='company']").val()),
				note		: $.trim($("#contactPage [name='note']").val())
			};
			obj.company = (obj.company && obj.company != "") ? obj.company : "Company Name Not Provided";
			obj.note 	= (obj.note == "Send a short message describing who you are!") ? "No Message Provided" : obj.note;

			if(obj.firstName && obj.lastName && (obj.email || obj.tel)){
				obj.tel 	= (obj.tel && obj.tel != "") ? obj.tel : "Phone Number Not Provided";
				obj.email 	= (obj.email && obj.email != "") ? obj.email : "E-mail Not Provided";

				var msg = obj.firstName+" "+obj.lastName+" sent you a message via your website! Details are below.<br><br>E-mail: "+obj.email+"<br>Phone Number: "+obj.tel+"<br>Company: "+obj.company+"<br><br>Message:\n"+obj.note;
				$.ajax({
					type: 'POST',
					url: 'https://mandrillapp.com/api/1.0/messages/send.json',
					data: {
						'key': 'kG0YkGBTxB2oocywIV2hBA',
						'message': {
							'from_email': 'no-reply@yuriahsouder.com',
							'to': [
								{
									'email': 'yuriahsouder@gmail.com',
									'name': 'Yuriah Souder',
									'type': 'to'
								}
							],
							'autotext': 'true',
							'subject': 'New Message From Website Contact Form',
							'html': msg
						}
					}
				}).done(function(response) {
					$("#contactForm").append('<div id="successBlock"><p>Message Sent Successfully!</p></div>');

					$("#contactPage .simpleLoading").fadeOut(250, function(){
						$("#contactPage #successBlock").fadeIn(250);
					});
				});
			}else{
				// A field is missing, let them know
				$("#errorBlock").html("<p>A field is missing!<br>You must provide your name and either your e-mail or phone number.</p>");
				$("#errorBlock").show();

				$("#contactPage .simpleLoading").fadeOut(250, function(){
					$("#contactPage form").fadeIn(250);
				});
			}
		});
	}

	return pub;
})(window, document, {});