

var cc = (function(){
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



	/**
	 *	Utility functions
	 **/


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


	/**
	 *	Document event handlers
	 */

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


	var ccResizeListener = debounce(function() {
		$('.article-full.type-article .article-header').css('min-height', $(window).height() - $('#page-header').height());
		/*
	    var state = getDeviceState();
	    if(state !== lastDeviceState) {
	        // Save the new state as current and announce change
	        lastDeviceState = state;
	        state_indicator_change(state);
	    }
	    */
	}, 100);
	window.addEventListener('resize', ccResizeListener);
	ccResizeListener();


	/**
	 *	String left padding function
	 */
	function leftPad(i,l,s) {
		var o = i.toString();
		if (!s) { s = '0'; }
		while (o.length < l) {
			o = s + o;
		}
		return o;
	}

	/*
	// Detect image contrast level. Disabled due to CORS-issues :(
	function getImageLightness(imageSrc, callback, target) {
	    var img = document.createElement('img');
	    img.src = imageSrc;
	    img.crossOrigin = 'Anonymous';
	    img.style.display = 'none';
	    document.body.appendChild(img, callback);

	    var colorSum = 0;

	    img.onload = function() {
	        // create canvas
	        var canvas = document.createElement('canvas');
	        canvas.width = this.width;
	        canvas.height = this.height;

	        var ctx = canvas.getContext('2d');
	        ctx.drawImage(this,0,0);

	        var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
	        var data = imageData.data;
	        var r,g,b,avg;

	        for(var x = 0, len = data.length; x < len; x+=4) {
	            r = data[x];
	            g = data[x+1];
	            b = data[x+2];

	            avg = Math.floor((r+g+b)/3);
	            colorSum += avg;
	        }

	        var brightness = Math.floor(colorSum / (this.width*this.height));
	        callback(brightness, target);
	    };
	}
	*/


	/**
	 *	Sort grid list items
	 */
	function grid_list_sort() {

		$('.grid-list .list-items').each(function() {
			var pos = 0, i, n;

			var items = $(this).find('li');
			var active = items.filter(':visible');
			var sgl = active.not('.type-video');
			var dbl = active.filter('.type-video');
			

			items.hide();

			var use_single_col = false;
			if (
				(dbl.length === 0) || // no double-col items
				(active.length <= 3 && dbl.length > 0) || // only single row of items, but includes double-col item(s)
				(dbl.length > active.length/2) // too many double-col items
				
			) {
				use_single_col = true;
			}

			// set container layout class
			$(this).toggleClass('single-col', use_single_col);

			// clean up old view 
			items.removeClass('last pos-1 pos-2 pos-3');

			if (use_single_col) {
				active.each(function(i) {
					pos = (i % 3) + 1;
					$(this).addClass('pos-'+pos);
					$(this).toggleClass('last', pos===3);
				});
			} else {

				var total_rows = Math.ceil(sgl.length + 2 * dbl.length) / 3;
				var allowed_single_rows = Math.floor((sgl.length - dbl.length) / 3);

				var sgl_items = sgl.get();
				var dbl_items = dbl.get();
				var mixed_rows = 0;

				for (i = 0; i < total_rows; i++) {
					var row = [];

					// if single rows available
					if ((i % 2 === 0 && allowed_single_rows > 0) || dbl_items.length === 0) {
						allowed_single_rows--;
						for (n = 0; n < 3; n++) {
							if (sgl_items.length > 0) {
								row.push(sgl_items.shift());
							}
						}
					} 
					// mixed row
					else {
						if (sgl_items.length > 0) {
							row.push(sgl_items.shift());
						}

						if (dbl_items.length > 0) {
							if (mixed_rows % 2 === 0) {
								row.push(dbl_items.shift());
							} else {
								row.unshift(dbl_items.shift());
							}
						}

						mixed_rows++;
					}

					// append to document in new order and set positioning classes
					pos = 1;
					for (n = 0; n < row.length; n++) {
						$(this).append($(row[n]).addClass('pos-'+pos).toggleClass('last', pos===row.length));
						pos += $(row[n]).is('.type-video')? 2 : 1;
					}
				}
			}

			active.show();
		});

	}

	/**
	 *	Initialize grid list views
	 */
	function grid_list_init() {

		// Add handlers and hover-specific content
		$('.grid-list .list-items').each(function() {
			$(this).find('li').each(function(i) {
				$(this).data('position', i);


				$(this).filter(':has(a)')
				.hover(function() {
					$(this).addClass('over');
				}, function() {
					$(this).removeClass('over');
				}).click(function() {
					$(this).find('a').filter(':last')[0].click();
				}).filter(':has(a.more-link)').each(function() {
					//$(this).find('.elm-content').clone().removeClass('elm-content').addClass('elm-content-over').appendTo(this);
					$(this).find('.elm-content-over').remove();
					$(this).find('.elm-content').clone().removeClass('elm-content').addClass('elm-content-over').appendTo(this);
					$(this).find('.elm-image img').clone().addClass('blur').prependTo($(this).find('.elm-content'));
				});

			});
		});
	}

	function grid_filters_init() {
		// Handle filter functionality
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
						if (typeof k === 'string') {
							var filter_str = filters[k].join(',');
							if ($(this).filter(filter_str).length === 0) {
								visible = false;
								break;
							}
						}
					}
					return visible;
				}).show();

				// Re-sort grid list after executing filter
				grid_list_sort();

				// Update filter counts
				var filter_count = 0;
				if (filters['filter--category'] !== undefined) {
					filter_count = filters['filter--category'].length;
				}
				$('#show-categories-count').html((filter_count>0)? '('+filter_count+')' : '');

			});
		}).change();
		
	}

	// Initialize and sort list when DOM is ready
	grid_list_init();
	grid_filters_init();
	grid_list_sort();


	function document_ready() {


	/*
		// Image contrast detection disabled due to CORS-issues
		$('.hero, .article-header').filter(':has(.elm-image img)').each(function() {
			var src = $(this).find('.elm-image img').attr('src');
			getImageLightness(src, function(brightness, target) {
				console.log('lightness', src, brightness, target);
				var threshold = 155;
				target.toggleClass('background-light', (brightness > threshold));
				target.toggleClass('background-dark', (brightness <= threshold));

			}, $(this));
		});
	*/
		

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
					var str = leftPad(i,2);
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
				errorPlacement: function() {
					return true;
				},
				submitHandler: function() {

				},
				/*
				submitHandler: function(form) {
					// Form has .form-confirmation - use jquery.post to submit form and display confirmation

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
				},
				*/
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



			$(this).find('button[type=button]').click(function() {
				var current_step = $(this).closest('.form-step');
				if (current_step.find(':input').valid()) {
					current_step.removeClass('active').next('.form-step').addClass('active').find('select:visible').dropkick(dk_nested);
				}
				
			});
		});


		// Phone number is optional on step 1 of signup forms
		//$('#signup-form-hero, #signup-form-overlay').find(':input[id$="-phone"]').rules('remove');

		$('#signup-form-hero, #signup-form-overlay').find(':input[id$="-phone"]').each(function() {
			$(this).rules('remove');
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

		var dk_init_func = function() {
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
        };

		var dk_defaults = {
	        mobile: true,
	        menuSpeed: 'fast',
	        container: $('#page-header + .content-wrapper:first'),
	        initialize: dk_init_func,
	    };

		var dk_nested = {
	        mobile: true,
	        menuSpeed: 'fast',

	    };
	    

	    $('select:visible').dropkick(dk_defaults);

	    // Embed hero signup form into hero
	    $('#signup-form-hero').appendTo($('.hero:first .content-wrapper'));

	    $('#signup-form-trigger').find('.form-signup-cta:has(a)').click(function() {
	    	$(this).find('a').trigger('click');
	    });


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
				markupParse: function(template, values) {
					values.message = video_msg;
				}
			}

		});

	}



	function fix_image_layout() {
		// temporary image layout fix
		$('.article-full.type-article .main-content').find('img').each(function() {
			var img = $(this);
			if (img.width() > img.height()) {
				img.closest('.elm-image').removeClass('inline-left inline-right').addClass('full-width');
			} else {
				img.closest('.elm-image').removeClass('full-width inline-right').addClass('inline-left');
			}
		});

	}
	function fix_empty_tags() {
		// remove empty tags
		//$('.elm-content').find('h1, h2, h3, h4, p').filter(':empty').remove();		
	}

	// re-process specific tasks after client-side DOM manipulation
	function eloqua_postprocess() {
		// re-sort the grid list
		grid_list_sort();

		// re-attach click- and magnific handler to signup form CTA
		$('a[href="#signup-form-overlay"]').magnificPopup().parents('li.type-cta').click(function() {
			$(this).find('a').filter(':last')[0].click();
		});
	}

	$(document).ready(function() {
		document_ready();
	});

	$(window).load(function() {
		fix_image_layout();
		fix_empty_tags();
	});

	

	return {
		'document_ready': document_ready,
		'grid_list_init': grid_list_init,
		'grid_list_sort': grid_list_sort,
		'elq_complete': eloqua_postprocess,
	};

})();


// global scope grid_list_sort is still present for backwards compatability
function grid_list_sort() {
	cc.grid_list_sort();
}
