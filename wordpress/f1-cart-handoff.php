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
			WC()->session->set_customer_session_cookie( true );
			WC()->cart->get_cart_from_session();
		}
	}

	wp_safe_redirect( wc_get_checkout_url() );
	exit;
} );
