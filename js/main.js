let productos = []; // Variable para almacenar todos los productos

// Cargar productos desde JSON al iniciar la página
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data; // Guardar productos en la variable global
        cargarProductos(productos); // Mostrar todos los productos al cargar la página
    })
    .catch(error => console.error('Error al cargar productos:', error));


const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");
const searchInput = document.getElementById("searchInput"); // Input de búsqueda

// Evento para buscar productos al presionar Enter en el input de búsqueda
searchInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        buscar();
    }
});

// Función para cargar productos en el contenedor
function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.append(div);
    });

    actualizarBotonesAgregar(); // Actualizar eventos de los botones "Agregar"
}

// Función para filtrar productos según el término de búsqueda
function buscar() {
    const term = searchInput.value.trim().toLowerCase();

    // Filtrar productos que coincidan con el término de búsqueda en nombre o descripción
    const resultados = productos.filter(producto =>
        producto.titulo.toLowerCase().includes(term)
    );

    cargarProductos(resultados); // Mostrar productos filtrados en el contenedor
}

// Asignar evento click a los botones de categorías
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        // Limpiar el campo de búsqueda
        searchInput.value = '';

        if (e.currentTarget.id !== "todos") {
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productosBoton.length > 0 ? productosBoton[0].categoria.nombre : "Categoría no encontrada";
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

// Función para actualizar eventos de los botones "Agregar"
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

// Cargar productos en el carrito desde localStorage si existen
const productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

// Función para agregar un producto al carrito
function agregarAlCarrito(e) {
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function(){} // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Función para actualizar el número de productos en el carrito
function actualizarNumerito() {
    const nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}
