/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

// DOM readiness needed for all tests
$(function(){

	test( "Carousel initializes automatically on DOM ready", function() {
		ok( $( "[data-carousel]" ).is( ".carousel" ) );
	});

	test( "Carousel child-items have carousel-item class", function() {
		ok( $( "[data-carousel] [data-carousel-item]" ).is( ".carousel-item" ) );
	});

	module("Testing goTo");

	test( "Carousel contain width is set based upon the amount of carousel-items there are" , function() {
		var $items = $( "[data-carousel] [data-carousel-item]" ),
				amt = $items.length,
				$contain = $( ".carousel-contain" ),
				width = Math.round($contain.width()/$(window).width());
		equal( width, amt, "The width is correctly set" );
	});


	test( "goTo sets margin according to which position it is in" , function(){
		stop();
		var $items = $( "[data-carousel] [data-carousel-item]" ),
				amt = $items.length,
			  $contain = $( ".carousel-contain" ),
				position = 2,
				expectedMargin = -100;
		$( ".carousel" ).carousel( "goTo", position );
		setTimeout(function(){
			var marg = parseFloat($contain.css( "marginLeft" ), 10),
			    x = Math.round(marg/$(window).width()) * 100;
			equal( x, expectedMargin, "The margin is at the correct position" );
			start();
		}, 200);
	});
	
	test( "goTo sets margin according to which position it is in" , function(){
		stop();
		var $items = $( "[data-carousel] [data-carousel-item]" ),
				amt = $items.length,
			  $contain = $( ".carousel-contain" ),
				position = 3,
				expectedMargin = -200;
		$( ".carousel" ).carousel( "goTo", position );
		setTimeout(function(){
			var marg = parseFloat($contain.css( "marginLeft" ), 10),
			    x = Math.round(marg/$(window).width()) * 100;
			equal( x, expectedMargin, "The margin is at the correct position" );
			start();
		}, 200);
	});

	test( "next sets margin to next spot according to the current margin" , function(){
		$( ".carousel" ).carousel( "goTo", 1 );
		stop();
		var $items = $( "[data-carousel] [data-carousel-item]" ),
				amt = $items.length,
			  $contain = $( ".carousel-contain" ),
				expectedMargin = -100;
		$( ".carousel" ).carousel( "next" );
		setTimeout(function(){
			var marg = parseFloat($contain.css( "marginLeft" ), 10),
			    x = Math.round(marg/$(window).width()) * 100;
			equal( x, expectedMargin, "The margin is at the correct position" );
			start();
		}, 200);
	});

	test( "prev sets margin to prev spot according to the current margin" , function(){
		$( ".carousel" ).carousel( "goTo", 2 );
		stop();
		var $items = $( "[data-carousel] [data-carousel-item]" ),
				amt = $items.length,
			  $contain = $( ".carousel-contain" ),
				expectedMargin = 0;
		$( ".carousel" ).carousel( "prev" );
		setTimeout(function(){
			var marg = parseFloat($contain.css( "marginLeft" ), 10),
			    x = Math.round(marg/$(window).width()) * 100;
			equal( x, expectedMargin, "The margin is at the correct position" );
			start();
		}, 200);
	});
	

});


}(jQuery));
