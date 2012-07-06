/*
 * responsive-carousel autoplay extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {

	var pluginName = "carousel",
		initSelector = "." + pluginName,
		noTrans = pluginName + "-no-transition",
		autoPlayMethods = {
			timer: null,
			play: function(){
				console.log(this)
			},
			pause: function(){

			},
			_initAutoPlay: function(){
				if( $( this ).attr( "data-autoplay") ){
					$( this )[ pluginName ]( "play" );
				}
			}

		};

	// add methods
	$.extend( $.fn[ pluginName ].prototype, autoPlayMethods );

	// DOM-ready auto-init
	$( initSelector ).live( "create." + pluginName, function(){
		$( this )[ pluginName ]( "_initAutoPlay" );
	} );

}(jQuery));