/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		concat: {
			dist: {
				src: ['<banner:meta.banner>', 'src/responsive-carousel.js', 'src/responsive-carousel.touch.js', 'src/responsive-carousel.drag.js', 'src/responsive-carousel.pagination.js', 'src/responsive-carousel.autoinit.js' ],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		min: {
			dist: {
				src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		mincss: {
			compress: {
				files: {
					'dist/responsive-carousel.min.css': ['src/responsive-carousel.css', 'src/responsive-carousel.fade.css', 'src/responsive-carousel.flip.css', 'src/responsive-carousel.pagination.css', 'src/responsive-carousel.slide.css']
				}
			}
		},
		qunit: {
			files: ['test/unit/**/*.html']
		},
		lint: {
			files: ['grunt.js', 'src/*.js', 'test/**/*.js']
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'lint qunit'
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: true
			},
			globals: {
				jQuery: true
			}
		},
		uglify: {}
	});

	grunt.loadNpmTasks('grunt-contrib-mincss');

	// Default task.
	grunt.registerTask('default', 'lint qunit concat min');

	// Travis
	grunt.registerTask('travis', 'lint qunit');
	
};
