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


			$(this).filter(':has(a.more-link)')
			.hover(function() {
				$(this).addClass('over');
			}, function() {
				$(this).removeClass('over');
			}).click(function(e) {
				e.stopPropagation();
				location.href = $(this).find('a.more-link').attr('href');
			}).find('.elm-content').clone().removeClass('elm-content').addClass('elm-content-over').appendTo(this);

		});
	});


	$('.filters').each(function() {
		
		var targets = $(this).siblings('ul').find('li');

		// toggle category list on and off
		$(this).find('#show-categories').change(function() {
			$(this).parents('.filters').toggleClass('show-categories', $(this).prop('checked'));
		});

		$(this).find('#category-reset').click(function(e) {
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

			targets.hide().removeClass('last').filter(function() {
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
		
	});
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

	$('.flexslider').flexslider({
		animation: 'slide',
		slideshow: false,
	});

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
	$('.nav-btn a').click(function(e) {
		e.preventDefault();
		$(this).add($('#primary-nav')).toggleClass('active');
	});


	$("input[type=radio], input[type=checkbox]").each(function() {

		// set state on load
		$(this).parents("label").toggleClass("checked", $(this).is(":checked"));

		$(this).on('change', function() {

	        var fld_name = $(this).attr("name");
            $("input[name=" + fld_name + "]").add(this).each(function() {
                $(this).parents("label").toggleClass("checked", $(this).is(":checked"));
            });
		});
	});

});

