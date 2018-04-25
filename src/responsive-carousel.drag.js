/*
 * responsive-carousel touch drag transition
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {

	var pluginName = "carousel",
		initSelector = "." + pluginName,
		activeClass = pluginName + "-active",
		itemClass = pluginName + "-item",
		dragThreshold = function( deltaX ){
			return Math.abs( deltaX ) > 4;
		},
		getActiveSlides = function( $carousel, deltaX ){
			var $from = $carousel.find( "." + pluginName + "-active" ),
				activeNum = $from.prevAll().length + 1,
				forward = deltaX < 0,
				nextNum = activeNum + (forward ? 1 : -1),
				$to = $carousel.find( "." + itemClass ).eq( nextNum - 1 );

			if( !$to.length ){
				$to = $carousel.find( "." + itemClass )[ forward ? "first" : "last" ]();
			}

			return [ $from, $to, nextNum-1 ];
		};

	var endEvent = navigator.userAgent.indexOf( "AppleWebKit" ) ? "webkitTransitionEnd" : "transitionEnd";

	// Touch handling
	$( document )
		.bind( pluginName + ".dragmove", function( e, data ){
			if( !!data && !dragThreshold( data.deltaX ) ){
				return;
			}

			if( $( e.target ).attr( "data-transition" ) === "slide" ){
				var activeSlides = getActiveSlides( $( e.target ), data.deltaX );
				var $left = activeSlides[ 0 ];
				var $right = activeSlides[ 1 ];

				// remove any transition classes in case drag happened in the middle
				// of another transition and prevent any other transitions while dragging
				// also unbind transition end events from the main component to prevent
				// class application and other behavior from applying after the drag ends
				$left.add($right)
					.removeClass("carousel-in carousel-out")
					.addClass("no-transition")
					.unbind(endEvent);

				$left.css( "left", data.deltaX + "px" );
				$right.css( "left", data.deltaX < 0 ? data.w + data.deltaX + "px" : -data.w + data.deltaX + "px" );
			}
		})
		.bind( pluginName + ".dragend", function( e, data ){
			if( !!data && !dragThreshold( data.deltaX ) ){
				return;
			}

			var activeSlides = getActiveSlides( $( e.target ), data.deltaX ),
					newSlide = Math.abs( data.deltaX ) > 45;

			// use the absolute position from the left of the "from" slide to determine where
			// thing should end up
			newSlide = Math.abs(parseFloat(activeSlides[0].css("left").replace("px", ""))) > 45;

			var $left = activeSlides[ 0 ];
			var $right = activeSlides[ 1 ];

			// add the fast transition class to make transitions out of a drag quick
			$left.addClass("fast");
			$right.addClass("fast");

			// remove any no-transition class
			$left.removeClass("no-transition");
			$right.removeClass("no-transition");

			if( $( e.target ).attr( "data-transition" ) === "slide" ){
				$( e.target ).one( endEvent, function(){

					// add no transition to the slide that's going out and
					// needs to move back to the stack
					var $out = (newSlide ? $left : $right);
					$out.addClass("no-transition");
					setTimeout(function(){
						$out.removeClass("no-transition");
					}, 20);

					$left.add( $right ).css( "left", "" );
					$( e.target ).trigger( "goto." + pluginName, newSlide ? $right : $left );

					// remove the fast transition class so that other transitions can be slow
					$left.removeClass("fast");
					$right.removeClass("fast");

					// do the post transition cleanup to make sure that the state in the component
					if( newSlide ) {
						$left
							.closest(".carousel")
							.carousel("_postTransitionCleanup", $left, $right);
					} else {
						$left
							.closest(".carousel")
							.carousel("_postTransitionCleanup", $left, $right);
					}
				});

				(newSlide ? $left : $right)
					.removeClass( activeClass )
					.css( "left", data.deltaX > 0 ? data.w	+ "px" : -data.w	+ "px" );

				(newSlide ? $right : $left)
					.addClass( activeClass )
					.css( "left", 0);
			} else if( newSlide ){
				$( e.target )[ pluginName ]( data.deltaX > 0 ? "prev" : "next" );
			}
		});

}(jQuery));
