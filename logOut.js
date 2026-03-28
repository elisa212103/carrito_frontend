class LogOut {
    //otra manera de hacerlo, cuando se necesita implementar más logica, constructor
    constructor() {
        this.totalElemento = document.getElementById("precio-total-final");
        this.formulario = document.getElementById("form-compra");

        this.total = 0;

        this.cargarTotal();
        this.mostrarTotal();
        this.configurarFormulario();
    }

    cargarTotal() {
        const totalGuardado = localStorage.getItem("totalCompra");

        if (totalGuardado) {
            this.total = parseFloat(totalGuardado);
        } else {
            this.total = 0;
        }
    }

    mostrarTotal() {
        if (!this.totalElemento) return;

        this.totalElemento.textContent = "Total: " + this.total.toFixed(2) + " €";
    }

    configurarFormulario() {
        if (!this.formulario) return;

        this.formulario.addEventListener("submit", (event) => {
            event.preventDefault();

            // recoger datos del formulario
            const datos = {
                nombre: document.getElementById("nombre").value,
                email: document.getElementById("email").value,
                telefono: document.getElementById("telefono").value,
                direccion: document.getElementById("direccion").value,
                codigoPostal: document.getElementById("codigoPostal").value,
                comentarios: document.getElementById("comentarios").value,
                total: this.total
            };

            // guardar datos del comprador (opcional)
            localStorage.setItem("datosComprador", JSON.stringify(datos));

            // mensaje de confirmación
            alert(" Compra realizada correctamente\nTotal: " + this.total.toFixed(2) + " €");

            // limpiar carrito
            localStorage.removeItem("carrito");
            localStorage.removeItem("totalCompra");

            // redirigir al inicio
            window.location.href = "index.html";
        });
    }
}

// iniciar cuando carga la página
document.addEventListener("DOMContentLoaded", function () {
    new LogOut();
});