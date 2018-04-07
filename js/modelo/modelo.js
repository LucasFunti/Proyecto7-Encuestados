/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaBorrada = new Evento(this);
  this.preguntaGuardada = new Evento(this);
  this.preguntaVotada = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    return this.ultimoId;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    var id = this.obtenerUltimoId();
    id++;
    this.ultimoId = id;
    var nuevaPregunta = {'textoPregunta': nombre, 'id': this.ultimoId, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  //se guardan las preguntas
  guardar: function(){
    localStorage.setItem("preguntas",JSON.stringify(this.preguntas));
    this.preguntaGuardada.notificar();
  },

  cargarPreguntas: function(){
    var preguntas = localStorage.getItem('preguntas');
    if(preguntas == undefined){
      this.preguntas = [];
    }else{
      this.preguntas = JSON.parse(preguntas);
    }
    return this.preguntas;
  },

  borrarPregunta: function(pregunta){
    var index = this.preguntas.findIndex(preg => preg.id == pregunta.id);
    this.preguntas.splice(index,1);
    this.guardar();
    this.preguntaBorrada.notificar();
  },

  obtenerPregunta: function(pregunta){
    var preguntasGuardadas = localStorage.getItem("preguntas");
    this.preguntas = JSON.parse(preguntasGuardadas);
    return this.preguntas.find(preg => preg.textoPregunta == pregunta);
  },

  sumarVoto: function(pregunta,respuestaSeleccionada){
    var preguntaBindeada = this.obtenerPregunta(pregunta.textoPregunta);
    var respuesta = preguntaBindeada.cantidadPorRespuesta.find(opcion => opcion.textoRespuesta == respuestaSeleccionada);
    respuesta.cantidad++;
    this.guardar();
    this.preguntaVotada.notificar();
  },

};
