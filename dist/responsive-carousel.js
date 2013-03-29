/*! Responsive Carousel - v0.1.0 - 2013-03-29
* https://github.com/filamentgroup/responsive-carousel
* Copyright (c) 2013 Filament Group, Inc.; Licensed MIT, GPL */

/*
 * responsive-carousel
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {

	var pluginName = "carousel",
		initSelector = "." + pluginName,
		transitionAttr = "data-transition",
		transitioningClass = pluginName + "-transitioning",
		itemClass = pluginName + "-item",
		activeClass = pluginName + "-active",
		inClass = pluginName + "-in",
		outClass = pluginName + "-out",
		navClass =  pluginName + "-nav",
		cssTransitionsSupport = (function(){
			var prefixes = "webkit Moz O Ms".split( " " ),
				supported = false,
				property;

			while( prefixes.length ){
				property = prefixes.shift() + "Transition";

				if ( property in document.documentElement.style !== undefined && property in document.documentElement.style !== false ) {
					supported = true;
					break;
				}
			}
			return supported;
		}()),
		methods = {
			_create: function(){
				$( this )
					.trigger( "beforecreate." + pluginName )
					[ pluginName ]( "_init" )
					[ pluginName ]( "_addNextPrev" )
					.trigger( "create." + pluginName );
			},

			_init: function(){
				var trans = $( this ).attr( transitionAttr );

				if( !trans ){
					cssTransitionsSupport = false;
				}

				return $( this )
					.addClass(
						pluginName +
						" " + ( trans ? pluginName + "-" + trans : "" ) + " "
					)
					.children()
					.addClass( itemClass )
					.first()
					.addClass( activeClass );
			},

			next: function(){
				$( this )[ pluginName ]( "goTo", "+1" );
			},

			prev: function(){
				$( this )[ pluginName ]( "goTo", "-1" );
			},

			goTo: function( num ){

				var $self = $(this),
					trans = $self.attr( transitionAttr ),
					reverseClass = " " + pluginName + "-" + trans + "-reverse";

				// clean up children
				$( this ).find( "." + itemClass ).removeClass( [ outClass, inClass, reverseClass ].join( " " ) );

				var $from = $( this ).find( "." + activeClass ),
					prevs = $from.index(),
					activeNum = ( prevs < 0 ? 0 : prevs ) + 1,
					nextNum = typeof( num ) === "number" ? num : activeNum + parseFloat(num),
					$to = $( this ).find( ".carousel-item" ).eq( nextNum - 1 ),
					reverse = ( typeof( num ) === "string" && !(parseFloat(num)) ) || nextNum > activeNum ? "" : reverseClass;

				if( !$to.length ){
					$to = $( this ).find( "." + itemClass )[ reverse.length ? "last" : "first" ]();
				}

				if( cssTransitionsSupport ){
					$self[ pluginName ]( "_transitionStart", $from, $to, reverse );
				} else {
					$to.addClass( activeClass );
					$self[ pluginName ]( "_transitionEnd", $from, $to, reverse );
				}

				// added to allow pagination to track
				$self.trigger( "goto." + pluginName, $to );
			},

			update: function(){
				$(this).children().not( "." + navClass ).addClass( itemClass );

				return $(this).trigger( "update." + pluginName );
			},

			_transitionStart: function( $from, $to, reverseClass ){
				var $self = $(this);

				$to.one( navigator.userAgent.indexOf( "AppleWebKit" ) > -1 ? "webkitTransitionEnd" : "transitionend otransitionend", function(){
					$self[ pluginName ]( "_transitionEnd", $from, $to, reverseClass );
				});

				$(this).addClass( reverseClass );
				$from.addClass( outClass );
				$to.addClass( inClass );
			},

			_transitionEnd: function( $from, $to, reverseClass ){
				$( this ).removeClass( reverseClass );
				$from.removeClass( outClass + " " + activeClass );
				$to.removeClass( inClass ).addClass( activeClass );
			},

			_bindEventListeners: function(){
				var $elem = $( this )
					.bind( "click", function( e ){
						var targ = $( e.target ).closest( "a[href='#next'],a[href='#prev']" );
						if( targ.length ){
							$elem[ pluginName ]( targ.is( "[href='#next']" ) ? "next" : "prev" );
							e.preventDefault();
						}
					});

				return this;
			},

			_addNextPrev: function(){
				return $( this )
					.append( "<nav class='"+ navClass +"'><a href='#prev' class='prev' aria-hidden='true' title='Previous'>Prev</a><a href='#next' class='next' aria-hidden='true' title='Next'>Next</a></nav>" )
					[ pluginName ]( "_bindEventListeners" );
			},

			destroy: function(){
				// TODO
			}
		};

	// Collection method.
	$.fn[ pluginName ] = function( arrg, a, b, c ) {
		return this.each(function() {

			// if it's a method
			if( arrg && typeof( arrg ) === "string" ){
				return $.fn[ pluginName ].prototype[ arrg ].call( this, a, b, c );
			}

			// don't re-init
			if( $( this ).data( pluginName + "data" ) ){
				return $( this );
			}

			// otherwise, init
			$( this ).data( pluginName + "active", true );
			$.fn[ pluginName ].prototype._create.call( this );
		});
	};
	
	// add methods
	$.extend( $.fn[ pluginName ].prototype, methods ); 

}(jQuery));

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
					setData = function( e ){
						
						var touches = e.touches || e.originalEvent.touches,
							$elem = $( e.target ).closest( initSelector );
						
						if( e.type === "touchstart" ){
							origin = { 
								x : touches[ 0 ].pageX,
								y: touches[ 0 ].pageY
							};
						}

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
							$( e.target ).closest( initSelector ).trigger( "drag" + e.type.split( "touch" )[ 1], data );
						}
					};

				$( this )
					.bind( "touchstart", function( e ){
						$( this ).addClass( noTrans );
						emitEvents( e );
					} )
					.bind( "touchmove", function( e ){
						setData( e );
						emitEvents( e );
						if( !iOS ){
							e.preventDefault();
							window.scrollBy( 0, -data.deltaY );
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
	$( initSelector ).on( "create." + pluginName, function(){
		$( this )[ pluginName ]( "_dragBehavior" );
	} );

}(jQuery));
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
			
			return [ $from, $to ];
		};
		
	// Touch handling
	$( initSelector )
		.on( "dragmove", function( e, data ){

			if( !dragThreshold( data.deltaX ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( this ), data.deltaX );
			
			activeSlides[ 0 ].css( "left", data.deltaX + "px" );
			activeSlides[ 1 ].css( "left", data.deltaX < 0 ? data.w + data.deltaX + "px" : -data.w + data.deltaX + "px" );
		} )
		.on( "dragend", function( e, data ){
			if( !dragThreshold( data.deltaX ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( this ), data.deltaX ),
				newSlide = Math.abs( data.deltaX ) > 45;
			
			$( this ).one( navigator.userAgent.indexOf( "AppleWebKit" ) ? "webkitTransitionEnd" : "transitionEnd", function(){
				activeSlides[ 0 ].add( activeSlides[ 1 ] ).css( "left", "" );
			});			
				
			if( newSlide ){
				activeSlides[ 0 ].removeClass( activeClass ).css( "left", data.deltaX > 0 ? data.w  + "px" : -data.w  + "px" );
				activeSlides[ 1 ].addClass( activeClass ).css( "left", 0 );
			}
			else {
				activeSlides[ 0 ].css( "left", 0);
				activeSlides[ 1 ].css( "left", data.deltaX > 0 ? -data.w  + "px" : data.w  + "px" );	
			}
		} );
		
}(jQuery));
/*
 * responsive-carousel pagination extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function( $, undefined ) {
	var pluginName = "carousel",
		initSelector = "." + pluginName + "[data-paginate]",
		paginationClass = pluginName + "-pagination",
		activeClass = pluginName + "-active-page",
		paginationMethods = {
			_createPagination: function(){
				var nav = $( this ).find( "." + pluginName + "-nav" ),
					items = $( this ).find( "." + pluginName + "-item" ),
					pNav = $( "<ol class='" + paginationClass + "'></ol>" ),
					num, thumb, content;

				// remove any existing nav
				nav.find( "." + paginationClass ).remove();

				items.each(function(i){
						num = i + 1;
						thumb = $( this ).attr( "data-thumb" );
						content = num;
						if( thumb ){
							content = "<img src='" + thumb + "' alt=''>";
						}
						pNav.append( "<li><a href='#" + num + "' title='Go to slide " + num + "'>" + content + "</a>" );
				});

				if( thumb ){
					pNav.addClass( pluginName + "-nav-thumbs" );
				}

				nav
					.addClass( pluginName + "-nav-paginated" )
					.find( "a" ).first().after( pNav );
			},
			_bindPaginationEvents: function(){
				$( this )
					.bind( "click", function( e ){
						var pagLink = $( e.target );

						if( e.target.nodeName === "IMG" ){
							pagLink = pagLink.parent();
						}

						pagLink = pagLink.closest( "a" );
						var href = pagLink.attr( "href" );
						
						if( pagLink.closest( "." + paginationClass ).length && href ){
							$( this )[ pluginName ]( "goTo", parseFloat( href.split( "#" )[ 1 ] ) );
							e.preventDefault();
						}
					} )
					// update pagination on page change
					.bind( "goto." + pluginName, function( e, to  ){
						var index = to ? $( to ).index() : 0;
						$( this ).find( "ol." + paginationClass + " li" )
							.removeClass( activeClass )
							.eq( index )
								.addClass( activeClass );
					} )
					// initialize pagination
					.trigger( "goto." + pluginName );
			}
		};
			
	// add methods
	$.extend( $.fn[ pluginName ].prototype, paginationMethods ); 
	
	// create pagination on create and update
	$( initSelector )
		.on( "create." + pluginName, function(){
			$( this )
				[ pluginName ]( "_createPagination" )
				[ pluginName ]( "_bindPaginationEvents" );
		} )
		.on( "update." + pluginName, function(){
			$( this )[ pluginName ]( "_createPagination" );
		} );

}(jQuery));
/*
 * responsive-carousel auto-init extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function( $ ) {
	// DOM-ready auto-init
	$( function(){
		$( ".carousel" ).carousel();
	} );
}( jQuery ));