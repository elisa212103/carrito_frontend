const CLAVE_CARRITO_ID = "carrito";
const API_URL = "http://localhost:8080/api";

//si queremos utilizar await y promesas necesitamos que la funcion sea async
async function obtenerCarrito() {

    const idCarrito = localStorage.getItem(CLAVE_CARRITO_ID);

    if (!idCarrito) {
        return null;
    }

    //llamamos al metodo get, para obtener el carrito con ese id
    const response = await fetch(`${API_URL}/carritos/${idCarrito}`);

    if (!response.ok) {
        throw new Error("No se pudo obtener el carrito");
    }

    return await response.json();
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO_ID, carrito.idCarrito);
}

async function calcularTotal() {

    //mas facil llamar a localstorage que filtrar obtenerCarrito
    const idCarrito = localStorage.getItem(CLAVE_CARRITO_ID);

    if (!idCarrito) {
        return 0;
    }

    const response = await fetch(`${API_URL}/carritos/${idCarrito}/total`);

    if (!response.ok) {
        throw new Error("No se pudo obtener el total del carrito");
    }

    return await response.json();
}

async function renderizarCarrito() {
    try {
        const tbody = document.querySelector(".tabla-carrito tbody");
        const totalElemento = document.getElementById("total");

        if (!tbody || !totalElemento) return;

        const carrito = await obtenerCarrito();

        tbody.innerHTML = "";

        if (!carrito || !carrito.lineas || carrito.lineas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5">Carrito vacío</td>
                </tr>
            `;
            totalElemento.textContent = "0.00 €";
            return;
        }

        console.log(carrito.lineas);

        carrito.lineas.forEach(function (linea) {
            const articulo = linea.articulo;
            const subtotal = articulo.precioUnitario * linea.unidades;

            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${articulo.descripcion}</td>
                <td class="precio">${articulo.precioUnitario.toFixed(2)} €</td>
                <td>
                    <button type="button" onclick="cambiarCantidadCarrito(${linea.idLinea}, -1)">-</button>
                    <input 
                        type="number" 
                        value="${linea.unidades}" 
                        min="1" 
                        onchange="cambiarCantidadInput(${linea.idLinea}, this.value)"
                    >
                    <button type="button" onclick="cambiarCantidadCarrito(${linea.idLinea}, 1)">+</button>
                </td>
                <td class="subtotal">${subtotal.toFixed(2)} €</td>
                <td>
                    <button type="button" onclick="eliminarFila(${linea.idLinea})">X</button>
                </td>
            `;

            tbody.appendChild(fila);
        });

        await actualizarTotal();

    } catch (error) {
        console.error("Error al renderizar el carrito:", error);
        alert("No se pudo cargar el carrito");
    }
}
async function cambiarCantidadCarrito(idLinea, cambio) {
    try {
        const idCarrito = localStorage.getItem(CLAVE_CARRITO_ID);

        if (!idCarrito) {
            return;
        }

        const carrito = await obtenerCarrito();

        if (!carrito || !carrito.lineas) {
            return;
        }

        //recorre las lineas del carrito buscando la que tenga el idArticulo que queremos cambiar
        const linea = carrito.lineas.find(function (item) {
            return item.idLinea == idLinea;
        });

        if (!linea) {
            throw new Error("No se encontró la línea en el carrito");
        }

        const nuevasUnidades = linea.unidades + cambio;

        if (nuevasUnidades < 1) {
            return;
        }

        const responsePatch = await fetch(
            `${API_URL}/carritos/${idCarrito}/lineas/${idLinea}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    unidades: nuevasUnidades
                })
            }
        );

        if (!responsePatch.ok) {
            throw new Error("No se pudo actualizar la cantidad");
        }

        await renderizarCarrito();

    } catch (error) {
        console.error("Error al cambiar la cantidad:", error);
        alert("Hubo un problema al actualizar la cantidad");
    }
}


async function cambiarCantidadInput(idLinea, valor) {
    try {
        const idCarrito = localStorage.getItem(CLAVE_CARRITO_ID);
        let nuevaCantidad = parseInt(valor, 10);

        if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
            nuevaCantidad = 1;
        }

        if (!idCarrito) {
            return;
        }

        const responsePatch = await fetch(
            `${API_URL}/carritos/${idCarrito}/lineas/${idLinea}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    unidades: nuevaCantidad
                })
            }
        );

        if (!responsePatch.ok) {
            throw new Error("No se pudo actualizar la cantidad");
        }

        await renderizarCarrito();

    } catch (error) {
        console.error("Error al cambiar la cantidad:", error);
        alert("Hubo un problema al actualizar la cantidad");
    }
}

// Eliminar una línea del carrito
async function eliminarFila(idLinea) {
    try {
        const idCarrito = localStorage.getItem(CLAVE_CARRITO_ID);

        if (!idCarrito) {
            return;
        }

        const response = await fetch(
            `${API_URL}/carritos/${idCarrito}/lineas/${idLinea}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("No se pudo eliminar el artículo");
        }

        await renderizarCarrito();

    } catch (error) {
        console.error("Error al eliminar el artículo:", error);
        alert("No se pudo eliminar el artículo del carrito");
    }
}

// Actualizar el total en pantalla
async function actualizarTotal() {
    const totalElemento = document.getElementById("total");

    if (!totalElemento) return;

    try {
        const total = await calcularTotal();
        totalElemento.textContent = total.toFixed(2) + " €";
    } catch (error) {
        console.error("Error al actualizar el total:", error);
        totalElemento.textContent = "0.00 €";
    }
}

//mejor no guardar el total en localStorage ya que no es seguro
async function finalizarCompra() {
    try {
        const idCarrito = localStorage.getItem(CLAVE_CARRITO_ID);

        if (!idCarrito) {
            alert("No hay carrito");
            return;
        }

        // Comprobamos el total real del carrito actual
        const total = await calcularTotal();

        if (total <= 0) {
            alert("No puedes finalizar la compra con el carrito vacío");
            return;
        }

        window.location.href = `logout.html?idCarrito=${idCarrito}`;

    } catch (error) {
        console.error("Error al finalizar la compra:", error);
        alert("No se pudo finalizar la compra");
    }
}

//para que el script no se ejecute antes de q se haya cargado el html
document.addEventListener("DOMContentLoaded", function () {
    renderizarCarrito();
});