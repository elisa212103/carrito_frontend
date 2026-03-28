const CLAVE_CARRITO = "carrito";

function obtenerCarrito() {
    const datos = localStorage.getItem(CLAVE_CARRITO);
    /*operacion if/else ternaria*/
    return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function calcularTotal() {
    const carrito = obtenerCarrito();
    let total = 0;

    /*cada elemento de carrito se convierte en producto y se llama a la funcion, same as: */
    // for (let i = 0; i < carrito.length; i++) {
    // const producto = carrito[i];
    // total += producto.precio * producto.cantidad;
    // }
    carrito.forEach(function (producto) {
        total += producto.precio * producto.cantidad;
    });

    return total;
}

function renderizarCarrito() {
    const tbody = document.querySelector(".tabla-carrito tbody");
    const totalElemento = document.getElementById("total");

    if (!tbody || !totalElemento) return;

    const carrito = obtenerCarrito();

    tbody.innerHTML = "";

    //colspan hace que ese texto ocupe las 5 celdas de la tabla
    if (carrito.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">Carrito vacío</td>
            </tr>
        `;
        totalElemento.textContent = "0.00 €";
        return;
    }

    carrito.forEach(function (producto, indice) {
        const subtotal = producto.precio * producto.cantidad;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td class="precio">${producto.precio.toFixed(2)} €</td>
            <td>
                <button type="button" onclick="cambiarCantidadCarrito(${indice}, -1)">-</button>
                <input 
                    type="number" 
                    value="${producto.cantidad}" 
                    min="1" 
                    onchange="cambiarCantidadInput(${indice}, this.value)"
                >
                <button type="button" onclick="cambiarCantidadCarrito(${indice}, 1)">+</button>
            </td>
            <td class="subtotal">${subtotal.toFixed(2)} €</td>
            <td>
                <button type="button" onclick="eliminarFila(${indice})">X</button>
            </td>
        `;

        //porque fila es subclase 'hijo' de tbody
        tbody.appendChild(fila);
    });

    actualizarTotal();
}

function cambiarCantidadCarrito(indice, cambio) {
    const carrito = obtenerCarrito();

    carrito[indice].cantidad += cambio;

    if (carrito[indice].cantidad < 1) {
        carrito[indice].cantidad = 1;
    }

    guardarCarrito(carrito);
    renderizarCarrito();
}

function cambiarCantidadInput(indice, valor) {
    const carrito = obtenerCarrito();
    let nuevaCantidad = parseInt(valor, 10);

    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
        nuevaCantidad = 1;
    }

    carrito[indice].cantidad = nuevaCantidad;

    guardarCarrito(carrito);
    renderizarCarrito();
}

function eliminarFila(indice) {
    const carrito = obtenerCarrito();

    carrito.splice(indice, 1);

    guardarCarrito(carrito);
    renderizarCarrito();
}

function actualizarTotal() {
    const totalElemento = document.getElementById("total");

    if (!totalElemento) return;

    const total = calcularTotal();
    totalElemento.textContent = total.toFixed(2) + " €";
}

function finalizarCompra() {
    //devuelve a logout el total del carrito
    const total = calcularTotal();
    localStorage.setItem("totalCompra", total);
    window.location.href = "logout.html";
}

document.addEventListener("DOMContentLoaded", function () {
    renderizarCarrito();
});