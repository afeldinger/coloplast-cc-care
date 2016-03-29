


(function() {

	$('form').each(function() {
		$(this).validate({
			ignore: ':hidden:not([data-dkcacheid]), :disabled',
			highlight: function(element, errorClass, validClass) {
	            if(element.type === 'radio') {
	                $(element.form).find('[name="' + element.name + '"]').each(function(){
	                    var $this = $(this);
	                    $this.addClass(errorClass).removeClass(validClass);
	                    $this.closest('label').addClass('input-' + errorClass);
	                });
	            } else {
					$(element).addClass(errorClass).removeClass(validClass);
					$(element).closest('label').addClass('input-' + errorClass);
	            }

			},
			unhighlight: function(element, errorClass, validClass) {
	            if(element.type === 'radio') {
	                $(element.form).find('[name="' + element.name + '"]').each(function(){
	                    var $this = $(this);
	                    $this.removeClass(errorClass).addClass(validClass);
	                    $this.closest('label').removeClass('input-' + errorClass);
	                });
	            } else {
					$(element).removeClass(errorClass).addClass(validClass);
					$(element).closest('label').removeClass('input-' + errorClass);
				}
			},
			errorPlacement: function() {
				return true;
			},
		});

		// required fields
		var fields = new Array(
			':input[id*="-catheterdate-"]',
			':input[id$="-firstname"]',
			':input[id$="-first-name"]',
			':input[id$="-lastname"]',
			':input[id$="-last-name"]',
			':input[id$="-email"]',
			':input[id*="-gender"]',
			':input[id$="-message"]',
			':input[id="order-sample-phone"]',
			':input[id$="-address1"]',
			':input[id$="-address2"]',
			':input[id$="-address3"]',
			':input[id$="-state"]',
			':input[id$="-city"]',
			':input[id$="-zip"]',
			':input[id$="-po-box"]',
			':input[id$="-province"]',
			':input[id$="-accept-legal"]',
			':input[id$="-organization"]',
			':input[id$="-title"]',
			':input[id$="-terms"]'
		).join(', ');

		$(fields, this).each(function() {
			$(this).rules('add','required');
		});

		// has care receiver field - remove rule for gender
		if ($('#profile-receiver-firstname', this).length) {
			$('input[name="gender"]', this).each(function() {
				$(this).rules('remove');
			});
		}

		$(':input[name*="profile-catheterdate-"]', this).each(function() {
			$(this).rules('remove');
		});


		$(':input#contact-phone').each(function() {
			$(this).rules('remove');
		});



	});

})();