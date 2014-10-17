/*
 * responsive-carousel autoplay extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function( $, undefined ) {
	var pluginName = "carousel",
		interval = 4000,
		autoPlayMethods = {
			play: function(){
				var $self = $( this ),
					intAttr = $self.attr( "data-interval" ),
					thisInt = parseFloat( intAttr ) || interval;
				return $self.data(
					"timer",
					setInterval( function(){
						$self[ pluginName ]( "next" );
					},
					thisInt )
				);
			},

			stop: function(){
				clearTimeout( $( this ).data( "timer" ) );
			},

			_bindStopListener: function(){
				return $(this).bind( "mousedown", function(){
					$( this )[ pluginName ]( "stop" );
				} );
			},

			_initAutoPlay: function(){
				var autoplayAttr = $( this ).attr( "data-autoplay" ),
					autoplay = (typeof autoplayAttr !== "undefined" &&
								autoplayAttr.toLowerCase() !== "false");
				if( autoplay ){
					$( this )
						[ pluginName ]( "_bindStopListener" )
						[ pluginName ]( "play" );
				}
			}
		};

	// add methods
	$.extend( $.fn[ pluginName ].prototype, autoPlayMethods );

	// DOM-ready auto-init
	$( document ).bind(  "create." + pluginName, function( e ){
		$( e.target )[ pluginName ]( "_initAutoPlay" );
	});

}(jQuery));
