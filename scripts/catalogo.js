//const = variable que no cambia
const CLAVE_CARRITO_ID = "carrito";
const API_URL = "http://localhost:8080/api";

function cambiarCantidad(boton, cambio) {
    try{
    /*como tenemos muchos elementos queremos referirnos al de nuestra clase 'padre'*/
    const contenedorCantidad = boton.parentElement;

    //tenemos una celda input que se va actualizando con los botones, no hace falta endpoint
    const input = contenedorCantidad.querySelector("input");
    
    //let para valores cambiantes
    let valorActual = parseInt(input.value, 10);
    valorActual += cambio;

    if (valorActual < 1) {
        valorActual = 1;
    }

    input.value = valorActual;

    } catch (error) {
        console.error("Error al cambiar cantidad:", error);
        alert("Hubo un problema al cambiar la cantidad");
    }
}

async function anadirAlCarrito(boton) {
    try {

        //obtenemos id de fila y cantidad
        const fila = boton.closest("tr");
        const idArticulo = fila.dataset.id;
        const cantidad = parseInt(fila.querySelector("input").value, 10);

        //hemos guardado el id del carrito en localStorage
        let idCarrito = localStorage.getItem(CLAVE_CARRITO_ID);

        // si no existe lo creamos y lo guardamos
        if (!idCarrito) {
            //http://localhost:8080/api/carritos
            const responseCarrito = await fetch(`${API_URL}/carritos`, {
                method: "POST",
                headers: {
                    //estamos mandando la info request body en formato JSON
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idUsuario: 1,
                    correoUsuario: "elisa.lapastora@gmail.com"
                })
            });
                    
            if (!responseCarrito.ok) {
                throw new Error("No se pudo crear el carrito");
            }

            const carritoCreado = await responseCarrito.json();
            idCarrito = carritoCreado.idCarrito;

            localStorage.setItem(CLAVE_CARRITO_ID, idCarrito);
        }

        const response = await fetch(
            `${API_URL}/carritos/${idCarrito}/articulos/${idArticulo}?unidades=${cantidad}`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            throw new Error("No se pudo añadir el artículo al carrito");
        }

        alert("Producto añadido al carrito");
    } catch (error) {
        console.error("Error al añadir al carrito:", error);
        alert("Hubo un problema al añadir el producto");
    }
}