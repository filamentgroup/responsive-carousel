/*
 * responsive-carousel ajax include extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {
	
	var pluginName = "carousel",
		initSelector = "[data-"+ pluginName +"]",
		getMarginLeft = function( $elem ){
			return $elem[ 0 ].style.cssText.match( /margin\-left:\s*(-?[0-9]+)%/ ) && parseFloat( RegExp.$1 );
		},
		methods = {
			_ajaxUpdate: function(){
				var $contain = $( this ).find( "." + pluginName + "-contain" ),
					currItem = (-getMarginLeft( $contain ) || 0) / 100,
					activeElem = $( this ).find( "." + pluginName + "-item:eq("+ currItem +")" ),
					notrans =  pluginName + "-contain-notrans";
					
				$( this )[ pluginName ]( "update" );
				
				$contain
					.addClass( notrans )
					.css( "margin-left", activeElem.prevAll().length * -100 + "%" );
				
				setTimeout(function(){
					$contain.removeClass( notrans );
				}, 0);
				
			}
		};
			
	// add methods
	$.extend( $.fn[ pluginName ].prototype, methods ); 
	
	// DOM-ready auto-init
	$( initSelector ).live( "ajaxInclude", function(){
		$( this )[ pluginName ]( "_ajaxUpdate" );
	} );
	
	// kick off ajaxIncs at dom ready
	$( function(){
		$( "[data-after],[data-before]", initSelector ).ajaxInclude();
	} );

}(jQuery));