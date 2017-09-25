<?php

/*
Plugin Name: Deodapps Estado Cidade CF7 
Plugin URI:  https://deodapps.com/plugins/deodapps-estado-cidade-cf7
Description: Adiciona os campos estado e cidade para serem usados no CF7
Version:     0.0.1
Author:      Henrique Deodato
License:     GPL
License URI: https://deodapps.com/license.txt
Text Domain: Deodapps
*/

// ----- DEFINES
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );
define('__ROOT__', plugin_dir_url( __FILE__ ));

// ----- INCLUDES
require_once('brasil.php'); 


add_filter( 'wpcf7_validate_configuration', '__return_false' );

function deodapps_eccf7_add_theme_scripts() {
    wp_enqueue_style( 'style', get_stylesheet_uri() );
    wp_enqueue_style( 'deodapps-style', __ROOT__ . 'css/deodapps.css', array(), '0.1', 'all');
    wp_enqueue_script( 'deodapps-script', __ROOT__ . 'js/deodapps-cf7.js', array ( 'jquery' ), 0.1, true);
    wp_localize_script( 'deodapps_script-1', 'myAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' )));
}
add_action( 'wp_enqueue_scripts', 'deodapps_eccf7_add_theme_scripts' );


add_action ( 'wp_head', 'my_js_variables' );
function my_js_variables(){ 
 ?>
  <script type="text/javascript">
    var _ajaxurl = <?php echo json_encode( admin_url( "admin-ajax.php" ) ); ?>;      
    var _ajaxnonce = <?php echo json_encode( wp_create_nonce( "itr_ajax_nonce" ) ); ?>;
  </script>
  <?php
}

//faz a consulta ao servico de laudos e retorna JSON...
add_action("wp_ajax_deodapps_get_cidades", "do_get_cidades");
add_action("wp_ajax_nopriv_deodapps_get_cidades", "do_get_cidades");

function do_get_cidades() {
    $estado = filter_input(INPUT_POST, 'estado', FILTER_SANITIZE_STRING);
    
    $cidades = [];
    if($estado){
      $brasil = new BrasilDB();
      $cidades = $brasil->getCidades( strtoupper($estado) );
    }

    wp_send_json($cidades);
    wp_die();
}

// cria os campos extras
add_action( 'wpcf7_init', 'custom_fields' );
 
function custom_fields() {
    wpcf7_add_form_tag( 'destadocidade', 'get_estados_cidades', array('name-attr' => true) );
    wpcf7_add_form_tag( 'destado', 'get_estados', array('name-attr' => true) );
    wpcf7_add_form_tag( 'dcidade', 'get_cidades', array('name-attr' => true) );
}

function get_estados_cidades( $tag ){
  $estados = get_estados($tag, true);
  $cidades = get_cidades($tag, true);

  $wrapper = '<div class="deodapps-estado-cidade-auto">';
  $wrapper .= '<p class="deodapps-estado-auto">';
  $wrapper .= $estados;
  $wrapper .= '</p">';
  $wrapper .= '<p class="deodapps-cidade-auto">';
  $wrapper .= $cidades;
  $wrapper .= '</p">';
  $wrapper .= '</div">';

  return $wrapper;
}
 
function get_estados( $tag = null, $double = false ) {

  $brasil = new BrasilDB();
  $estados = $brasil->getEstados();

  $tag_name = "";
  if ( $double ){
    $tag_name_suffix = "-estado";
  }
  $atts = array(
    'name' => $tag->name.$tag_name_suffix,
    'class' => "deodapps-estado wpcf7-form-control wpcf7-select",
  );

  $field = sprintf(
    '<select %s >',
    wpcf7_format_atts( $atts ) 
  );

  $field .= "<option value=''>Estado</option>";
  foreach ($estados as $key => $estado) {
    $field .= sprintf('<option value="%s">%s</option>',$key,$estado);
  }
  $field .= "</select>";
  return $field;
}

function get_cidades( $tag = null , $double = false ) {  
  $tag_name = "";
  if ( $double ){
    $tag_name_suffix = "-cidade";
  }
  $atts = array(
    'name' => $tag->name.$tag_name_suffix,
    'class' => "deodapps-cidade wpcf7-form-control wpcf7-select",
  );

  $field = sprintf(
    '<select %s >',
    wpcf7_format_atts( $atts ) 
  );

  if($tag != null){
    $estado_base = $tag->get_option('estado','',true);
    $field .= "<option value=''>Cidade</option>";
    if( $estado_base ){
      $brasil = new BrasilDB();
      $cidades = $brasil->getCidades( strtoupper($estado_base) );
      foreach ($cidades as $key => $cidade) {
        $field .= sprintf('<option value="%s">%s</option>',$key,$cidade);
      }
    }
  }
  $field .= "</select>";
  return $field;
}

