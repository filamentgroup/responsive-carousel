/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {
  var $carousel = $( "[data-carousel]" );

	module( "no-loop", {
		setup: function() {
			$carousel = $( "[data-carousel]" ).attr( "data-loop", false ).carousel();
		}
	});

	test( "prev disabled initially", function() {
		ok( $carousel.find( "a.prev" ).is( ".disabled" ), "previous is disabled" );
	});

	test( "next disabled when the last item is active", function() {
		$carousel.carousel( "goTo", $carousel.find( ".carousel-item" ).length );
		ok( $carousel.find( "a.next" ).is( ".disabled" ), "next is disabled" );
	});

	test( "both are enabled when an inner item is active", function() {
		$carousel.carousel( "goTo", $carousel.find( ".carousel-item" ).length - 1);
		ok( !$carousel.find( "a.next" ).is( ".disabled" ), "next is enabled" );
		ok( !$carousel.find( "a.prev" ).is( ".disabled" ), "prev is enabled" );
	});

	// TODO temporary until the other tests are working, they should cover this negative case
	module( "without no-loop" );

	test( "both are enabled when an inner item is active", function() {
		$carousel = $( "[data-carousel]" ).carousel();
		$carousel.carousel( "goTo", $carousel.find( ".carousel-item" ).length - 1);

		ok( !$carousel.find( "a.next" ).is( ".disabled" ), "next is enabled" );
		ok( !$carousel.find( "a.prev" ).is( ".disabled" ), "next is enabled" );
	});
  /*
// DOM readiness needed for all tests
$(function(){


	test( "Carousel child-items have carousel-item class", function() {
		ok( $( "[data-carousel] [data-carousel-item]" ).is( ".carousel-item" ) );
	});

	module("Testing goTo");

	QUnit.testStart = function(name){
		$( ".carousel" ).carousel( "goTo", 1 );
	};

	test( "Carousel contain width is set based upon the amount of carousel-items there are" , function() {
		var $items = $( "[data-carousel] [data-carousel-item]" ),
				amt = $items.length,
				$contain = $( ".carousel-contain" ),
				$carousel = $( ".carousel" ),
				width = Math.round($contain.width()/$carousel.width());
		equal( width, amt, "The width is correctly set" );
	});


	test( "goTo sets margin according to which position it is in" , function(){
		stop();
		var $items = $( "[data-carousel] [data-carousel-item]" ),
				amt = $items.length,
				$contain = $( ".carousel-contain" ),
				$carousel = $( ".carousel" ),
				position = 1;
		$( ".carousel" ).carousel( "goTo", position );
		setTimeout(function(){
			var marg = parseFloat($contain.css( "margin-left" ), 10),
					carouselWidth = $carousel.width(),
					actual = Math.round(Math.abs(marg/carouselWidth)+1);
			equal( actual, position, "The margin is at the correct position" );
			start();
		}, 200);
	});

	test( "goTo sets margin according to which position it is in" , function(){
		stop();
		var $items = $( "[data-carousel] [data-carousel-item]" ),
				amt = $items.length,
				$contain = $( ".carousel-contain" ),
				$carousel = $( ".carousel" ),
				position = 2;
		$( ".carousel" ).carousel( "goTo", position );
		setTimeout(function(){
			var marg = parseFloat($contain.css( "margin-left" ), 10),
					carouselWidth = $carousel.width(),
					actual = Math.round(Math.abs(marg/carouselWidth)+1);
			equal( actual, position, "The margin is at the correct position" );
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
					actualMargin = Math.round(marg/$(window).width()) * 100;
			equal( actualMargin, expectedMargin, "The margin is at the correct position" );
			start();
		}, 200);
	});

	test( "if current slide is the last, next should do nothing" , function(){
		var $items = $( "[data-carousel] [data-carousel-item]" ),
				amt = $items.length,
				$carousel = $( ".carousel" );
		$carousel.carousel( "goTo", amt-1 );
		stop();
		var $contain = $( ".carousel-contain" ),
				expectedMargin = (amt-1)*(-100);
		$carousel.carousel( "next" );
		setTimeout(function(){
			var marg = parseFloat($contain.css( "marginLeft" ), 10),
					winWidth = $(window).width() || 1000,
					x = Math.round(marg/winWidth) * 100;
			equal( x, expectedMargin, "The margin is at the correct position" );
			start();
		}, 200);
	});

	test( "if current slide is last, next link should not be showing", function(){
		var $items = $( "[data-carousel] [data-carousel-item]" ),
				amt = $items.length,
				$carousel = $( ".carousel" );
		$carousel.carousel( "goTo", amt-1 );
		stop();
		setTimeout(function(){
			ok( $( "[href='#next']" ).is( ".disabled" ), "The next button is disabled" );
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
					winWidth = $(window).width() || 1000,
					x = Math.round(marg/winWidth) * 100;
			equal( x, expectedMargin, "The margin is at the correct position" );
			start();
		}, 200);
	});

	test( "if current slide is first, prev should do nothing" , function(){
		var $items = $( "[data-carousel] [data-carousel-item]" ),
				amt = $items.length,
				$carousel = $( ".carousel" );
		$carousel.carousel( "goTo", 1 );
		stop();
		var $contain = $( ".carousel-contain" ),
				expectedMargin = 0;
		$carousel.carousel( "prev" );
		setTimeout(function(){
			var marg = parseFloat($contain.css( "marginLeft" ), 10),
					winWidth = $(window).width() || 1000,
					x = Math.round(marg/winWidth) * 100;
			equal( x, expectedMargin, "The margin is at the correct position" );
			start();
		}, 200);
	});

	test( "if current slide is first, prev link should not be showing", function(){
		var $carousel = $( ".carousel" );
		$carousel.carousel( "goTo", 1 );
		stop();
		setTimeout(function(){
			ok( $( "[href='#prev']" ).is( ".disabled" ), "The previous button is disabled" );
			start();
		}, 200);
	});
});

*/
}(jQuery));
