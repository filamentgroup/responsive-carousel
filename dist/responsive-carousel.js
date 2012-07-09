/*! Responsive Carousel - v0.1.0 - 2012-07-09
* https://github.com/filamentgroup/responsive-carousel
* Copyright (c) 2012 Filament Group, Inc.; Licensed MIT, GPL */

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
				$( this ).find( "." + itemClass ).removeClass( [ outClass, inClass, reverseClass ].join( " " ) );
				
				var $self = $(this),
					$from = $( this ).find( "." + activeClass ),
					activeNum = $from.prevAll().length + 1,
					nextNum = typeof( num ) === "number" ? num : activeNum + parseFloat(num),
					$to = $( this ).find( ".carousel-item" ).eq( nextNum - 1 ),
					reverseClass = ( typeof( num ) === "string" && !(parseFloat(num)) ) || nextNum > activeNum ? "" : " " + pluginName + "-" + $self.attr( transitionAttr ) + "-reverse";
				
				if( !$to.length ){
					$to = $( this ).find( "." + itemClass )[ reverseClass.length ? "last" : "first" ]();
				}
								
				if( cssTransitionsSupport ){
					$self[ pluginName ]( "_transitionStart", $from, $to, reverseClass );
				}
				else {
					$to.addClass( activeClass );
					$self[ pluginName ]( "_transitionEnd", $from, $to, reverseClass );
				}
			},
			
			update: function(){
				return $(this).children().not( "." + navClass ).addClass( itemClass );
			},
			
			_transitionStart: function( $from, $to, reverseClass ){
				var $self = $(this);
				
				$to.one( "webkitTransitionEnd transitionend webkitAnimationEnd animationend", function(){
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

(function($) {
	
	var pluginName = "carousel",
		initSelector = "." + pluginName,
		noTrans = pluginName + "-no-transition",
		touchMethods = {
			_dragBehavior: function(){
				var origin,
					data = {},
					deltaY,
					xPerc,
					yPerc,
					emitEvents = function( e ){
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

						$elem.trigger( "drag" + e.type.split( "touch" )[ 1], data );
						return data;
					};

				$( this )
					.bind( "touchstart", function( e ){
						$( this ).addClass( noTrans );
						emitEvents( e );
					} )
					.bind( "touchmove", function( e ){
						var data = emitEvents( e );

						if( Math.abs( data.deltaX ) > 35 && Math.abs( data.deltaY ) < 35 && data.touches.length === 1 ){
							return false;
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