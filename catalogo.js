const CLAVE_CARRITO = "carrito";

function cambiarCantidad(boton, cambio) {
    /*como tenemos muchos elementos queremos referirnos al de nuestra clase 'padre'*/
    const contenedorCantidad = boton.parentElement;
    const input = contenedorCantidad.querySelector("input");

    let valorActual = parseInt(input.value, 10);
    valorActual += cambio;

    if (valorActual < 1) {
        valorActual = 1;
    }

    input.value = valorActual;
}

function anadirAlCarrito(boton) {
    const fila = boton.closest("tr");

    const nombre = fila.querySelector(".nombre-producto").textContent;
    const precio = parseFloat(fila.querySelector(".precio-producto").textContent);
    const cantidad = parseInt(fila.querySelector("input").value, 10);

    /*tenemos que crear un carrito local al inicializar el programa*/
    let carrito = localStorage.getItem(CLAVE_CARRITO);

    if (carrito) {
        carrito = JSON.parse(carrito);
    } else {
        carrito = [];
    }

    const productoExistente = carrito.find(function (producto) {
        return producto.nombre === nombre;
    });

    if (productoExistente) {
        productoExistente.cantidad += cantidad;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: cantidad
        });
    }

    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));

    alert("Producto añadido al carrito");
}