/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  var contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });
  this.modelo.preguntaBorrada.suscribir(function(){
    contexto.reconstruirLista();
  });
  this.modelo.preguntaVotada.suscribir(function(){
    contexto.reconstruirLista();
  });
  this.modelo.preguntaGuardada.suscribir(function(){
    contexto.reconstruirLista();
  });
};

VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.reconstruirLista();
    this.configuracionDeBotones();
    validacionDeFormulario();
  },

  construirElementoPregunta: function(pregunta){
    var contexto = this;
    var nuevoItem;
    // completar
    //asignar a nuevoitem un elemento li con clase "list-group-item", id "pregunta.id" y texto "pregunta.textoPregunta"
    var nuevoItem = $('<li>', {class: "list-group-item",id: pregunta.id,text: pregunta.textoPregunta});
    var interiorItem = $('.d-flex');
    var titulo = interiorItem.find('h5');
    titulo.text(pregunta.textoPregunta);
    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp.textoRespuesta;
    }));
    nuevoItem.html($('.d-flex').html());
    return nuevoItem;
  },

  reconstruirLista: function() {
    var lista = this.elementos.lista;
    lista.html('');
    var preguntas = this.modelo.cargarPreguntas();
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  encolarRespuestas: function(respuestas){
    $('[name="option[]"]').each(function() {
      //completar
      if ($(this).val() != "") {
        var respuesta = $(this).val();
        respuestas.push({"textoRespuesta": respuesta, "cantidad": 0})
      };
    });
  },

  reconfigurarRespuestas: function(lista_respuestas){
    for(var i = 0; i < lista_respuestas.length; i++){
      if(i == 0){
        document.getElementById("input-respuesta").value = lista_respuestas[i];
      }else{
        document.getElementById('agregar-respuesta').click();
        document.getElementsByClassName('form-group answer has-feedback')[i-1].className = "form-group answer has-feedback has-success";
        document.getElementsByName("option[]")[i].value = lista_respuestas[i];
      };
    };
  },

  configuracionDeBotones: function(){
    var e = this.elementos;
    var contexto = this;

    //asociacion de eventos a boton
    e.botonAgregarPregunta.click(function() {
      var value = e.pregunta.val();
      var respuestas = [];
      contexto.encolarRespuestas(respuestas);
      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);
    });
    //asociar el resto de los botones a eventos
    e.botonBorrarPregunta.click(function(){
      var pregunta = $('#lista li.list-group-item.active .mb-1').text();
      var preguntaABorrar = contexto.modelo.preguntas.find(preg => preg.textoPregunta == pregunta);
      contexto.controlador.borrarPregunta(preguntaABorrar);
    });

    e.botonEditarPregunta.click(function(){
      var pregunta = $('#lista li.list-group-item.active .mb-1').text();
      var respuesta = $('#lista li.list-group-item.active small').text();
      contexto.controlador.borrarPregunta(contexto.controlador.obtenerPregunta(pregunta));
      document.getElementById("pregunta").value = pregunta;
      var lista_respuestas = respuesta.split(",");
      contexto.reconfigurarRespuestas(lista_respuestas);
    });

    e.borrarTodo.click(function(){
      while(contexto.modelo.preguntas.length != 0){
        contexto.controlador.borrarPregunta(contexto.modelo.preguntas[0]);
      };
    });
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
