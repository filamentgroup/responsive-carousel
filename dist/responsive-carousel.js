/*! Responsive Carousel - v0.1.0 - 2012-06-26
* https://github.com/filamentgroup/responsive-carousel
* Copyright (c) 2012 Filament Group, Inc.; Licensed MIT, GPL */

(function($) {
	
	var pluginName = "carousel",
		initSelector = "[data-"+ pluginName +"]",
		getMarginLeft = function( $elem ){
			return $elem[ 0 ].style.cssText.match( /margin\-left:\s*(-?[0-9]+)%/ ) && parseFloat( RegExp.$1 );
		},
		methods = {
			_create: function(){
				$( this )
					.trigger( "beforecreate." + pluginName )
					.addClass( pluginName )
					[ pluginName ]( "_addContainer" )
					[ pluginName ]( "_addNextPrev" )
					[ pluginName ]( "_bindEventListeners" )
					[ pluginName ]( "_updateItems" )
					.trigger( "create." + pluginName );
			},
			
			update: function(){
				$( this )
					.trigger( "beforeupdate." + pluginName )
					[ pluginName ]( "_updateItems" )
					.trigger( "update." + pluginName );
			},

			_addContainer: function(){
				return $( this ).wrapInner( "<div class='"+ pluginName + "-contain'></div>" );
			},
			
			next: function( currMarg ){
				$( this )[ pluginName ]( "goTo", "-1", currMarg  );
			},
			
			prev: function( currMarg ){
				$( this )[ pluginName ]( "goTo", "1", currMarg );
			},
			
			goTo: function( num, currMarg ){
				var $contain = $( this ).find( "." + pluginName + "-contain" ),
					items = $( this ).find( "[data-" + pluginName + "-item]" ),
					currMar = currMarg !== undefined ? currMarg : getMarginLeft( $contain ) || 0,
					newMar = typeof( num ) === "number" ? (num-1) * -100 : currMar + ( parseFloat(num) * 100 );
					
				if( newMar <= 0 && newMar > (items.length) * -100 ){
					$contain.css( "margin-left", newMar + "%" );
				}
				return this;
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
			},
			
			_updateItems: function(){
				var childItems = $( this ).find( "[data-" + pluginName + "-item]" );
				
				childItems
					.addClass( pluginName + "-item" )
					.width( ( 100 / childItems.length ) + "%" );
				
				$(this).find( "." + pluginName + "-contain" ).width( ( 100 * childItems.length ) + "%" );
				return this;
			},
			
			_addNextPrev: function(){
				return $( this )
					.append( "<nav><a href='#prev' class='prev' title='Previous'>Prev</a><a href='#next' class='next' title='Next'>Next</a></nav>" );		
			},
			
			destroy: function(){
				var $elem = $( this );
				
				$elem
					.removeData( pluginName + "active" )
					.removeClass( pluginName )
					.unbind( "." + pluginName )
					.html( $elem.children().children() );
				
				$elem
					.find( "[data-" + pluginName + "-item]" )
					.removeClass( pluginName + "-item" )
					.unbind( "." + pluginName );
				
				$elem .trigger( "destroy." + pluginName );
				
				return this;
			}
		};
		
	// Collection method.
	$.fn[ pluginName ] = function( arrg, adds ) {
		return this.each(function() {

			// if it's a method
			if( arrg && typeof( arrg ) === "string" ){
				return $.fn[ pluginName ].prototype[ arrg ].call( this, adds );
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
		initSelector = "[data-"+ pluginName +"]",
		getMarginLeft = function( $elem ){
			return $elem[ 0 ].style.cssText.match( /margin\-left:\s*(-?[0-9]+)%/ ) && parseFloat( RegExp.$1 );
		},
		touchMethods = {
			_dragBehavior: function(){
				
				var origin, deltaX, deltaY,
					$contain = $( this ).find( "." + pluginName + "-contain"  ),
					currPercentMargin,
					currPXMargin,
					carouselWidth,
					containWidth,
					endLeft;

				$contain
					.bind( "touchstart", function( e ){
						var touches = e.touches || e.originalEvent.touches;
						origin = { "x": touches[ 0 ].pageX, "y": touches[ 0 ].pageY };
						currPercentMargin = getMarginLeft( $contain ) || 0;
						currPXMargin = parseFloat( $contain.css( "margin-left" ) );
						carouselWidth = $( this ).parent().width();
						containWidth = $contain.width();	
						$( this ).addClass( pluginName + "-dragging" );
						e.preventDefault();					
					} )
					.bind( "touchmove", function( e ){						
						var touches = e.touches || e.originalEvent.touches,
							curr = { "x": touches[ 0 ].pageX, "y": touches[ 0 ].pageY };
						
						deltaX = curr.x - origin.x;
						deltaY = curr.y - origin.y;
						
						var newLeft = currPXMargin + deltaX;
						
						if( Math.abs( newLeft ) <= containWidth && newLeft <= 0 ){
							$contain.css( "margin-left", newLeft + "px" );
						}
					} )
					.bind( "touchend", function( e ){							
						$( this ).removeClass( pluginName + "-dragging" );
						
						var newLeft = currPXMargin + deltaX;
						
						if( Math.abs( deltaX ) > 45 && Math.abs( newLeft ) < containWidth && newLeft < 0  ){
							endLeft = ( deltaX > 0 ? carouselWidth : -carouselWidth ) + currPXMargin;
						}
						else{
							endLeft = currPXMargin;
						}
						
						$contain
							.css( "margin-left", endLeft + "px" )
							.bind( "webkitTransitionEnd transitionend", function(){
								$( this )
									.css( "margin-left", endLeft / carouselWidth * 100 + "%" )
									.unbind( "webkitTransitionEnd transitionend" );
							});
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