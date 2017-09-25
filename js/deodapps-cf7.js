
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

var _getCidades = function(estado,target){
    var defatulMessage = "Não foi possível realizar a consulta, por favor tente novamente mais tarde.";

    var data = {
        action : "deodapps_get_cidades",
        estado : estado
        //estado : jQuery(y('select#deodapps-estado').val()
    };

    _popuplateSelect(target,"Aguarde...",[]);

    _doAjaxCall("POST",_ajaxurl,data,
        function(msg){
            //success, vamos popular o campo...
            _popuplateSelect(target,"Selecione a Cidade",msg);
            
        },
        function(a,b,c){
            _popuplateSelect(target,"Erro ao carregar...",[]);
        }
    );
};

var _popuplateSelect = function(target,label,options){
    target.empty();
    target.append('<option value="">'+label+'</option>');
    jQuery.each(options,function(index,value){
        target.append('<option value="'+value+'">'+value+'</option>');
    });
};

var _bindAutomatico = function(){
    if( jQuery(".deodapps-estado-cidade-auto").length ){
        jQuery(".deodapps-estado-cidade-auto .deodapps-estado-auto select").on("change",function(){
            //pega o parent..
            var _p = jQuery(this).closest(".deodapps-estado-cidade-auto");
            _getCidades(jQuery(this).val(),_p.find(".deodapps-cidade-auto select"));
        });
    }
};

jQuery(document).ready(function(){
    // se existir algum, faz o bind...
    _bindAutomatico();
});