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

});


}(jQuery));
