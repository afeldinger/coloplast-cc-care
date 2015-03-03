
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


			$(this).filter(':has(a)')
			.hover(function() {
				$(this).addClass('over');
			}, function() {
				$(this).removeClass('over');
			}).click(function() {
				//alert($(this).find('a.more-link').attr('href'));
			})
			.find('.elm-content').clone().removeClass('elm-content').addClass('elm-content-over').appendTo(this);

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



});

