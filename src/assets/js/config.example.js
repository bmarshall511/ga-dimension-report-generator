// Configuration variables.
var config = {
	'report_name'      : 'GA Dimension Report Generator',
	'max_days'         : 7,
	'debug'            : true,
	'cache'            : true,
	'cache_sec'        : 86400,
	'dimension'        : 1,
	'metrics'          : 'ga:users,ga:sessions,ga:sessionsPerUser,ga:avgSessionDuration,ga:bounceRate,ga:pageviews,ga:uniquePageviews,ga:avgTimeOnPage',
	'app_name'         : '',
	'email'            : '',
	'private_key_file' : 'googlecert.p12',
	'client_id'        : '',
	'view_id'          : '',
	'start_date'       : new Date(),
	'end_date'         : new Date()
};

// Set the start date max_days from yesterday.
config.start_date.setDate( config.start_date.getDate() - ( config.max_days + 1 ) );

// Set the end date to yesterday.
config.end_date.setDate( config.end_date.getDate() - 1 );