<?php
/*
Plugin Name: Get Wiki - Get This Wikipedia Summary
Plugin URI: https://plrang.com/projects/
Description: Wordpress plugin allowing to fetch/choose/store Wikipedia's article summary into the post. Using that weird W API
Author: Plrang
Author URI: https://plrang.com/
Version: 1.0.0
License: GNU General Public License v2.0 or later
License URI: http://www.opensource.org/licenses/gpl-license.php
*/

/*
Copyright 2018 Plrang Art (email : gws(AT)plrang.com)
It's just a working proof of concept, under a continuous development
Using: https://codex.wordpress.org/Widgets_API

@TODO: use more CSS variables
@TODO: configurable CSS/theming in the WP widget (started)
@TODO: different language support
@TODO: add clearing snippet fields - button
@TODO: we don't use jQuery - need to check out some calls left in the code (related to the Wordpress not the plugin)
@FIX: folding the snippet input fields
*/

/*
* Register with hook 'wp_enqueue_scripts', which can be used for front end CSS and JavaScript
*/

include 'plr-get-wiki-functions.php';

add_action( 'add_meta_boxes', 'plrWiki_meta_box_add' );
add_action( 'save_post', 'plrWiki_meta_box_save' );


function plrWiki_meta_box_add()
{
    $_screens = array( 'post', 'page', 'image' );
    add_meta_box( 'plrWiki-area-id', 'PLR GET WIKIPEDIA SUMMARY', 'plrWiki_meta_box_echo', $_screens, 'normal', 'high' );
}


function plrWiki_meta_box_echo()
{

        // We'll use this nonce field later on when saving.
    if ( function_exists('wp_nonce_field') )         
       wp_nonce_field( 'my_meta_box_nonce', 'meta_box_nonce' ); 
        
        //$example_stored_meta = get_post_meta( $post->ID );    
        $_meta = get_post_custom( $post->ID );
        
        // temporary test value
        // $_plrWikiQueryTerm = "Mars rocket"; 
        
        $_plrWikiSummary = isset( $_meta['plrWiki-summary-opt'] ) ? esc_attr( $_meta['plrWiki-summary-opt'][0] ) : "";      // set the input fields empty if the summary not yet in WP DB
        $_plrWikiSummaryTitle = isset( $_meta['plrWiki-summary-title-opt'] ) ? esc_attr( $_meta['plrWiki-summary-title-opt'][0] ) : "";  
        $_plrWikiSummaryUrl = isset( $_meta['plrWiki-summary-url-opt'] ) ? esc_attr( $_meta['plrWiki-summary-url-opt'][0] ) : "";  
            
        ?>

<article id="plrWiki-summary-loader">

<section id="header-main">
<h1>Snippet</h1>
<button id="menu-hide-btn" class="btn" type="button"></button>
</section>

<section id="plrWiki-snippet">
<label>Selected snippet fields: title, summary, URL</label>
<input  class="widefat" 
    id="plrWiki-summary-title" name="plrWiki-summary-title" type="text" value="<?php echo $_plrWikiSummaryTitle; ?>" /> 

<textarea class="widefat" 
    id="plrWiki-summary" name="plrWiki-summary" type="text" rows="4"><?php echo $_plrWikiSummary; ?></textarea>

<input  class="widefat" 
    id="plrWiki-summary-url" name="plrWiki-summary-url" type="text" value="<?php echo $_plrWikiSummaryUrl; ?>" />             

</section>    

<section >
<label for="plrWiki-query-term" >Search and choose by clicking the summary title</label> 

<div id="plrWiki-queryask-area" >
    <input id="plrWiki-query-term" name="plrWiki-query-term" type="text" 
        value="<?php //echo $_plrWikiQueryTerm; ?>"  placeholder="?"  autofocus  /> 

    <select id="plrWiki-lang-select">
    <option value="pl">PL</option>
    <option value="en" selected>EN</option>
    </select>

        &nbsp;<input type="button" value="Search" id="plrWiki-fetch-summary" class="button">


</div>
</section>

<section id="plrWiki-switches" title="Search this web service">

<button value="wikipedia.org" id="plrWiki-switch-pedia" class="button btn-num-1">WIKIPEDIA</button>
    <button value="commons.wikimedia.org" id="plrWiki-switch-media" class="button btn-num-2">MEDIA</button>
            <button value="wikibooks.org" id="plrWiki-switch-books" class="button btn-num-3">BOOKS</button>
                <button value="wikinews.org" id="plrWiki-switch-news" class="button btn-num-4">NEWS</button>
                        <button value="wikiquote.org" id="plrWiki-switch-quote" class="button btn-num-5">QUOTES</button>
                            <button value="wikisource.org" id="plrWiki-switch-source" class="button btn-num-6">SOURCES</button>
                                
                                <button value="wiktionary.org" id="plrWiki-switch-wiktionary" class="button btn-num-7">DICTIONARY</button>
                            <button value="wikivoyage.org" id="plrWiki-switch-wikivoyage" class="button btn-num-8">VOYAGE</button>                                            
                        <button value="wikiversity.org" id="plrWiki-switch-wikiversity" class="button btn-num-9">UNIVERSITY</button>                                    

</section>


<section>
<div class="plrWiki-payload">Waiting...</div>
</section>

</article>
  
    
<?php

}


function plrWiki_meta_box_save( $post_id )
{

        // Bail if we're doing an auto save  
    if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return; 
     
        // if our nonce isn't there, or we can't verify it, bail 
    if( !isset( $_POST['meta_box_nonce'] ) || !wp_verify_nonce( $_POST['meta_box_nonce'], 'my_meta_box_nonce' ) ) return; 
     
        // if our current user can't edit this post, bail  
    if( !current_user_can( 'edit_post' ) ) return;
    
    
 // Make sure your data is set before trying to save it wp_kses not used this time because no html tags  
    if( isset( $_POST['plrWiki-summary'] ) )  
        update_post_meta( $post_id, 'plrWiki-summary-opt', sanitize_text_field($_POST['plrWiki-summary'] ) );        
    
    if( isset( $_POST['plrWiki-summary-title'] ) )  
        update_post_meta( $post_id, 'plrWiki-summary-title-opt', sanitize_text_field($_POST['plrWiki-summary-title'] ) );                
    
    if( isset( $_POST['plrWiki-summary-url'] ) )  
        update_post_meta( $post_id, 'plrWiki-summary-url-opt', sanitize_text_field($_POST['plrWiki-summary-url'] ) );        

}


// ADMIN: plugin style-file

function load_custom_wp_admin_style($hook) {
    
    // load admin CSS only on the post page 
    // may be changed in the future
    
    if('post.php' != $hook ) {
            return;
    }
    wp_enqueue_style( 'custom_wp_admin_css', plugins_url('plr_get_wiki.css', __FILE__) );
}

add_action( 'admin_enqueue_scripts', 'load_custom_wp_admin_style' );


// POST content: plugin style-file

function plr_get_wiki_CSS() {
    // Respects SSL, style.css is relative to the current file
    wp_register_style( 'plrWikiCSS', plugins_url('plr_get_wiki.css', __FILE__) );
    wp_enqueue_style( 'plrWikiCSS' );
}
add_action( 'wp_enqueue_scripts', 'plr_get_wiki_CSS' );


//add_filter( 'wp_feed_cache_transient_lifetime', create_function( '$a', 'return 36000;' ) );



add_filter('the_content','plrWiki_displaySummary');

function plrWiki_displaySummary($the_content) {

    global $post; 
    $postID = $post->ID;

    if( is_singular() && is_main_query() && (('post' == get_post_type()) || ('image' == get_post_type())  || ('page' == get_post_type()) ) ) 
        {


        $summaryKey = 'plrWiki-summary-opt';
        $summary = get_post_meta($postID, $summaryKey, true);

        $summaryTitleKey = 'plrWiki-summary-title-opt';
        $summaryTitle = get_post_meta($postID, $summaryTitleKey, true);

        $summaryURLKey = 'plrWiki-summary-url-opt';
        $summaryURL = get_post_meta($postID, $summaryURLKey, true);
        $summaryURL = '<a href="' .$summaryURL. '" target="_blank" rel="noopener">' .$summaryURL. "</a>";
        
         
        // if( !user_can( wp_get_current_user() , 'manage_options'))
        // {
            if($summary!==''){
                $_wiki_area_html = file_get_contents( plugin_dir_path(__FILE__).'inc/wiki-summary-area.php');    

                $_wiki_area_html =  preg_replace( "/{{SUMMARY}}/si", $summary, $_wiki_area_html );
                $_wiki_area_html =  preg_replace( "/{{TITLE}}/si", $summaryTitle, $_wiki_area_html );
                $_wiki_area_html =  preg_replace( "/{{URL}}/si", $summaryURL, $_wiki_area_html );
        
                $the_content = $the_content.$_wiki_area_html;

            }

        // }   
       
        }

    
return $the_content;
}





if ( !class_exists( 'PLR_get_wiki' ))
{
    class PLR_get_wiki
    {
        public $html = "No wiki data available";
        function PLR_get_wiki ()
        {
            //  add_action( 'template_redirect', array( &$this, 'get_thumbs' ) );
        }

} // class


$_plrWiki = new PLR_get_wiki();

} // if


// include_once 'PLR_get_wiki_adm_widget.php';




// Add an active shortcode inside the post or a widget
// NOT YET TESTED - boilerplate leftover

add_action( 'init', 'plrWiki_reg_shortcode');

function plrWiki_reg_shortcode(){
   add_shortcode('getwiki', 'plrWiki_shortcode');
}


function plrWiki_shortcode ( $atts )
{
    global $SY_PLR_get_wiki;

    extract( shortcode_atts( array(
      'cnt' => 1,
      'sort' => 'desc',
      'url' => '',
      'style' => 'default', /* predefined layout styles */
      'theme' => 'off'     /* quick theme force CSS dark or light - default in the shortcode is OFF */
   ), $atts));


    /*
    if ( !empty( $include ))
        $include = ( $_t = explode (",", $include)) ? $_t : array ($include);
        else
            $include = false;    // FROM DEBUG
            $exclude = ( $_t = explode (",", $exclude)) ? $_t : array ($exclude);

    if ($use_shape)
        $SY_PLR_latest_thumbs->_shape_in_shortcode = $use_shape;
    else
        $SY_PLR_latest_thumbs->_shape_in_shortcode = 'square';
    */

   $_html =  "";

   if ($_html !== "")
    {
       $_html = $_html;
    }
   else {
       $_html = 'Wiki processing error - no items?';
   }

   return $_html;
}


?>