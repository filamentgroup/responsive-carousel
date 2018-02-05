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
		prevAttr = "data-prev",
		prevTitleAttr = "data-prev-title",
		nextAttr = "data-next",
		nextTitleAttr = "data-next-title",
		transitioningClass = pluginName + "-transitioning",
		itemClass = pluginName + "-item",
		activeClass = pluginName + "-active",
		prevClass = pluginName + "-item-prev",
		nextClass = pluginName + "-item-next",
		inClass = pluginName + "-in",
		outClass = pluginName + "-out",
		navClass =  pluginName + "-nav",
		focusables = "a, input, button, select, [tabindex], textarea",
		prototype,
		cssTransitionsSupport = (function(){
			var prefixes = "webkit Moz O Ms".split( " " ),
				supported = false,
				property;

			prefixes.push("");

			while( prefixes.length ){
				property = prefixes.shift();
				property += (property === "" ? "t" : "T" )+ "ransition";

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

				$( this )
					.addClass(
						pluginName +
						" " + ( trans ? pluginName + "-" + trans : "" ) + " "
					)
					.attr( "role", "region" )
					.attr( "aria-label", "carousel" )
					.children()
					.addClass( itemClass );

				$(this)[ pluginName ]( "_addNextPrevClasses" );
				$(this)[ pluginName ]( "update" );
				$( this ).data( pluginName + "data", "init"  );
			},

			_addNextPrevClasses: function(){
				var $items = $( this ).find( "." + itemClass ),
					$active = $items.filter( "." + activeClass ),
					$next = $active.next().filter( "." + itemClass ),
					$prev = $active.prev().filter( "." + itemClass );

				if( !$next.length ){
					$next = $items.first().not( "." + activeClass );
				}
				if( !$prev.length ){
					$prev = $items.last().not( "." + activeClass );
				}

				$items.removeClass( prevClass + " " + nextClass );
				$prev.addClass( prevClass );
				$next.addClass( nextClass );

			},

			next: function(){
				$( this )[ pluginName ]( "goTo", "+1" );
			},

			prev: function(){
				$( this )[ pluginName ]( "goTo", "-1" );
			},

			goTo: function( num ){
				if( this.isNavDisabled ){
					return;
				}

				// disable navigation when moving from slide to slide
				// enabled in `_transitionEnd`
				this.isNavDisabled = true;

				var $self = $(this),
					trans = $self.attr( transitionAttr ),
					reverseClass = " " + pluginName + "-" + trans + "-reverse";

				if( $( this ).find( "." + itemClass ).filter( "." + outClass + ", ." + inClass ).length ){
					return; // goTo doesn't work during an animation
				}

				// clean up children
				$( this ).find( "." + itemClass ).removeClass( [ outClass, inClass, reverseClass ].join( " " ) );

				var $from = $( this ).find( "." + activeClass ),
					prevs = $from.index(),
					activeNum = ( prevs < 0 ? 0 : prevs ) + 1,
					nextNum = typeof( num ) === "number" ? num : activeNum + parseFloat(num),
					carouselItems = $( this ).find( "." + itemClass ),
					index = (nextNum - 1) % carouselItems.length,
					beforeGoto = "beforegoto." + pluginName,
					$to = carouselItems.eq( index ),
					reverse = ( typeof( num ) === "string" && !(parseFloat(num)) ) || nextNum > activeNum ? "" : reverseClass,
					data;

				$self.trigger( beforeGoto, data = {
					$from: $from,
					$to: $to,
					direction: nextNum > activeNum ? "forward" : "backward"
				});


				// NOTE this is a quick hack to approximate the api that jQuery provides
				//      without depending on the API (for use with similarly shaped apis)
				if( data.isDefaultPrevented ) {
					return;
				}

				if( !$to.length ){
					$to = $( this ).find( "." + itemClass )[ reverse.length ? "last" : "first" ]();
				}



				if( cssTransitionsSupport ){
					$self[ pluginName ]( "_transitionStart", $from, $to, reverse, index );
				} else {
					$self[ pluginName ]( "_transitionEnd", $from, $to, reverse, index );
				}

				// added to allow pagination to track
				$self.trigger( "goto." + pluginName, [ $to, index ] );
			},

			update: function(){
				var $items = $(this).children().not( "." + navClass );
				var $activeItem = $items.filter( "." + activeClass );
				if( !$activeItem.length ){
					$activeItem = $items.first();
				}

				$items
					.addClass( itemClass )
					.attr( "tabindex", "-1" )
					.attr( "aria-hidden", "true" )
					.attr( "role", "region" )
					.each(function( i ){
						$( this ).attr( "aria-label", "slide " + ( i + 1 ) );
						$( this ).find( focusables ).attr( "tabindex", "-1" );
					});

				$activeItem
					.addClass( activeClass )
					.attr( "tabindex", "0" )
					.each(function( i ){
						$( this ).find( focusables ).attr( "tabindex", "0" );
					})
					.attr( "aria-hidden", "false" );

				return $(this).trigger( "update." + pluginName );
			},

			_transitionStart: function( $from, $to, reverseClass, index ){
				var $self = $(this);

				$to.one( navigator.userAgent.indexOf( "AppleWebKit" ) > -1 ? "webkitTransitionEnd" : "transitionend otransitionend", function(){
					$self[ pluginName ]( "_transitionEnd", $from, $to, reverseClass, index );
				});

				$(this).addClass( reverseClass );
				$from.addClass( outClass );
				$to.addClass( inClass );
			},

			_transitionEnd: function( $from, $to, reverseClass, index ){
				$( this ).removeClass( reverseClass );

				// If the slides are moving forward prevent, the previous slide from
				// transitioning slowly to the slide stack.

				// This prevents botched transitions for 2 slide carousels because,
				// unless there's a third slide to move into position from the right,
				// the slow transition to the stack can leave it in an intermediate
				// state when the user clicks "next" again.
				if( !reverseClass ){
					$from.addClass("no-transition");
					setTimeout(function(){
						$from.removeClass("no-transition");
					});
				}

				$from.removeClass( outClass + " " + activeClass );
				$to.removeClass( inClass ).addClass( activeClass );
				$( this )[ pluginName ]( "update" );
				$( this )[ pluginName ]( "_addNextPrevClasses" );
				$( this ).trigger( "aftergoto." + pluginName, [ $to, index ] );
				if( $( document.activeElement ).closest( $from[ 0 ] ).length ){
					$to.focus();
				}

				this.isNavDisabled = false;
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
				var $nav, $this = $( this ), $items, $active;

				var prev = $( this ).attr( prevAttr ) || "Prev",
					next = $( this ).attr( nextAttr ) || "Next",
					prevTitle = $( this ).attr( prevTitleAttr) || "Previous",
					nextTitle = $( this ).attr( nextTitleAttr) || "Next";

				$nav = $("<nav class='"+ navClass +"' role='region' aria-label='carousel controls'>" +
					"<a href='#prev' class='prev' aria-label='" + prevTitle + "' title='" + prevTitle + " slide'>" + prev + "</a>" +
					"<a href='#next' class='next' aria-label='" + nextTitle + "' title='" + nextTitle + " slide'>" + next + "</a>" +
					"</nav>");

				$this.trigger( "beforecreatenav." + pluginName, { $nav: $nav });

				return $this.append( $nav )[ pluginName ]( "_bindEventListeners" );
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
			if( $( this ).data( pluginName + "active" ) ){
				return $( this );
			}

			// otherwise, init
			$( this ).data( pluginName + "active", true );
			$.fn[ pluginName ].prototype._create.call( this );
		});
	};

	// add methods
	prototype = $.extend( $.fn[ pluginName ].prototype, methods );
}(jQuery));
