<?php
/**
 * Plugin Name: F1 Landing Cart Handoff
 * Description: Lets the Next.js landing page hand its Store API cart over to WooCommerce checkout.
 *
 * Install: copy this file to wp-content/mu-plugins/.
 */

add_action( 'template_redirect', function () {
	if ( empty( $_GET['f1_cart_token'] ) || ! function_exists( 'WC' ) ) {
		return;
	}

	$token = sanitize_text_field( wp_unslash( $_GET['f1_cart_token'] ) );
	$utils = '\Automattic\WooCommerce\StoreApi\Utilities\CartTokenUtils';

	if ( class_exists( $utils ) && $utils::validate_cart_token( $token ) ) {
		$payload = $utils::get_cart_token_payload( $token );
		$data    = WC()->session->get_session( $payload['user_id'] );

		if ( is_array( $data ) ) {
			foreach ( $data as $key => $value ) {
				WC()->session->set( $key, maybe_unserialize( $value ) );
			}
			// Remember which landing-page cart this came from, so it can be emptied once the order is placed.
			WC()->session->set( 'f1_cart_source', $payload['user_id'] );
			WC()->session->set_customer_session_cookie( true );
			WC()->cart->get_cart_from_session();
		}
	}

	wp_safe_redirect( wc_get_checkout_url() );
	exit;
} );

// After a successful order, empty the landing page's cart too, so shoppers who go back don't see
// what they just bought still sitting in it.
add_action( 'woocommerce_thankyou', function () {
	if ( ! function_exists( 'WC' ) || ! WC()->session ) {
		return;
	}
	$source = WC()->session->get( 'f1_cart_source' );
	if ( $source ) {
		WC()->session->delete_session( $source );
		WC()->session->set( 'f1_cart_source', null );
	}
} );
