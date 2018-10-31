<?php
/* BOILERPLATES & LEFTOVERS AHEAD */

// if (( $pagenow == 'admin.php') ) // && ($href_url_a == 'page=symbiostock-xtra/syxtra-admin-menu.php_SLAM')
//     {
//     }   

add_action( 'admin_init', 'plrWiki_in_post_edit_display');

function plrWiki_in_post_edit_display()
{
    add_action('admin_footer', 'plrWiki_myfunction'); 
    // add_action('wp_footer', 'plr_myfunction');
    // $_wiki_area_html = file_get_contents( plugin_dir_path(__FILE__).'inc/wiki-summary-area.php');    
    // return $_wiki_area_html;
}

function plrWiki_myfunction() { 
    wp_register_script ( 'plr-wiki-area-render' , plugins_url('/js/wiki-summary-render.js', __FILE__) , array('jquery')); // this last part-( array('jquery') )is added in case your script needs to be included after jquery
    wp_localize_script( 'plr-wiki-area-render', 'plrAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' )));  
    wp_enqueue_script ( 'plr-wiki-area-render', plugins_url('/js/wiki-summary-render.js', __FILE__) , array('jquery'), '1.3', true  ); // then print. it will be added after jquery is added
    }            



?>