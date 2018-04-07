/*
 * Controlador
 */
var Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function(pregunta, respuestas) {
      this.modelo.agregarPregunta(pregunta, respuestas);
  },
  borrarPregunta: function(pregunta){
    this.modelo.borrarPregunta(pregunta);
  },
  agregarVoto: function(pregunta,respuestaSeleccionada){
    this.modelo.sumarVoto(pregunta,respuestaSeleccionada);
  },
  obtenerPregunta: function(nombrePregunta){
    return this.modelo.obtenerPregunta(nombrePregunta);
  }
};
