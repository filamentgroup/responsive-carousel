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
					
					$row.prependTo( $self );
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