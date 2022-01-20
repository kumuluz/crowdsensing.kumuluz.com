$(document).ready(function() {

	$(window).scroll(function() {
    var scroll = $(window).scrollTop();

    if (scroll > 15) {
        $("header").addClass("white");
				if ($("#back-to-top").length) {
					$("#back-to-top").css("opacity","1");
				}
    } else {
        $("header").removeClass("white");
				if ($("#back-to-top").length) {
					$("#back-to-top").css("opacity","0");
				}
    }
	}).scroll();

	var _empty_cases_num = parseInt($(window).width() / 340) + 2;

	for (var i = 0; i < _empty_cases_num; i++) {
		$(".index #smart-cities .container-3").append('<div class="empty_case"></div>');
	}

	var hash = location.hash.replace(/^#/, '');  // ^ means starting, meaning only match the first hash
	if (hash) {

	}

	$("#back-to-top").on("click",function (e) {
		$("html,body").animate({ scrollTop: 0 }, 500, "linear")
	})

	var scrollSpy = new bootstrap.ScrollSpy(document.body, {
	  target: '#ss-nav',
		offset: 200
	})

	$('#ss-nav a')
		.on('click', function(event) {
		    // Make sure this.hash has a value before overriding default behavior
		    if (this.hash !== "") {

		        // Store hash
		        var hash = this.hash;

		        // Using jQuery's animate() method to add smooth page scroll
		        // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
		        // - 70 is the offset/top margin
		        $('html, body').animate({
		            scrollTop: $(hash).offset().top - 150
		        }, 100, "linear", function() {

		            // Add hash (#) to URL when done scrolling (default click behavior), without jumping to hash
		            if (history.pushState) {
		                history.pushState(null, null, hash);
		            } else {
		                window.location.hash = hash;
		            }
		        });
		        return false;
		    } // End if
		});

	$(".current_lang").on("click", function () {
		$(this).parent().toggleClass("open");
	})

	$("form[name='contact-form']").validate({
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      fullName: "required",
      phoneNumber: "required",
      email: {
        required: true,
        // Specify that email should be validated
        // by the built-in "email" rule
        email: true
      },
    },
    // Specify validation error messages
    messages: {
      fullName: "To polje je obvezno",
			phoneNumber: "To polje je obvezno",
      email: "Vpišite veljavem email naslov."
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      form.submit();
    }
  });

	$("form[name='contact-form-en']").validate({
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      fullName: "required",
      phoneNumber: "required",
      email: {
        required: true,
        // Specify that email should be validated
        // by the built-in "email" rule
        email: true
      },
    },
    // Specify validation error messages
    messages: {
      fullName: "Required field",
			phoneNumber: "Required field",
      email: "Enter valid email address"
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      form.submit();
    }
  });

	$(document).on('keydown keyup paste', 'textarea', function(e) {
	  var textArea = $('textarea').val(),
	    textLenght = textArea.length,
	    limit = $('textarea').attr('maxlength'),
	    remain = parseInt(limit - textLenght);
	  $('textarea').next("small").find("span").text(remain);
	});

});
