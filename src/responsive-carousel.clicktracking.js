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
				if( _gaq !== undefined && _gaq.length ) {
					_gaq.push( trackParameters );
				}
			},

			m_next: function(){
				$( this )[ pluginName ]( "trackEvent", trackParametersNext );
				$( this )[ pluginName ]( "m_goTo", "+1" );
			},

			m_prev: function(){
				$( this )[ pluginName ]( "trackEvent", trackParametersPrev );
				$( this )[ pluginName ]( "m_goTo", "-1" );
			},

			_bindClickTrackingEventListeners: function(){
				var $elem = $( this )
					.bind( "click", function( e ){
						var targ = $( e.target ).closest( "a[href='#next'],a[href='#prev']" );
						if( targ.length ){
							$elem[ pluginName ]( targ.is( "[href='#next']" ) ? "m_next" : "m_prev" );
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
