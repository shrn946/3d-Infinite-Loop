<?php
/**
 * Plugin Name: Simple Loop Scrolling Gallery Wordpress
 * Description: Advanced gallery manager using WordPress Media Library. Shortcode: [simple_gallery_scroller]. Supports multiple images, preview, remove, reorder.
 * Version: 3.3
 * Author: WP DESIGN LAB
 */

if (!defined('ABSPATH')) exit;

define('SGL_URL', plugin_dir_url(__FILE__));

/*-----------------------------------
 * Front-end gallery shortcode
 *-----------------------------------*/
function sgl_display_scroller($atts) {
    $atts = shortcode_atts([
        'columns' => 3,
    ], $atts, 'simple_gallery_scroller');

    $image_ids = get_option('sgl_gallery_images', []);

    // If empty, show no images
    if (empty($image_ids)) return '<p>No images in gallery.</p>';

    $output = '<div class="loading">
        <main>
            <div class="grid">';

    foreach ($image_ids as $id) {
        $url = wp_get_attachment_url($id);
        if ($url) {
            $output .= '<div class="grid__item" style="background-image:url('.esc_url($url).');"></div>';
        }
    }

    $output .= '</div>
        </main>
    </div>';

    // Enqueue CSS & JS
    wp_enqueue_style('sgl-base-css', SGL_URL . 'css/base.css');
    wp_enqueue_script('lenis-js', 'https://cdn.jsdelivr.net/gh/studio-freight/lenis@0.2.28/bundled/lenis.js', [], null, true);
    wp_enqueue_script('gsap-js', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js', [], null, true);
    wp_enqueue_script('scrolltrigger-js', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js', ['gsap-js'], null, true);
    wp_enqueue_script('imagesloaded-js', 'https://unpkg.com/imagesloaded@5/imagesloaded.pkgd.min.js', [], null, true);
    wp_enqueue_script('sgl-index-js', SGL_URL . 'js/index.js', ['lenis-js','gsap-js','scrolltrigger-js','imagesloaded-js'], null, true);

    return $output;
}
add_shortcode('simple_gallery_scroller', 'sgl_display_scroller');

/*-----------------------------------
 * Admin menu
 *-----------------------------------*/
function sgl_admin_menu() {
    add_menu_page('Simple Gallery', 'Simple Gallery', 'manage_options', 'sgl-gallery', 'sgl_admin_page', 'dashicons-format-gallery', 6);
}
add_action('admin_menu', 'sgl_admin_menu');

/*-----------------------------------
 * Admin page HTML
 *-----------------------------------*/
function sgl_admin_page() {
    $image_ids = get_option('sgl_gallery_images', []);
    ?>
    <div class="wrap">
        <h1>Simple Gallery Manager</h1>
        <button class="button button-primary" id="sgl-select-images">Select Images from Media Library</button>

        <div id="sgl-gallery-list" style="margin-top:20px; display:flex; flex-wrap:wrap;">
            <?php
            if (!empty($image_ids)) {
                foreach ($image_ids as $id) {
                    $url = wp_get_attachment_url($id);
                    if ($url) {
                        echo '<div class="sgl-item-admin" data-id="'.esc_attr($id).'" style="margin:5px; text-align:center;">';
                        echo '<img src="'.esc_url($url).'" style="width:100px;height:100px;object-fit:cover;"><br>';
                        echo '<button class="button sgl-remove-btn">Remove</button>';
                        echo '</div>';
                    }
                }
            }
            ?>
        </div>
        <button class="button button-primary" id="sgl-save-gallery" style="margin-top:20px;">Save Gallery</button>
    </div>
    <?php
}

/*-----------------------------------
 * Enqueue admin scripts
 *-----------------------------------*/
function sgl_admin_scripts($hook) {
    if ($hook != 'toplevel_page_sgl-gallery') return;

    wp_enqueue_media(); // Media library
    wp_enqueue_script('jquery-ui-sortable');
    wp_enqueue_script('sgl-admin-js', SGL_URL . 'js/admin.js', ['jquery','jquery-ui-sortable'], null, true);
    wp_enqueue_style('sgl-admin-css', SGL_URL . 'css/admin.css');

    wp_localize_script('sgl-admin-js', 'sgl_ajax_obj', [
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('sgl_nonce')
    ]);
}
add_action('admin_enqueue_scripts', 'sgl_admin_scripts');

/*-----------------------------------
 * AJAX Save Gallery (allow empty gallery)
 *-----------------------------------*/
function sgl_ajax_save_gallery() {
    check_ajax_referer('sgl_nonce', 'nonce');

    $image_ids = isset($_POST['image_ids']) && is_array($_POST['image_ids']) ? array_map('intval', $_POST['image_ids']) : [];
    update_option('sgl_gallery_images', $image_ids); // Save even if empty

    wp_send_json_success( empty($image_ids) ? 'Gallery cleared!' : 'Gallery saved!');
}
add_action('wp_ajax_sgl_save_gallery', 'sgl_ajax_save_gallery');
