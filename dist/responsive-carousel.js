/*! Responsive Carousel - v0.1.0 - 2012-06-25
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
				$( this ).wrapInner( "<div class='"+ pluginName + "-contain'></div>" );
			},
			
			next: function(){
				$( this )[ pluginName ]( "goTo", [ "-1" ] );
			},
			
			prev: function(){
				$( this )[ pluginName ]( "goTo", [ "1" ] );
			},
			
			goTo: function( num ){
				var $contain = $( this ).find( "." + pluginName + "-contain" ),
					items = $( this ).find( "[data-" + pluginName + "-item]" ),
					currMar = getMarginLeft( $contain ) || 0,
					newMar = typeof( num ) === Number ? (num-1) * -100 : currMar + ( parseFloat(num) * 100 );

				if( newMar <= 0 && newMar > (items.length) * -100 ){
					$contain.css( "margin-left", newMar + "%" );
				}
			},
			
			_updateItems: function(){
				var newItems = $( this ).find( "[data-" + pluginName + "-item]" );
				
				newItems
					.addClass( pluginName + "-item" )
					.width( ( 100 / newItems.length ) + "%" );
				
				$(this).find( "." + pluginName + "-contain" ).width( ( 100 * newItems.length ) + "%" );
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
			}
		};
		
	// Collection method.
	$.fn[ pluginName ] = function( arrg, adds ) {
		return this.each(function() {

			// if it's a method
			if( arrg && typeof( arrg ) === "string" ){
				return $.fn[ pluginName ].prototype[ arrg ].apply( this, adds );
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