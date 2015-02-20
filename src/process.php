<?php
define( 'ROOT', dirname( __FILE__ ) );

/**
 * Include the helper class.
 */
require_once( ROOT . '/lib/helper.class.php' );

$return = array(
	'init_errors' => array(),
	'hard_errors' => array(),
	'soft_errors' => array(),
	'data'        => array()
);

// Required parameters.
$start_date = isset( $_POST['start_date'] ) ? $_POST['start_date'] : false;
$end_date = isset( $_POST['end_date'] ) ? $_POST['end_date'] : false;
$method = isset( $_POST['method'] ) ? $_POST['method'] : false;

// Define config array.
$config = array(
	'max_days' => isset( $_POST['max_days'] ) ? $_POST['max_days'] : false,
	'debug' => isset( $_POST['debug'] ) ? $_POST['debug'] : false,
	'cache' => isset( $_POST['cache'] ) ? $_POST['cache'] : false,
	'cache_sec' => isset( $_POST['cache_sec'] ) ? $_POST['cache_sec'] : false,
	'dimension' => isset( $_POST['dimension'] ) ? $_POST['dimension'] : false,
	'app_name' => isset( $_POST['app_name'] ) ? $_POST['app_name'] : false,
	'email' => isset( $_POST['email'] ) ? $_POST['email'] : false,
	'private_key_file' => isset( $_POST['private_key_file'] ) ? $_POST['private_key_file'] : false,
	'client_id' => isset( $_POST['client_id'] ) ? $_POST['client_id'] : false,
	'view_id' => isset( $_POST['view_id'] ) ? $_POST['view_id'] : false,
	'metrics' => isset( $_POST['metrics'] ) ? $_POST['metrics'] : false,
);

// Verify parameters.
if( ! $start_date ) $return['init_errors'][] = 'Missing start date.';
if( ! $end_date ) $return['init_errors'][] = 'Missing end date.';
if( ! $method ) $return['init_errors'][] = 'Missing method.';

foreach( $config as $key => $val ) {
	if( ! $val ) $return['init_errors'][] = 'Missing ' . $key . ' config.';
}

if( ! count( $return['init_errors'] ) ) {
	// Initialize the helper class.
	$Helper = new Helper( $config, $start_date, $end_date );

	switch( $method ) {
		case 'dimensions':
			$results = $Helper->get_dimensions();
			$return = array_merge( $return, $results );
		break;
		case 'usage':
			$dimension = isset( $_POST['dimension'] ) ? $_POST['dimension'] : false;

			if( $dimension ) {
				$results = $Helper->get_usage( $dimension );
				$return = array_merge( $return, $results );
			} else {
				$return['init_errors'][] = 'Missing account.';
			}
		break;
	}
}

echo json_encode( $return );