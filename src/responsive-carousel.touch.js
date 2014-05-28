/*
 * responsive-carousel touch drag extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {

	var pluginName = "carousel",
		initSelector = "." + pluginName,
		noTrans = pluginName + "-no-transition",
		// UA is needed to determine whether to return true or false during touchmove (only iOS handles true gracefully)
		iOS = /iPhone|iPad|iPod/.test( navigator.platform ) && navigator.userAgent.indexOf( "AppleWebKit" ) > -1,
		touchMethods = {
			_dragBehavior: function(){
				var $self = $( this ),
					origin,
					data = {},
					xPerc,
					yPerc,
					stopMove,
					setData = function( e ){

						var touches = e.touches || e.originalEvent.touches,
							$elem = $( e.target ).closest( initSelector );

						if( e.type === "touchstart" ){
							origin = {
								x : touches[ 0 ].pageX,
								y: touches[ 0 ].pageY
							};
						}
						stopMove = false;
						if( touches[ 0 ] && touches[ 0 ].pageX ){
							data.touches = touches;
							data.deltaX = touches[ 0 ].pageX - origin.x;
							data.deltaY = touches[ 0 ].pageY - origin.y;
							data.w = $elem.width();
							data.h = $elem.height();
							data.xPercent = data.deltaX / data.w;
							data.yPercent = data.deltaY / data.h;
							data.srcEvent = e;
						}

					},
					emitEvents = function( e ){
						setData( e );
						if( data.touches.length === 1 ){
							$( e.target ).closest( initSelector ).trigger( pluginName + ".drag" + e.type.split( "touch" )[ 1 ], data );
						}
					};

				$( this )
					.bind( "touchstart", function( e ){
						$( this ).addClass( noTrans );
						emitEvents( e );
					} )
					.bind( "touchmove", function( e ){
						if( Math.abs( data.deltaX ) > 10 ){
							e.preventDefault();
						}
						else if( Math.abs( data.deltaY ) > 3 ){
							stopMove = true;
						}
						if( !stopMove ){
							setData( e );
							emitEvents( e );
						}
					} )
					.bind( "touchend", function( e ){
						$( this ).removeClass( noTrans );
						emitEvents( e );
					} );


			}
		};

	// add methods
	$.extend( $.fn[ pluginName ].prototype, touchMethods );

	// DOM-ready auto-init
	$( document ).bind( "create." + pluginName, function( e ){
		$( e.target )[ pluginName ]( "_dragBehavior" );
	} );

}(jQuery));
