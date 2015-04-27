(function(){

/*
// Create the state-indicator element
var indicator = document.createElement('div');
indicator.className = 'state-indicator';
document.body.appendChild(indicator);

// Create a method which returns device state
function getDeviceState() {
    return window.getComputedStyle(document.querySelector('.state-indicator'), ':before').getPropertyValue('content');
}

var lastDeviceState = getDeviceState();
function state_indicator_change(state) {
	console.log('Window state: ' + state);
}
*/


// detect if legacy browser ( <= IE9) : from http://stackoverflow.com/a/16657946		
var legacy = (function(){
	var undef,rv = 0; // Return value assumes failure.
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf('MSIE ');
	if (msie > 0) {
		// IE 10 or older => return version number
		rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		if (rv >= 10)  {
			rv = undef;
		}
	}
	return ((rv > 0) ? 1 : undef);
}());

if (legacy) {
	$('body').addClass('legacy');
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
			func.apply(context, args);
		}
	};
}

function grid_list_sort() {
	$('.grid-list .list-items').each(function() {
		var pos = 0;
		$(this).find('li').removeClass('last').filter(':visible').each(function() {

			var cols = 1;
			if ($(this).hasClass('type-video')) {
				cols = 2;
			}

			pos+= cols;
			
			if (pos === 3) {
				pos = 0;
				$(this).addClass('last');
			}
		});
	});
}
function grid_list_init() {

	$('.grid-list .list-items').each(function() {
		$(this).find('li').each(function(i) {
			$(this).data('position', i);


			$(this).filter(':has(a)')
			.hover(function() {
				$(this).addClass('over');
			}, function() {
				$(this).removeClass('over');
			}).click(function(e) {
				//e.stopPropagation();
				$(this).find('a').filter(':last')[0].click();
			}).filter(':has(a.more-link)').each(function() {
				//$(this).find('.elm-content').clone().removeClass('elm-content').addClass('elm-content-over').appendTo(this);
				$(this).find('.elm-content-over').remove();
				$(this).find('.elm-content').clone().removeClass('elm-content').addClass('elm-content-over').appendTo(this);
				$(this).find('.elm-image img').clone().addClass('blur').prependTo($(this).find('.elm-content'));
			});

		});
	});


	$('.filters').each(function() {
		
		var targets = $(this).siblings('ul').find('li');

		// toggle category list on and off
		$(this).find('#show-categories').change(function() {
			$(this).parents('.filters').toggleClass('show-categories', $(this).prop('checked'));
		});

		$(this).find('#filter-category-reset').click(function(e) {
			e.preventDefault();
			$(this).parents('.categories:first').find('input[name^="filter"]').prop('checked', false).filter(':first').change();
		});

		// bind filter function to change events
		$(this).find('input[name^="filter"]').change(function() {
			var filters = [];
			$('input[name^="filter"]:checked').each(function() {
				if (filters[this.name] === undefined) {
					filters[this.name] = [];
				}
				filters[this.name].push('.' + this.name + '--' + this.value);
			});

			targets.hide().filter(function() {
				var visible = true;
				for(var k in filters) {
					var filter_str = filters[k].join(',');
					if ($(this).filter(filter_str).length === 0) {
						visible = false;
						break;
					}

				}
				return visible;
			}).show();

			grid_list_sort();

			var filter_count = 0;
			if (filters['filter--category'] !== undefined) {
				filter_count = filters['filter--category'].length;
			}
			$('#show-categories-count').html((filter_count>0)? '('+filter_count+')' : '');

		});
	}).change();
	grid_list_sort();
}

var lastScrollTop = 0;
var ccScrollListener = debounce(function() {
	if (lastScrollTop !== $(window).scrollTop()) {
		lastScrollTop = $(window).scrollTop();

		// Detect page top
		$('body').toggleClass('scroll-top', (lastScrollTop<=0));

		// Detect page bottom
		$('body').toggleClass('scroll-near-bottom', (lastScrollTop + $(window).height() >= $(document).height()-100));

		// Detect page bottom
		$('body').toggleClass('scroll-bottom', (lastScrollTop + $(window).height() === $(document).height()));

	}
	
}, 20);
window.addEventListener('scroll', ccScrollListener);

$('body').addClass('scroll-top');

/*
var ccResizeListener = debounce(function() {
	console.log('resize - ' + lastDeviceState);
    var state = getDeviceState();
    if(state !== lastDeviceState) {
        // Save the new state as current and announce change
        lastDeviceState = state;
        state_indicator_change(state);
    }
}, 250);
window.addEventListener('resize', ccResizeListener);
*/
$.leftPad = function(i,l,s) {
	var o = i.toString();
	if (!s) { s = '0'; }
	while (o.length < l) {
		o = s + o;
	}
	return o;
};

$(document).ready(function() {

	grid_list_init();

	// init flexsliders on page
	$('.flexslider').flexslider({
		animation: 'slide',
		slideshow: false,
	});

	// set hover classes in navigation
	$('#primary-nav')
		.find('ul, li').hover(
			function() {
				$(this).addClass('over');
			},
			function() {
				$(this).removeClass('over');
			}
		)
		.click(function() {
			$(this).toggleClass('expanded');
		})
	;


	// init responsive navigation
	$('.nav-btn a').click(function(e) {
		e.preventDefault();
		$(this).add($('#primary-nav')).toggleClass('active');
	});


	// control checkboxes and radiobuttons
	$('input[type=radio], input[type=checkbox]').each(function() {

		// set state on load
		$(this).parents('label').toggleClass('checked', $(this).is(':checked'));

		$(this).on('change', function() {

	        var fld_name = $(this).attr('name');
            $('input[name=' + fld_name + ']', $(this).parents('form:first')).add(this).each(function() {
                $(this).parents('label').toggleClass('checked', $(this).is(':checked'));
            });
		});
	});

	// control input fields focus/blur state
	$(':input').focus(function() {
		$(this).parents('label').addClass('focus');
	}).blur(function() {
		$(this).parents('label')
			.removeClass('focus')
			.toggleClass('has-value', $(this).val()!=='')
		;
	}).each(function() {
		$(this).parents('label').toggleClass('has-value', $(this).val()!=='');
	});

	$('label').hover(
		function() {
			$(this).addClass('over');
		}, 
		function() {
			$(this).removeClass('over');
		}
	).filter(':has(.icon)').addClass('has-icon');

	$('.date-group').each(function() {
		$('select[id$="year"], select[id$="month"]', this).change(function() {
			var group = $(this).closest('.date-group');
			var year = $('select[id$="year"]', group);
			var month = $('select[id$="month"]', group);
			var day = $('select[id$="day"]', group);

			var date = new Date();
			var curDay = day.val()? parseInt(day.val()) : date.getDate();
			date.setFullYear(
				year.val()? year.val() : date.getFullYear(),
				month.val()? parseInt(month.val()) : date.getMonth()+1,
				0
			);
			var days = date.getDate();
			var dk = day.data('dropkick');


			while(dk.length > 0) {
				dk.remove(dk.length-1);
			}

			dk.appendOpt(new Option(dk.firstOption.text));

			for (var i=1; i<=days; i++) {
				var str = $.leftPad(i,2);
				var opt = new Option(str, str);
				dk.appendOpt(opt);
			}

		});
	});

	// manages form submission and confirmation display
	$('form').each(function() {
		$(this).validate({
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
			errorPlacement: function(error, element) {
				return true;
			},
			submitHandler: function(form) {
				// Form has .form-confirmation - use jquery.post to submit form and display confirmation
				/*
				if ($(this).next('.form-confirmation').length >= 0) {

					var frm = $(form);
					var url = frm.attr('action')? frm.attr('action') : location.href;
					var data = frm.serializeArray();

					//console.log('Form request:', url, data);

					$.post(
						url,
						data,
						function(response, status) {
							//console.log('Form response:', status);
							frm.hide().next('.form-confirmation').show();
						}
					);



				} 
				// No .form-confirmation: default to standard submit handler
				else {
					//console.log('No form confirmation - submit form');
					form.submit();
				}
				*/
			},
		});

		// required fields
		var fields = new Array(
			':input[id$="-firstname"]',
			':input[id$="-first-name"]',
			':input[id$="-lastname"]',
			':input[id$="-last-name"]',
			':input[id$="-email"]',
			':input[id*="-gender"]',
			':input[id$="-message"]',
			':input[id$="-phone"]',
			':input[id$="-address1"]',
			':input[id$="-address2"]',
			':input[id$="-state"]',
			':input[id$="-city"]',
			':input[id$="-zip"]',
			':input[id$="-accept-legal"]'
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
	});
	/*
	$('form').filter(function() {
		return $(this).next('.form-confirmation').length;
	}).submit(function(e) {
		e.preventDefault();

		var frm = $(this);
		var url = $(this).attr('action')? $(this).attr('action') : location.href;
		var data = $(this).serializeArray();

		$.post(
			url,
			data,
			function(response, status) {
				console.log('Form response:', status);
				frm.hide().next('.form-confirmation').show();
			}
		);

		//console.log(action);
		//

	});
*/	

    $('select:visible').dropkick({
        mobile: true,
        menuSpeed: 'fast',
        initialize: function() {
            var $select = $(this.data.elem);
            var widestOptionWidth = 0;
            var togglerWidth = 45 + 50 + 10;
            togglerWidth = 70;
            var origWidth = $select.parents('.selectbox').width();

            this.firstOption = this.data.select.options[0]? this.data.select.options[0] : null;

            $(this.data.select).data('dropkick', this);


            $select.find('.dk-select-options').show().css('width', 'auto').children().each(function(i, option) {
                var optionWidth = $(option).width();

                if (optionWidth > widestOptionWidth) {
                    widestOptionWidth = optionWidth;
                }

            }).removeAttr('style');

            $select.find('.dk-select-options').removeAttr('style');

            if (widestOptionWidth + togglerWidth > origWidth) {
                $select.parent().width(widestOptionWidth + togglerWidth);
            }
        }
    });

    // Embed hero signup form into hero
    $('#signup-form-hero').appendTo($('section.hero:first .content-wrapper'));


    // Handle lightbox links

	$('a[href="#signup-form-overlay"], a[href="#form-order-sample-overlay"]').magnificPopup();


	var video_msg = '<div class="message-trigger"><span class="icon icon-info"></span><span>Important Safety Information</span></div>'+
	'<div class="message"><p><strong>Important Safety Information:</strong>  SpeediCath® catheters are indicated for use by patients with chronic urine retention and patients with a post void residual volume (PVR) due to neurogenic and non-neurogenic voiding dysfunction. The catheter is inserted into the urethra to reach the bladder allowing urine to drain. There is a separate SpeediCath Compact Set device intended for either males or females only.</p><p>SpeediCath catheters are available by prescription only. Patients performing self-catheterization should follow the advice of, and direct questions about use of the product to, their medical professional. Before using the device, carefully read the product labels and information accompanying the device including the instructions for use which contain additional safety information. The SpeediCath catheter is for single-use only; discard it after use. If you experience symptoms of a urinary tract infection, or are unable to pass the catheter into the bladder, contact your healthcare professional. The risk information provided here is not comprehensive. To learn more, talk to your healthcare provider.</p></div>';
	
	$('a[href*="vimeo.com"], a[href*="youtube.com"]').magnificPopup({
		type: 'iframe',

		iframe: {
			markup: '<div class="mfp-iframe-scaler">'+
				'<div class="mfp-close"></div>'+
				'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
				'<div class="mfp-message"></div>'+
				'</div>'
		},
		callbacks: {
			markupParse: function(template, values, item) {
				values.message = video_msg;
			}
		}

	});

});

$(window).load(function() {
	// temporary image layout fix
	$('.article-full.type-article .main-content').find('img').each(function() {
		var img = $(this);
		if (img.width() > img.height()) {
			img.closest('.elm-image').removeClass('inline-left inline-right').addClass('full-width');
		} else {
			img.closest('.elm-image').removeClass('full-width inline-right').addClass('inline-left');
		}
	});

	// remove empty tags
	//$('.elm-content').find('h1, h2, h3, h4, p').filter(':empty').remove();
});


})();