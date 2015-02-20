(function() {
	var app = angular.module( 'app', ['angular-loading-bar'] );

	//Chart.defaults.global.colours[0].fillColor   = "#ffe6cc";
	//Chart.defaults.global.colours[0].pointColor  = "#D96D00";
	//Chart.defaults.global.colours[0].strokeColor = "#D96D00";

	//Chart.defaults.global.colours[1].fillColor   = "rgba(203, 203, 203, .5)";
	//Chart.defaults.global.colours[1].pointColor  = "#CCCCCC";
	//Chart.defaults.global.colours[1].strokeColor = "#CCCCCC";

	app.controller( 'controller', function( $scope, $http, $sce, $rootScope ) {
		$scope.config   = config;
		$scope.errors   = [];
		$scope.dimensions = false;

		$rootScope.$on('cfpLoadingBar:started', function() {
	    	$scope.loading = true;
	    });

	    $rootScope.$on('cfpLoadingBar:completed', function() {
	    	$scope.loading = false;
	    });

		// Chart variables.
		// $scope.chart_labels  = [];
		//$scope.chart1_series = ['Users', 'Sessions', 'Sessions Per User'];
		//$scope.chart1_data   = [[], [], []];
		//$scope.chart2_series = ['Pageviews', 'Unique Pageviews'];
		//$scope.chart2_data   = [[], []];
		//$scope.chart3_series = ['Bounce Rate'];
		//$scope.chart3_data   = [[]];

		// Form fields.
		$scope.form = {
			'start_date' : $scope.config.start_date,
			'end_date'   : $scope.config.end_date,
			'account'    : ''
		};

		// Helper functions.
		var substringMatcher = function(strs) {
			return function findMatches(q, cb) {
				var matches, substrRegex;

				// an array that will be populated with substring matches
				matches = [];

				// regex used to determine if a string contains the substring `q`
				substrRegex = new RegExp(q, 'i');

				// iterate through the pool of strings and for any string that
				// contains the substring `q`, add it to the `matches` array
				$.each(strs, function(i, str) {
				  if (substrRegex.test(str)) {
				    // the typeahead jQuery plugin expects suggestions to a
				    // JavaScript object, refer to typeahead docs for more info
				    matches.push({ value: str });
				  }
				});

				cb(matches);
			};
		};

		var query = function( data, callback ) {
			// Pass config variables.
			data.app_name         = config.app_name;
			data.cache            = config.cache;
			data.cache_sec        = config.cache_sec;
			data.client_id        = config.client_id;
			data.debug            = config.debug;
			data.dimension        = config.dimension;
			data.email            = config.email;
			data.max_days         = config.max_days;
			data.private_key_file = config.private_key_file;
			data.view_id          = config.view_id;
			data.metrics          = config.metrics;

			data.start_date = $scope.form.start_date;
			data.end_date   = $scope.form.end_date;

			$http({
				method  : 'POST',
				url     : 'process.php',
				data    : $.param( data ),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).success( function( data ) {
				if( config.debug ) console.log( data );
				callback( data );
			});
		};

		var process_errors = function( data ) {
			angular.forEach( data.init_errors, function( value, key ) {
				$scope.errors.push( value );
			});

			angular.forEach( data.hard_errors, function( value, key ) {
				$scope.errors.push( value );
			});

			angular.forEach( data.soft_errors, function( value, key ) {
				$scope.errors.push( value );
			});
		};

		var load_dimensions = function() {
			query({ 'method': 'dimensions' }, function( data ) {console.log(data);
				var dimensions = [];

				process_errors( data );

				if( data.data.length ) {
					$scope.dimensions = true;
					dimensions = data.data;

					$( '#dimension' ).typeahead({
						hint      : true,
						highlight : true,
						minLength : 1
					}, {
						name       : 'dimensions',
						displayKey : 'value',
						source     : substringMatcher( dimensions ),
						templates  : {
							empty: [
								"<div class='no-acct'>",
						      	'No dimensions found for the specified date range.',
						      	'</div>'
							].join('\n')
						}
					}).on( 'typeahead:selected', function( $e, datum ) {
						$scope.form.dimension = datum.value;
					});
				}
			});
		};

		var toTime = function( secs ) {
			var sec_num = parseInt( secs, 10 );
			var hours   = Math.floor( sec_num / 3600 );
			var minutes = Math.floor( ( sec_num - ( hours * 3600 ) ) / 60 );
			var seconds = sec_num - ( hours * 3600 ) - ( minutes * 60 );

			if ( hours   < 10 ) { hours   = "0" + hours; }
			if ( minutes < 10 ) { minutes = "0" + minutes; }
			if ( seconds < 10 ) { seconds = "0" + seconds; }
			var time    = hours + ':' + minutes + ':' + seconds;

			return time;
		};

		var generate_stat_row = function( metric, value ) {
			var html = "<div class='tr'>";

			switch( metric ) {
				case 'Avg. Session Duration':
				case 'Avg. Time On Page':
					value = toTime( value );
				break;
				case 'Bounce Rate':
					value = parseFloat( value ).toFixed( 2 ) + '%';
				break;
				default:
					value = Math.round( value );
			}

			html += "<div class='td'><b>" + metric + "</b></div><div class='td'>" + value + '</div>';
			html += '</div>';

			return html;
		};

		var load_usage = function() {
			query({
				'method' : 'usage',
				'dimension': $scope.form.dimension
			}, function( data ) {
				var summary = "<div class='tbl style'>",
				    monthly = '';

				process_errors( data );

				// Summary
				angular.forEach( data.data.summary, function( value, metric ) {
					summary += generate_stat_row( metric, value );
				});
				summary += '</div>';
				$scope.summary = $sce.trustAsHtml( summary );

				// Monthly
				angular.forEach( data.data.monthly, function( obj, month ) {
					//$scope.chart_labels.push( month );

					monthly += "<div class='month'>";
			        monthly += '<h3>' + month + '</h3>';
			        monthly += "<div class='tbl style'>";
			        angular.forEach( obj, function( value, metric ) {
			        	switch( metric ) {
			        		case 'Users':
			        			//$scope.chart1_data[0].push( value );
			        		break;
			        		case 'Sessions':
			        			//$scope.chart1_data[1].push( value );
			        		break;
			        		case 'Sessions Per User':
			        			//$scope.chart1_data[2].push( value );
			        		break;
			        		case 'Avg. Session Duration':
			        			//$scope.chart2_data[0].push( value );
			        		break;
			        		case 'Avg. Time On Page':
			        			//$scope.chart2_data[1].push( value );
			        		break;
			        		case 'Bounce Rate':
			        			//$scope.chart3_data[0].push( value );
			        		break;
			        	}

			        	monthly += generate_stat_row( metric, value );
			        });
			        monthly += '</div></div>';
				});
				$scope.monthly = $sce.trustAsHtml( monthly );
			});
		};

		// Form processor.
		$scope.process = function() {
			load_dimensions();

			if( $scope.form.dimension ) {
				load_usage();
			}
		};
	});
})();