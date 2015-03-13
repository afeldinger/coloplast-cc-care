
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

function grid_list_sort() {
	$('.grid-list .list-items').each(function() {
		var pos = 0;
		$(this).find('li').each(function() {

			//$(this).data('position', i);
			var cols = 1;

			if ($(this).data('type') === 'video') {
				cols = 2;


			}


			if (pos === 2) {
				pos = 0;
			} else {
				pos+= cols;
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
	//grid_list_sort();
}



$(document).ready(function() {

	lastDeviceState = getDeviceState();
	$(window).smartresize(function() {
	    var state = getDeviceState();
	    if(state !== lastDeviceState) {
	        // Save the new state as current and announce change
	        lastDeviceState = state;
	        state_indicator_change(state);
	    }
	});

	grid_list_init();

	$('.flexslider').flexslider({
		animation: 'slide',
		//animationLoop: false,
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
//		.clone().removeClass('primary').addClass('primary-small').appendTo($('#page-header .content-wrapper'))
	;
	$('.nav-btn a').click(function(e) {
		e.preventDefault();
		$(this).add($('#primary-nav')).toggleClass('active');
	});

	$('.filters').each(function() {
		
		var targets = $(this).siblings('ul').find('li');

		$(this).find('#show-categories').change(function() {
			$(this).parents('fieldset:first').toggleClass('active', $(this).prop('checked'));
		});

		$(this).find('input[name^="filter"]').change(function() {

			var filters = new Array();
			var targets_filtered = targets;
			$('input[name^="filter"]:checked').each(function() {
				//filters[this.name][filters[this.name].length] = '.' + this.name + '--' + this.value;
				targets_filtered = targets_filtered.filter()
			});

			for(var k in filters) {
				alert(k + ': ' + filters[k]);
			}
		});
		

/*
		$(this).find('input[name="categories"]').change(function() {
			var targets = $(this).parents('.filters:first').siblings('ul').find('li');
			var categories = $('input[name="categories"]:checked').map(function () {
				return '.filter--category--' + this.value;
			}).get().join(', ');

			if (categories === '') {
				targets.show();
			} else {
				targets.hide().filter(categories).show();
			}

		});
*/
	});

});

