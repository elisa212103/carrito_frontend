let indice = 0;

const imagenes = [
    "rsrcs/ramoNaranja.jpg",
    "rsrcs/ramoRosa.jpg",
    "rsrcs/floresHorizontal2.jpg",
    "rsrcs/floresHorizontal.jpg"
];

const img = document.getElementById("imagen-carrusel");

function mostrarImagen() {
    img.src = imagenes[indice];
}


function cambiarImagen(direccion) {
    indice = (indice + direccion + imagenes.length) % imagenes.length;
    mostrarImagen();
    reiniciarAuto();
}

//automático cada 30s
let timer = setInterval(siguienteAuto, 30000);

function siguienteAuto() {
    cambiarImagen(1);
}

function reiniciarAuto() {
    clearInterval(timer);
    timer = setInterval(siguienteAuto, 30000);
}


mostrarImagen();