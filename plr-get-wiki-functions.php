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

     // use version trick from: https://developer.wordpress.org/reference/functions/wp_enqueue_script/#comment-1558
     // create my version codes

            //  $my_css_ver = date("ymd-Gis", filemtime( plugin_dir_path( __FILE__ ) . 'style.css' ));


    $js_vers  = date("ymd-Gis", filemtime( plugin_dir_path( __FILE__ ) . 'js/wiki-summary-render.js' ));
    
     // Main Wikipedia fetch/renderer
    wp_register_script ( 'plr-wiki-area-render' , plugins_url('/js/wiki-summary-render.js', __FILE__) , false, $js_vers, true ); 
    // wp_localize_script( 'plr-wiki-area-render', 'plrAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' )));  
    wp_enqueue_script ( 'plr-wiki-area-render', plugins_url('/js/wiki-summary-render.js', __FILE__) , false, $js_vers, true  ); // no deps, ver, add in the footer
    }
    

    $js_vers  = date("ymd-Gis", filemtime( plugin_dir_path( __FILE__ ) . 'js/modules/funops.js' ));
    
    // Additional JS functions
    wp_register_script ( 'plr-funops' , plugins_url('/js/modules/funops.js', __FILE__) , false, $js_vers, true); 
    // wp_localize_script( 'plr-funops', 'plrAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' )));  
    wp_enqueue_script ( 'plr-funops', plugins_url('/js/modules/funops.js', __FILE__) , false, null, true  );  // no deps, ver, add in the footer
    
?>