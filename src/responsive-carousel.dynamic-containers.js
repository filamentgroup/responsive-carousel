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
		prevClass = itemClass + "-prev",
		nextClass = itemClass + "-next",
		activeClass = pluginName + "-active",
		rowAttr = "data-" + pluginName + "-slide",
		$win = $( window ),
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
					.removeClass( itemClass + " " + activeClass + " " + prevClass + " " + nextClass )
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
				
				$self[ pluginName ]( "update" )
					[ pluginName ]( "_addNextPrevClasses" )
					// initialize pagination
					.trigger( "goto." + pluginName );
				
				$self.find( "." + itemClass ).eq( 0 ).addClass( activeClass );
			},
			
			_dynamicContainerEvents: function(){
				var $self = $( this ),
					win_w = $win.width(),
					win_h = $win.height(),
					timeout;
				
				// on init
				$self[ pluginName ]( "_assessContainers" );
				
				// and on resize
				$win.on( "resize", function( e ){
					
					// IE wants to constantly run resize for some reason
					// Let’s make sure it is actually a resize event
					var win_w_new = $win.width(),
						win_h_new = $win.height();
					
					if( win_w !== win_w_new ||
						win_h !== win_h_new )
					{
						// timer shennanigans
						clearTimeout(timeout);
						timeout = setTimeout( function(){
							$self[ pluginName ]( "_assessContainers" );
						}, 200 );
						
						// Update the width and height
						win_w = win_w_new;
						win_h = win_h_new;
					}
				});
			}
		};
			
	// add methods
	$.extend( $.fn[ pluginName ].prototype, dynamicContainers ); 
	
	// DOM-ready auto-init
	$( document ).on( "create." + pluginName, initSelector, function(){
		$( this )[ pluginName ]( "_dynamicContainerEvents" );
	} );

}(jQuery));
