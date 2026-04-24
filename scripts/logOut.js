const CLAVE_CARRITO_ID = "carrito";
const API_URL = "http://localhost:8080/api";

class LogOut {
    constructor() {
        this.totalElemento = document.getElementById("precio-total-final");
        this.formulario = document.getElementById("form-compra");

        // guardamos el id del carrito, no el total
        this.idCarrito = localStorage.getItem(CLAVE_CARRITO_ID);

        this.total = 0;

        this.iniciar();
    }
    

    async iniciar() {
        await this.cargarTotal();
        this.mostrarTotal();
        this.configurarFormulario();
    }

    async cargarTotal() {
        // si no hay carrito guardado, el total será 0
        if (!this.idCarrito) {
            this.total = 0;
            return;
        }

        try {
            // pedimos al backend el total real del carrito
            const response = await fetch(`${API_URL}/carritos/${this.idCarrito}/total`);

            if (!response.ok) {
                throw new Error("No se pudo obtener el total");
            }

            this.total = await response.json();

        } catch (error) {
            console.error("Error al cargar el total:", error);
            this.total = 0;
        }
    }

    mostrarTotal() {
        if (!this.totalElemento) return;

        this.totalElemento.textContent = "Total: " + this.total.toFixed(2) + " €";
    }

    configurarFormulario() {
        if (!this.formulario) return;

        this.formulario.addEventListener("submit", async (event) => {
            event.preventDefault();

            // recogemos los datos escritos por el usuario
            const datos = {
                nombre: document.getElementById("nombre").value,
                email: document.getElementById("email").value,
                telefono: document.getElementById("telefono").value,
                direccion: document.getElementById("direccion").value,
                codigoPostal: document.getElementById("codigoPostal").value,
                comentarios: document.getElementById("comentarios").value,
                total: this.total
            };

            // esto solo lo guardamos en localStorage como apoyo visual
            // no como dato seguro de compra
            localStorage.setItem("datosComprador", JSON.stringify(datos));

            try {
                // si existe carrito, lo borramos al terminar la compra
                // usa tu endpoint DELETE /api/carritos/{id}
                if (this.idCarrito ) {
                    const response = await fetch(`${API_URL}/carritos/${this.idCarrito}`, {
                        method: "DELETE"
                    });

                    if (!response.ok) {
                        throw new Error("No se pudo borrar el carrito");
                    }
                }

                alert("Compra realizada correctamente\nTotal: " + this.total.toFixed(2) + " €");

                // limpiamos el id del carrito del navegador
                localStorage.removeItem(CLAVE_CARRITO_ID);

                // si quieres, también quitamos estos datos auxiliares
                localStorage.removeItem("datosComprador");

                // volvemos al inicio
                window.location.href = "index.html";

            } catch (error) {
                console.error("Error al finalizar la compra:", error);
                alert("Hubo un problema al finalizar la compra");
            }
        });
    }
}

// cuando el HTML ya esté cargado, arrancamos la clase
document.addEventListener("DOMContentLoaded", function () {
    new LogOut();
});