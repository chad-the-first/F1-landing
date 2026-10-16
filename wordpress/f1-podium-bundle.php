<?php
/**
 * Plugin Name: F1 Podium Bundle
 * Description: One podium free for every three driver figures in the cart, shown as a discount line.
 *
 * Install: copy this file to wp-content/mu-plugins/. The slugs must match src/lib/bundle.ts.
 */

const F1_PODIUM_SLUG          = 'podium-display';
const F1_BUNDLE_FIGURE_SLUGS  = array( 'lando-norris-figure', 'lewis-hamilton-figure', 'max-verstappen-figure' );

add_action( 'woocommerce_cart_calculate_fees', function ( WC_Cart $cart ) {
	$figures      = 0;
	$podiums      = 0;
	$podium_price = 0.0;

	foreach ( $cart->get_cart() as $line ) {
		$product = $line['data'];
		$slug    = $product->get_parent_id() ? get_post_field( 'post_name', $product->get_parent_id() ) : $product->get_slug();
		if ( in_array( $slug, F1_BUNDLE_FIGURE_SLUGS, true ) ) {
			$figures += $line['quantity'];
		} elseif ( F1_PODIUM_SLUG === $slug ) {
			$podiums     += $line['quantity'];
			$podium_price = (float) $product->get_price();
		}
	}

	$free = min( $podiums, intdiv( $figures, 3 ) );
	if ( $free > 0 ) {
		$cart->add_fee( 'Podium bundle: podium free', -$podium_price * $free, false );
	}
} );
