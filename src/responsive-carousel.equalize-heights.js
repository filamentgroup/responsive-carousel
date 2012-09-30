/*
 * responsive-carousel equal height extension for
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Easy Designs LLC
 * Licensed under the MIT, GPL licenses.
 */

(function( $, window, undefined ) {
	var pluginName = "carousel",
		initSelector = "." + pluginName,
		timer_name = pluginName + "-equalize-heights-timer",
		equalizeHeightsMethods = {
			_equalizeHeights: function(){
				var $self = $( this ),
					$items = $self.find( ".carousel-item" ),
					tallest = 0;
					
				$items.each( function(){
					var test = $(this).height();
					if ( test > tallest )
					{
						tallest = test;
					}
				} );

				$items.add( $self )
					.css({
						'min-height':	tallest,
						// older IE
						'_height':		tallest
					});
			},
			
			_initEqualizeHeights: function(){
				var $self = $( this ),
					equal_height = $( this ).attr( "data-carousel-equalize-heights" ),
					timeout;
				
				
				if ( equal_height !== undefined &&
					 equal_height !== false )
				{
					$( this )[ pluginName ]( "_equalizeHeights" );
					
					$( window )
						.on( "resize", function( e ){
							if( timeout ){
								clearTimeout( timeout );
							}
							timeout = setTimeout( function(){
								$self[ pluginName ]( "_equalizeHeights" );
							}, 200 );
						} );
				}
			}
		};
			
	// add methods
	$.extend( $.fn[ pluginName ].prototype, equalizeHeightsMethods ); 
	
	// window load auto-init (so we get images)
	$( window )
		.on( "load", function(){
			$( initSelector )[ pluginName ]( "_initEqualizeHeights" );
		 } );

}(jQuery,window));