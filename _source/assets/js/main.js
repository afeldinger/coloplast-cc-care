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
			}).filter(':has(a.more-link)').find('.elm-content').clone().removeClass('elm-content').addClass('elm-content-over').appendTo(this);

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


$(document).ready(function() {

	grid_list_init();

	// init flexsliders on page
	$('.flexslider').flexslider({
		animation: 'slide',
		slideshow: false,
	});

	// set hover classes in navigation
	$('#primary-nav')
		.find('li').hover(
			function() {
				$(this).addClass('over');
			},
			function() {
				$(this).removeClass('over');
			}
		)
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

	// manages form submission and confirmation display
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
			function() {
				console.log('form submitted');
				frm.hide().next('.form-confirmation').show();
			}
		);

		//console.log(action);
		//

	});


    $('select:visible').dropkick({
        mobile: true,
        menuSpeed: 'fast',
        initialize: function() {
            var $select = $(this.data.elem);
            var widestOptionWidth = 0;
            var togglerWidth = 45 + 50 + 10;
            togglerWidth = 70;
            var origWidth = $select.parents('.selectbox').width();

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


    // Handle lightbox links

	var usage_msg = '<h2>Usage instructions</h2><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>';


	$('a[href="#signup-form-overlay"], a[href="#form-order-sample-overlay"]').magnificPopup();
	$('a[href*="vimeo.com"], a[href*="youtube.com"]').magnificPopup({
		type: 'iframe',

		iframe: {
			markup: '<div class="mfp-iframe-scaler">'+
				'<div class="mfp-close"></div>'+
				'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
				'<div class="mfp-messagetrigger"></div>' +
				'<div class="mfp-message"></div>'+
				'</div>'
		},
			callbacks: {
				markupParse: function(template, values, item) {
					values.messagetrigger = '<span class="icon icon-info"></span>Usage instructions';
					values.message = usage_msg;
				}
		}

	});

});


})();