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
		transitionEndEvent = 'transitionEnd',
		itemClass = pluginName + "-item",
		activeClass = pluginName + "-active",
		inClass = pluginName + "-in",
		outClass = pluginName + "-out",
		navClass =  pluginName + "-nav",
		cssTransitionsSupport = (function(){
			var prefixes = "Webkit Moz O Ms".split( " " ),
				prefix = null,
				styles = document.documentElement.style,
				supported = ( "transition" in styles ),
				property;
			while( ! supported && prefixes.length )
			{
				prefix = prefixes.shift();
				if ( ( prefix + "Transition" ) in styles ) {
					transitionEndEvent = prefix.toLowerCase() + 'TransitionEnd';
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
				
				var $from = $self.find( "." + activeClass ),
					prevs = $from.index(),
					activeNum = ( prevs < 0 ? 0 : prevs ) + 1,
					nextNum = typeof( num ) === "number" ? num : activeNum + parseFloat(num),
					$to = $self.find( ".carousel-item" ).eq( nextNum - 1 ),
					reverse = ( typeof( num ) === "string" && !(parseFloat(num)) ) || nextNum > activeNum ? "" : reverseClass;
				
				if( !$to.length ){
					$to = $self.find( "." + itemClass )[ reverse.length ? "last" : "first" ]();
				}

				if( cssTransitionsSupport ){
					$self[ pluginName ]( "_transitionStart", $from, $to, reverse );
				} else {
					//$to.addClass( activeClass );
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
				
				// Firefox does not camelCase the transitionend event
				$to.one( transitionEndEvent + ' transitionend', function(){
					$self[ pluginName ]( "_transitionEnd", $from, $to, reverseClass );
				});
				
				$self.addClass( reverseClass );
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
	
	// DOM-ready auto-init
	$( function(){
		$( initSelector )[ pluginName ]();
	} );

}(jQuery));
