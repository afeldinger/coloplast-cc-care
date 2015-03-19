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



$(document).ready(function() {
/*
	lastDeviceState = getDeviceState();
	$(window).smartresize(function() {
	    var state = getDeviceState();
	    if(state !== lastDeviceState) {
	        // Save the new state as current and announce change
	        lastDeviceState = state;
	        state_indicator_change(state);
	    }
	});
*/

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
	});

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

	$('a[href="#signup-form-overlay"], a[href="#form-order-sample-overlay"]').magnificPopup({
		type:'inline', 
	});

});

