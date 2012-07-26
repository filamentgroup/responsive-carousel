/*! Responsive Carousel - v0.1.0 - 2012-07-26
* https://github.com/filamentgroup/responsive-carousel
* Copyright (c) 2012 Filament Group, Inc.; Licensed MIT, GPL */

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
			var prefixes = " -webkit- -moz- -o- -ms- ".split( " " ),
				supported = false;
			
			while( prefixes.length ){
				if( prefixes.shift() + "transition" in document.documentElement.style !== undefined ){
					supported = true;
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
					prevs = $from.prevAll().length,
					activeNum = ( prevs || 0 ) + 1,
					nextNum = typeof( num ) === "number" ? num : activeNum + parseFloat(num),
					$to = $( this ).find( ".carousel-item" ).eq( nextNum - 1 ),
					reverse = ( typeof( num ) === "string" && !(parseFloat(num)) ) || nextNum > activeNum ? "" : reverseClass;

				if( !$to.length ){
					$to = $( this ).find( "." + itemClass )[ reverse.length ? "last" : "first" ]();
				}

				if( cssTransitionsSupport  ){
					$self[ pluginName ]( "_transitionStart", $from, $to, reverse );
				}
				else {
					$to.addClass( activeClass );
					$self[ pluginName ]( "_transitionEnd", $from, $to, reverse );
				}
			},
			
			update: function(){
				$(this).children().not( "." + navClass ).addClass( itemClass );
				
				return $(this).trigger( "update." + pluginName );
			},
			
			_transitionStart: function( $from, $to, reverseClass ){
				var $self = $(this);
				
				$to.one( navigator.userAgent.indexOf( "AppleWebKit" ) ? "webkitTransitionEnd" : "transitionEnd", function(){
					$self[ pluginName ]( "_transitionEnd", $from, $to, reverseClass );
				});
				
				$(this).addClass( reverseClass );
				$from.addClass( outClass );
				$to.addClass( inClass );	
			},
			
			_transitionEnd: function( $from, $to, reverseClass ){
				$(this).removeClass( reverseClass );
				$from.removeClass( outClass + " " + activeClass );
				$to.removeClass( inClass ).addClass( activeClass );
			},
						
			_bindEventListeners: function(){
				var $elem = $( this )
					.bind( "click", function( e ){
						var targ = $( e.target );
						if( targ.is( "a" ) ){
							$elem[ pluginName ]( targ.is( "[href='#next']" ) ? "next" : "prev" );
							e.preventDefault();
						}
					});
				
				return this;
			},
			
			_addNextPrev: function(){
				return $( this )
					.append( "<nav class='"+ navClass +"'><a href='#prev' class='prev' title='Previous'>Prev</a><a href='#next' class='next' title='Next'>Next</a></nav>" )
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
	
	// DOM-ready auto-init
	$( function(){
		$( initSelector )[ pluginName ]();
	} );

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
						$( e.target ).closest( initSelector ).trigger( "drag" + e.type.split( "touch" )[ 1], data );
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
	$( initSelector ).live( "create." + pluginName, function(){
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
		.live( "dragmove", function( e, data ){
			if( !dragThreshold( data.deltaX ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( this ), data.deltaX );
			activeSlides[ 0 ].css( "left", data.deltaX );
			activeSlides[ 1 ].css( "left", data.deltaX < 0 ? data.w + data.deltaX : -data.w + data.deltaX );
		} )
		.live( "dragend", function( e, data ){
			if( !dragThreshold( data.deltaX ) ){
				return;
			}
			var activeSlides = getActiveSlides( $( this ), data.deltaX ),
				newSlide = Math.abs( data.deltaX ) > 45;
			
			$( this ).one( navigator.userAgent.indexOf( "AppleWebKit" ) ? "webkitTransitionEnd" : "transitionEnd", function(){
				activeSlides[ 0 ].add( activeSlides[ 1 ] ).css( "left", "" );
			});			
				
			if( newSlide ){
				activeSlides[ 0 ].removeClass( activeClass ).css( "left", data.deltaX > 0 ? data.w : -data.w );
				activeSlides[ 1 ].addClass( activeClass ).css( "left", 0 );
			}
			else {
				activeSlides[ 0 ].css( "left", 0);
				activeSlides[ 1 ].css( "left", data.deltaX > 0 ? -data.w : data.w  );	
			}
		} );
		
}(jQuery));
/*
 * responsive-carousel dynamic containers extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function($) {
	
	var pluginName = "carousel",
		initSelector = "." + pluginName,
		itemClass = pluginName + "-item",
		activeClass = pluginName + "-active",
		rowAttr = "data-" + pluginName + "-slide",
		dynamicContainers = {
			_assessContainers: function(){
				var $self = $( this ),
					$rows = $self.find( "[" + rowAttr + "]" ),
					$activeItem = $rows.filter( "." + activeClass ).children( 0 ),
					$kids = $rows.children(),
					$nav = $self.find( "." + pluginName + "-nav" ),
					sets = [];
				
				if( !$rows.length ){
					$kids = $( this ).find( "." + itemClass );
				}
				else{
					$kids.appendTo( $self );
					$rows.remove();
				}
				
				$kids
					.removeClass( itemClass + " " + activeClass )
					.each(function(){
						var prev = $( this ).prev();
						
						if( !prev.length || $( this ).offset().top !== prev.offset().top ){
							sets.push([]);
						}
						
						sets[ sets.length -1 ].push( $( this ) );
					});
				
				for( var i = 0; i < sets.length; i++ ){
					var $row = $( "<div " + rowAttr + "></div>" );
					for( var j = 0; j < sets[ i ].length; j++ ){
						$row.append( sets[ i ][ j ] );
					}
					
					$row.insertBefore( $nav );
				}
				
				$self[ pluginName ]( "update" );
				
				$self.find( "." + itemClass ).eq( 0 ).addClass( activeClass );
			},
			
			_dynamicContainerEvents: function(){
				var $self = $( this ),
					timeout;
				
				// on init
				$self[ pluginName ]( "_assessContainers" );
				
				// and on resize
				$( window )
					.bind( "resize", function( e ){
						if( timeout ){
							clearTimeout( timeout );
						}
						
						timeout = setTimeout( function(){
							$self[ pluginName ]( "_assessContainers" );
						}, 200 );
					} );				
			}
		};
			
	// add methods
	$.extend( $.fn[ pluginName ].prototype, dynamicContainers ); 
	
	// DOM-ready auto-init
	$( initSelector ).live( "create." + pluginName, function(){
		$( this )[ pluginName ]( "_dynamicContainerEvents" );
	} );

}(jQuery));
/*
 * responsive-carousel autoplay extension
 * https://github.com/filamentgroup/responsive-carousel
 *
 * Copyright (c) 2012 Filament Group, Inc.
 * Licensed under the MIT, GPL licenses.
 */

(function( $, undefined ) {
	var pluginName = "carousel",
		initSelector = "." + pluginName,
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
				var autoplay = $( this ).attr( "data-autoplay");
				if( autoplay !== undefined && autoplay !== false ){
					$( this )
						[ pluginName ]( "_bindStopListener" )
						[ pluginName ]( "play" );
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
		paginationMethods = {
			_createPagination: function(){
				var nav = $( this ).find( "." + pluginName + "-nav" ),
					items = $( this ).find( "." + pluginName + "-item" ),
					pNav = $( "<ol class='" + paginationClass + "'></ol>" ),
					num;
				
				// remove any existing nav
				nav.find( "." + paginationClass ).remove();
				
				for( var i = 0, il = items.length; i < il; i++ ){
					num = i + 1;
					pNav.append( "<li><a href='#" + num + "' title='Go to slide " + num + "'>" + num + "</a>" );
				}
				nav
					.addClass( pluginName + "-nav-paginated" )
					.find( "a" ).first().after( pNav );
			},
			_bindPaginationEvents: function(){
				$( this ).bind( "click", function( e ){
					var pagLink = $( e.target ).closest( "a" ),
						href = pagLink.attr( "href" );
						
					if( href ){
						$( this )[ pluginName ]( "goTo", parseFloat( href.split( "#" )[ 1 ] ) );
						e.preventDefault();
					}
				} );
			}
		};
			
	// add methods
	$.extend( $.fn[ pluginName ].prototype, paginationMethods ); 
	
	// create pagination on create and update
	$( initSelector )
		.live( "create." + pluginName, function(){
			$( this )
				[ pluginName ]( "_createPagination" )
				[ pluginName ]( "_bindPaginationEvents" );
		} )
		.live( "update." + pluginName, function(){
			$( this )[ pluginName ]( "_createPagination" );
		} );

}(jQuery));