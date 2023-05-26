class Producto {
    constructor(id, nombre, precio, stock, img, alt) {
        this.id = id
        this.nombre = nombre
        this.cantidad = 1
        this.precio = precio
        this.stock = stock
        this.img = img
        this.alt = alt
    }
}

class ProductoController {
    constructor() {
        this.listaProductos = []
        this.contenedor_productos = document.getElementById("contenedor_productos")
    }

    async cargar_y_mostrar(){
        const resp = await fetch("productos.json")
        this.listaProductos = await resp.json()

        this.mostrarEnDOM()
    }

    cargar_y_mostrar() {
        this.listaProductos = [
            new Producto(1, "Artillery HORNET", 100000, 10, "./img/impreAHornet.jpg", "Impresora 3d 1"),
            new Producto(2, "Creality CR-10 MAX", 140000, 10, "./img/ImpreCCR10MAX.jpg", "Impresora 3d 2"),
            new Producto(3, "Creality CR-30 3D Print Mill", 200000, 10, "./img/ImpreCCR303dPrintMill.jpg", "Impresora 3d 3"),
            new Producto(4, "Creality ENDER-5 PLUS", 300000, 10, "./img/impreCEnder5plus.jpg", "Impresora 3d 4"),
            new Producto(5, "Creality ENDER-6", 350000, 10, "./img/impreCEnder6.jpg", "Impresora 3d 5"),
            new Producto(6, "Artillery Genius Pro", 150000, 10, "./img/impresora3d1.png", "Impresora 3d 6"),
            new Producto(7, "Creality Ender 6 Diy Kit Fdm", 280000, 10, "./img/impresora3d2.jpg", "Impresora 3d 7"),
            new Producto(8, "Hellbot Magna 2 300 Dykit", 260000, 10, "./img/impresora3d3.jpg", "Impresora 3d 8"),
            new Producto(9, "Canon Pixma G3110 con wifi", 155000, 10, "./img/imprePixmaG3110.webp", "Impresora 1"),
            new Producto(10, "HP Smart Tank 515 con wifi", 130000, 10, "./img/impreSmartTank515.webp", "Impresora 2"),
            new Producto(11, "Epson EcoTank L3210", 194000, 10, "./img/impreEcoTankL3210.webp", "Impresora 3"),
            new Producto(12, "Brother HL1212W con wifi", 125000, 10, "./img/impreHL1212W.webp", "Impresora 4")
        ]
    }

    


    mostrarEnDOM() {
        //Muestra DOM de manera dinamica
        this.listaProductos.forEach(producto => {
            this.contenedor_productos.innerHTML += `
            <div class="card border-black" style="width: 18rem;">
                <img src="${producto.img}" class="card-img-top" alt="${producto.alt}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">Precio: $${producto.precio}</p>
                    <a href="#" id="cpu-${producto.id}" class="btn btn-dark">Añadir al carrito</a>
                </div>
            </div>`
        })
    }

    darEventoClickAProductos(controladorCarrito) {
        this.listaProductos.forEach(producto => {
            const btnAP = document.getElementById(`cpu-${producto.id}`)
            btnAP.addEventListener("click", () => {

                controladorCarrito.agregar(producto)
                controladorCarrito.guardarEnStorage()


                controladorCarrito.mostrarEnDOM(contenedor_carrito)

                Toastify({
                    text: "Agregaste a tu carrito",
                    duration: 3000,
                    position: `right`,
                    gravity: `bottom`,
                    style: {
                        background: "black"
                    },
                }).showToast();
            })
        })
    }
}

class CarritoController {
    constructor() {
        this.calcular_carrito = document.getElementById("calcular_carrito")
        this.listaCarrito = []
        this.contenedor_carrito = document.getElementById("contenedor_carrito")
    }

    calcularCarrito() {
        let total = 0;

        total = this.listaCarrito.reduce((total, producto) => total + producto.cantidad * producto.precio, 0)

        this.calcular_carrito.innerHTML = `Total a pagar: $${total}`;

    }

    agregar(producto) {
        let flag = false;
        for (let i = 0; i < this.listaCarrito.length; i++) {
            if (this.listaCarrito[i].id == producto.id) {
                this.listaCarrito[i].cantidad += 1;
                flag = true
            }
        }
        if (flag == false) {
            this.listaCarrito.push(producto)
        }
    }

    limpiarCarritoStorage() {
        localStorage.removeItem("listaCarrito")
    }

    guardarEnStorage() {
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem("listaCarrito", listaCarritoJSON)
    }

    verificarExistenciaEnStorage() {
        this.listaCarrito = JSON.parse(localStorage.getItem('listaCarrito')) || []
        if (this.listaCarrito.length > 0) {
            this.mostrarEnDOM()
        }
    }

    limpiarContenedor_Carrito() {
        this.contenedor_carrito.innerHTML = ""
        this.calcular_carrito.innerHTML = ""
    }

    borrar(producto) {
        let posicion = this.listaCarrito.findIndex(miProducto => producto.id == miProducto.id)

        if (!(posicion == -1)) {
            this.listaCarrito.splice(posicion, 1)
        }
    }


    mostrarEnDOM() {
        this.limpiarContenedor_Carrito()
        this.listaCarrito.forEach(producto => {
            this.contenedor_carrito.innerHTML +=
                `<div class="card mb-3" style="max-width: 540px;">
                <div class="row g-0">
                    <div class="col-md-4">
                    <img src="${producto.img}" class="img-fluid rounded-start" alt="${producto.alt}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">Precio: $${producto.precio}</p>
                            <p class="card-text">Cantidad: ${producto.cantidad}</p>
                        </div>
                        <div class="tacho">
                        <button class="btn btn-danger" id="borrar-${producto.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg></i></button>           
                        </div>           
                    </div>
                </div>
            </div>`
        })

        this.listaCarrito.forEach(producto => {
            const btnBorrar = document.getElementById(`borrar-${producto.id}`)
            btnBorrar.addEventListener("click", () => {

                this.borrar(producto)
                this.guardarEnStorage()
                this.mostrarEnDOM()
            })
        })
        this.calcularCarrito()
    }
}

const controladorProductos = new ProductoController()
controladorProductos.cargar_y_mostrar()

const controladorCarrito = new CarritoController()

//Veri STORAGE - muestra en DOM 
controladorCarrito.verificarExistenciaEnStorage()

//DOM
controladorProductos.mostrarEnDOM()

//EVENTOS
controladorProductos.darEventoClickAProductos(controladorCarrito)



const finalizar_compra = document.getElementById("finalizar_compra")
finalizar_compra.addEventListener("click", () => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Compra Exitosa',
        showConfirmButton: false,
        timer: 1500
    })
    controladorCarrito.limpiarContenedor_Carrito()
    controladorCarrito.limpiarCarritoStorage()
    controladorCarrito.listaCarrito = []

})


//Buscador
document.addEventListener(`keyup`, e => {
    if (e.target.matches(`#buscador`)) {
        document.querySelectorAll(`.productos`).forEach(impresora => {
            impresora.textContent.toLowerCase().includes(e.target.value)
                ? impresora.textContent.remove(`filtro`)
                : fruta.classList.add(`filtro`);
        })
    }
})