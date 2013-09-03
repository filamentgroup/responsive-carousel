/*global module:false*/
module.exports = function(grunt) {
	var lintFiles = ['Gruntfile.js', 'src/*.js', 'test/**/*.js'];

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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
		uglify: {
			options: {
				banner: '<banner:meta.banner>'
			},

			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': [ 'dist/<%= pkg.name %>.js' ]
				}
			}
		},

		watch: {
			files: lintFiles,
			tasks: 'jshint qunit'.split( " " )
		},

		jshint: {
			all: lintFiles
		},

		qunit: {
			all: [ "test/unit/responsive-carousel.html" ]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task.
	grunt.registerTask('default', 'jshint qunit concat uglify'.split( " " ));

	// Travis
	grunt.registerTask('travis', 'jshint qunit'.split( " " ));
};
