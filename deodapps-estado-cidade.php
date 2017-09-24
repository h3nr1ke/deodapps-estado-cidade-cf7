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
    wp_enqueue_script( 'deodapps-script', __ROOT__ . 'js/deodapps.js', array ( 'jquery' ), 0.1, true);
}
add_action( 'wp_enqueue_scripts', 'deodapps_eccf7_' );


//faz a consulta ao servico de laudos e retorna JSON...
add_action("wp_ajax_deodapps_get_cidade", "do_get_city");
add_action("wp_ajax_nopriv_deodapps_get_cidade", "do_get_city");

function do_get_city() {
    $estado = filter_input(INPUT_POST, 'estado', FILTER_SANITIZE_STRING);
    
    $response = ['asd' => "asdasd"];

    $json = json_encode($response);
    echo $json;
    exit();
}

// cria os campos extras
add_action( 'wpcf7_init', 'custom_fields' );
 
function custom_fields() {
    wpcf7_add_form_tag( 'destado', 'get_estados', array('name-attr' => true) ); 
    wpcf7_add_form_tag( 'dcidade', 'get_cidades', array('name-attr' => true) ); 
}
 
function get_estados( $tag ) {
  $brasil = new BrasilDB();
  $estados = $brasil->getEstados();
  $field = "<select id='deodapps-estado' class='wpcf7-form-control wpcf7-select'>";
  $field .= "<option value=''>Estado</option>";
  foreach ($estados as $key => $estado) {
    $field .= sprintf('<option value="%s">%s</option>',$key,$estado);
  }
  $field .= "</select>";
  return $field;
}

function get_cidades( $tag ) {  
  $field = "<select id='deodapps-cidade' class='wpcf7-form-control wpcf7-select'>";
  $estado_base = $tag->get_option('estado','',true);
  $field .= "<option value=''>Cidade</option>";
  if( $estado_base ){
    $brasil = new BrasilDB();
    $estados = $brasil->getCidades( strtoupper($estado_base) );
    foreach ($estados as $key => $estado) {
      $field .= sprintf('<option value="%s">%s</option>',$key,$estado);
    }
  }
  $field .= "</select>";
  return $field;
}

