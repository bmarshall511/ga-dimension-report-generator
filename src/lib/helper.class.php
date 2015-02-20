<?php
/**
 * Include the GA API class.
 */
require_once( ROOT . '/lib/GA_API.class.php' );

class Helper {
	var $config;
	var $start_date;
	var $end_date;
	var $Cache;
	var $GA_API;

	public function __construct( $config, $start_date, $end_date ) {
		$this->start_date = $start_date;
		$this->end_date = $end_date;
		$this->config = $config;

		$this->config['cache'] = $this->config['cache'] == 'false' ? false : true;
		$this->config['debug'] = $this->config['debug'] == 'false' ? false : true;

		// Initialize the GA API.
		$this->GA_API = new GA_API( $this->config );

		// Load the cache class if caching is enabled.
		if( $this->config['cache'] ) {
			/**
		     * Include the caching library.
		     */
  			require_once( ROOT . '/lib/CacheBlocks.php' );

  			// Initialize the caching class.
  			$this->Cache = new CacheBlocks( ROOT . '/cache/', $this->config['cache_sec'] );
		}
	}

	public function get_dimensions() {
		$return = array(
			'init_errors' => array(),
			'hard_errors' => array(),
			'soft_errors' => array(),
			'data'        => array()
		);

		// GA API arguments.
		$args = array(
			'metrics' => 'ga:users',
			'sort'    => 'ga:dimension' . $this->config['dimension']
		);

		// Make the GA API call.
		$results = $this->_call( $args );

		// Parse the results.
		if( count( $results['queries'] ) ) {
			foreach( $results['queries'] as $range => $query ) {
				$return['init_errors'] = array_merge( $return['init_errors'], $query['init_errors'] );
				$return['soft_errors'] = array_merge( $return['soft_errors'], $query['soft_errors'] );

				foreach( $query['data'] as $key => $ary ) {
					$return['data'][] = $ary[0];
				}
			}
		}

		return $return;
	}

	public function get_usage( $dimension ) {
		$metrics     = explode( ',', $this->config['metrics'] );
    $num_metrics = count( $metrics );

		$return = array(
			'init_errors' => array(),
			'hard_errors' => array(),
			'soft_errors' => array(),
			'data'        => array(
				'summary' => array(),
				'monthly' => array()
			)
		);

		// GA API arguments.
		$args = array(
			'metrics' => $this->config['metrics'],
            'filters' => 'ga:dimension' . $this->config['dimension'] . '==' . $dimension
		);

		// Make the GA API call.
		$results = $this->_call( $args );

		// Parse the results.
		if( count( $results['queries'] ) ) {
			foreach( $results['queries'] as $range => $query ) {
				$date  = $this->_parse_range( $range );
				$month = date( 'F Y', $date['start_date'] );

				$return['init_errors'] = array_merge( $return['init_errors'], $query['init_errors'] );
				$return['soft_errors'] = array_merge( $return['soft_errors'], $query['soft_errors'] );

				if( count( $query['data'] ) ) {
					foreach( $query['data'] as $key => $ary ) {
						// Remove account name.
	        			array_shift( $ary );

	        			// Rename the keys to metric names.
	        			foreach( $ary as $k => $v ) {
	        				$metric_txt = $this->_metric2txt( $metrics[$k] );

	        				// Summary
							if( ! isset( $return['data']['summary'][$metric_txt] ) ) $return['data']['summary'][$metric_txt] = 0;
							switch( $metric_txt ) {
					            case 'Sessions Per User':
					            case 'Avg. Session Duration':
					            case 'Bounce Rate':
					            case 'Avg. Time On Page':
					            	$return['data']['summary'][$metric_txt] = ( $return['data']['summary'][$metric_txt] + $v ) / 2;
					            break;
					            default:
					            	$return['data']['summary'][$metric_txt] += $v;
					        }

					        // Monthly
					        if( ! isset( $return['data']['monthly'][$month][$metric_txt] ) ) $return['data']['monthly'][$month][$metric_txt] = 0;
					        switch( $metric_txt ) {
					            case 'Sessions Per User':
					            case 'Avg. Session Duration':
					            case 'Bounce Rate':
					            case 'Avg. Time On Page':
					            	$return['data']['monthly'][$month][$metric_txt] = ( $return['data']['monthly'][$month][$metric_txt] + $v ) / 2;
					            break;
					            default:
					            	$return['data']['monthly'][$month][$metric_txt] += $v;
					        }
	        			}
					}
				} else {
					$return['soft_errors'][] = date( 'F j, Y', $date['start_date'] ) . ' - ' . date( 'F j, Y', $date['end_date'] ) . ': No data available.';
				}
			}
		}

		return $return;
	}

	private function _metric2txt( $metric ) {
		switch( $metric ) {
			case 'ga:users':
				return 'Users';
			break;
			case 'ga:sessions':
				return 'Sessions';
			break;
			case 'ga:sessionsPerUser':
				return 'Sessions Per User';
			break;
			case 'ga:avgSessionDuration':
				return 'Avg. Session Duration';
			break;
			case 'ga:bounceRate':
				return 'Bounce Rate';
			break;
			case 'ga:pageviews':
				return 'Pageviews';
			break;
			case 'ga:uniquePageviews':
				return 'Unique Pageviews';
			break;
			case 'ga:avgTimeOnPage':
				return 'Avg. Time On Page';
			break;
		}
	}

	private function _parse_range( $range ) {
		$return = array();
	    list( $return['start_date'], $return['end_date'] ) = explode( '-', $range );

	    return $return;
	}

	private function _call( $args ) {
		$return = array();

		$args['start_date'] = $this->start_date;
		$args['end_date']   = $this->end_date;
		$args['dimensions'] = 'ga:dimension' . $this->config['dimension'];

		if( $this->config['cache'] ) {
			if( ! $return = $this->Cache->Load( $this->_cache_file( $args ) ) ) {
				$return = $this->GA_API->call( $args );

				if( count( $return['queries'] ) ) {
					$this->Cache->Save( $return, $this->_cache_file( $args ) );
				}
			}
		} else {
			$return = $this->GA_API->call( $args );
		}

		return $return;
	}

	private function _cache_file( $args ) {
		$string = '';

	    foreach( $args as $key => $val ) {
	      switch( $key ) {
	        case 'start_date':
	        case 'end_date':
	          $string .= date( 'Ymd', strtotime( $val ) );
	        break;
	        case 'dimensions':
	        case 'metrics':
	        case 'filters':
	          $string .= str_replace( array( ':', '=', ',' ), '', $val );
	        break;
	      }
	    }

	    return $string;
	}
}