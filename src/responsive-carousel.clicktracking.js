/*
 * responsive-carousel click tracking extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2014 Nara Logics, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function( $, undefined ) {
	var pluginName = "carousel",
		initSelector = "." + pluginName,
		dataAttributeName = "data-click-tracking",
		dataAttributeNameNext = "data-click-tracking-next",
		dataAttributeNamePrev = "data-click-tracking-prev",
		attributeValueDelimiter = ",",
		trackParametersNext = [ '_trackEvent' ],
		trackParametersPrev = [ '_trackEvent' ],
		methods = {
			trackEvent: function( trackParameters ) {
				if( window._gaq !== undefined ) {
					_gaq.push( trackParameters );
				}
			},

			c_next: function(){
				$( this )[ pluginName ]( "trackEvent", trackParametersNext );
			},

			c_prev: function(){
				$( this )[ pluginName ]( "trackEvent", trackParametersPrev );
			},

			_bindClickTrackingEventListeners: function(){
				var $elem = $( this )
					.bind( "click", function( e ){
						var targ = $( e.target ).closest( "a[href='#next'],a[href='#prev']" );
						if( targ.length ){
							$elem[ pluginName ]( targ.is( "[href='#next']" ) ? "c_next" : "c_prev" );
							e.preventDefault();
						}
					});
				return this;
			},

			_trackingParametersInit: function(){
				var nextAttr = $( this ).attr( dataAttributeNameNext ),
					prevAttr = $( this ).attr( dataAttributeNamePrev );
				trackParametersNext = ( nextAttr !== undefined ) ?
						( trackParametersNext.concat( nextAttr.split( attributeValueDelimiter ) ) ) :
						[];
				trackParametersPrev = ( prevAttr !== undefined ) ?
						( trackParametersPrev.concat( prevAttr.split( attributeValueDelimiter ) ) ) :
						[];
			},

			_clickTrackingInit: function(){
				var clickTrackingAttr = $( this ).attr( dataAttributeName ),
					clickTracking = ( clickTrackingAttr !== undefined ) ?
						( clickTrackingAttr.toLowerCase() !== "false" ) :
						false;
				if( clickTracking === true ){
					$( this )
						[ pluginName ]( "_bindClickTrackingEventListeners" )
						[ pluginName ]( "_trackingParametersInit" );
				}
			}
		};
			
	// add methods
	$.extend( $.fn[ pluginName ].prototype, methods ); 
	
	// DOM-ready auto-init
	$( initSelector ).on( "create." + pluginName, function(){
		$( this )[ pluginName ]( "_clickTrackingInit" );
	} );
}(jQuery));
