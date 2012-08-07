# Responsive Carousel

A jQuery-based script for responsive carousels that work with mouse, touch, and keyboard

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/filamentgroup/responsive-carousel/master/dist/responsive-carousel.min.js
[max]: https://raw.github.com/filamentgroup/responsive-carousel/master/dist/responsive-carousel.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/responsive-carousel.min.js"></script>
<link href="src/responsive-carousel.css" rel="stylesheet">

<div data-carousel>
	<div data-carousel-item>
		<!-- carousel item content here -->
	</div>
	<div data-carousel-item>
		<!-- carousel item content here -->
	</div>
</div>

```

The default build includes the slide/drag transition that you can apply by adding a data attribute and including some additional CSS.
```html
<script src="jquery.js"></script>
<script src="dist/responsive-carousel.min.js"></script>
<link href="src/responsive-carousel.css" rel="stylesheet">
<link href="src/responsive-carousel.slide.css" rel="stylesheet">

<div data-carousel data-transition="slide">
	<div data-carousel-item>
		<!-- carousel item content here -->
	</div>
	<div data-carousel-item>
		<!-- carousel item content here -->
	</div>
</div>

```

There are other extensions in the `src` folder, such as flip and fade transitions, autoplay, keyboard handling, pagination, and more. 

### Demos

Check out the [`test/functional/`](http://filamentgroup.github.com/responsive-carousel/test/functional/) directory for examples.

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "src" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Filament Group, Inc.  
Licensed under the MIT, GPL licenses.
