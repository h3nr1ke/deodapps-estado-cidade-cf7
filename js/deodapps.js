var _doAjaxCall = function(tipo,url,data,cbsuccess,cberror) {
  jQuery.ajax({
    type: tipo,
    dataType:'json',
    url: url,
    data: data,
    complete: function() {
        //
    },
    success: cbsuccess,
    error: cberror
  });
};

var _bindLaudoEvents = function(){
    var defatulMessage = "Não foi possível realizar a consulta, por favor tente novamente mais tarde.";
    var form = jQuery('.form-laudo-supervisao form'); 

    _doAjaxCall("POST",_urlAutenticador,data,
        function(msg){
            //success
            if( "id_erro" in msg ){
                if( msg.id_erro > 0 ){
                    _displayErrorMessage(msg.desc_erro);
                }
                else{
                    //erro de ip... mostram mensagem generica...
                    _displayErrorMessage(defatulMessage);
                }
            }
            else{
                if( "id_laudo" in msg ){ //se tem este item esta ok a reposta...    
                    _updateScreenOptions(msg);
                }
                else{
                    _displayErrorMessage(defatulMessage);
                }
            }
        },
        function(a,b,c){
            //fail
            console.log(a);
            console.log(b);
            console.log(c);
        }
    );
    
};

var _bindTrabalheConosco = function(){
    if( jQuery(".form-trabalhe-conosco").length ){
        //jQuery('.form-trabalhe-conosco input[type="submit"]').unbind("click");
        jQuery(".form-trabalhe-conosco").validate({
            rules : {
                "your-name" : { required : true },
                "your-datadenascimento" : { required : true },
                "your-email" : { required : true, email : true },
                "your-telefonefixo" : { required : true },
                "your-telefonecelular" : { required : true },
                "your-endereco" : { required : true },
                "your-numero" : { required : true },
                //"your-complemento" : { required : true },
                "your-bairro" : { required : true },
                "your-cidade" : { required : true },
                "your-estado" : { required : true },
                "your-cep" : { required : true },
                "your-cargodesejado" : { required : true },
                "your-curriculo" : { required : true },
                "your-captcha" : { required : true }
            }
        });

    }
};

var _bindFranquias = function(){
    if( jQuery(".form-franquias").length ){
        //jQuery('.form-trabalhe-conosco input[type="submit"]').unbind("click");
        jQuery(".form-franquias").validate({
            rules : {
                "your-name" : { required : true },
                "your-email" : { required : true, email : true },
                "your-telefonefixo" : { required : true },
                "your-telefonecelular" : { required : true },
                "your-enderecocompleto" : { required : true },
                "your-datadenascimento" : { required : true },
                "your-captcha" : { required : true },
                "your-comoconheceu" : { required : true, notEqual : 'Como conheceu a Super Visão?' },
            },
            messages : {
                "your-comoconheceu" : { notEqual : 'Indique como conheceu' }
            }
        });
    }
};

var _bindContatoLateral = function(){
    if( jQuery(".form-contato-lateral").length ){
        //jQuery('.form-trabalhe-conosco input[type="submit"]').unbind("click");
        jQuery(".form-contato-lateral").validate({
            rules : {
                "your-name" : { required : true },
                "your-email" : { required : true, email : true },
                "your-telefone" : { required : true },
                "your-assunto" : { required : true },
                "your-mensagem" : { required : true },
                "your-captcha" : { required : true }
            }
        });

    }
};

var _bindContatoOverlay = function(){
    if( jQuery(".form-contato-overlay").length ){
        //jQuery('.form-trabalhe-conosco input[type="submit"]').unbind("click");
        jQuery(".form-contato-overlay").validate({
            rules : {
                "your-name" : { required : true },
                "your-email" : { required : true, email : true },
                "your-telefone" : { required : true },
                "your-assunto" : { required : true },
                "your-mensagem" : { required : true },
                "your-captcha" : { required : true }
            }
        });

    }
};

var _bindEntrarEmContato = function(){
    if( jQuery(".form-entrar-em-contato").length ){
        //jQuery('.form-trabalhe-conosco input[type="submit"]').unbind("click");
        jQuery(".form-entrar-em-contato").validate({
            rules : {
                "your-name" : { required : true },
                "your-email" : { required : true, email : true },
                "your-telefone" : { required : true },
                "your-assunto" : { required : true },
                "your-mensagem" : { required : true },
                "your-captcha" : { required : true }
            }
        });
    }
};

var _bindNews = function(){
    if( jQuery(".form-news").length ){
        //jQuery('.form-trabalhe-conosco input[type="submit"]').unbind("click");
        jQuery(".form-news").validate({
            rules : {
                "your-email" : { required : true, email : true }
            }
        });
    }
};

var _bindSearchAction = function(){
    if( jQuery(".busca-unidades-listagem").length ){
        var _estado = jQuery("#wpv_control_textfield_wpv-pc-estado").val();

        jQuery("#wpv_control_select_wpv-pc-estado-select").append('<option value="">Aguarde...</option>');
        jQuery("#wpv_control_select_wpv-pc-cidade-select").append('<option value=""></option>');

        _doAjaxCall("GET","/get-estados",{},function(msg){
            //success
            console.log(msg);
            _popuplateSelect("#wpv_control_select_wpv-pc-estado-select","Selecione o Estado",msg);
            if(_estado != ""){
                jQuery('#wpv_control_select_wpv-pc-estado-select option[value="'+_estado+'"]').attr("selected","selected");
                _searchCidade(_estado);
            }
        },function(msg){
            //error
            console.log(msg);
            _popuplateSelect("#wpv_control_select_wpv-pc-estado-select","Erro ao carregar",[]);
        });

        jQuery("#wpv_control_select_wpv-pc-estado-select").on("change",function(){
            _popuplateSelect("#wpv_control_select_wpv-pc-cidade-select","Aguarde...",[]);
            _searchCidade( jQuery("#wpv_control_select_wpv-pc-estado-select").val() );
            jQuery("#wpv_control_textfield_wpv-pc-estado").val(jQuery("#wpv_control_select_wpv-pc-estado-select").val());
            jQuery("#wpv_control_textfield_wpv-pc-cidade").val("");
        });

        jQuery("#wpv_control_select_wpv-pc-cidade-select").on("change",function(){
            jQuery("#wpv_control_textfield_wpv-pc-cidade").val(jQuery("#wpv_control_select_wpv-pc-cidade-select").val());
        });
    }
};

var _searchCidade = function(estado){
    var _cidade = jQuery("#wpv_control_textfield_wpv-pc-cidade").val();
    _doAjaxCall("GET","/get-cidades",{"estado":estado},function(msg){
        //success
        console.log(msg);
        _popuplateSelect("#wpv_control_select_wpv-pc-cidade-select","Selecione a Cidade",msg);
        if(_cidade != ""){
            jQuery('#wpv_control_select_wpv-pc-cidade-select option[value="'+_cidade+'"]').attr("selected","selected");
        }
    },function(msg){
        //error
        console.log(msg);
        _popuplateSelect("#wpv_control_select_wpv-pc-cidade-select","Erro ao carregar",[]);
    });
};

var _popuplateSelect = function(target,label,options){
    jQuery(target).empty();
    jQuery(target).append('<option value="">'+label+'</option>');
    jQuery.each(options,function(index,value){
        jQuery(target).append('<option value="'+value+'">'+value+'</option>');
    });
};

jQuery.validator.addMethod("notEqual", 
    function(value, element, param) {
        return this.optional(element) || value != param;
    }, 
    function(param, element) {
        return "Campo não pode ser '"+param+"'";
    }
);

var _urlAutenticador = '/wp-admin/admin-ajax.php'; //carregado dentro do plugin...

jQuery(document).ready(function(){

});