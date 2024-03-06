document.addEventListener('DOMContentLoaded', function () {
    const carrito = [];
    let productos = getProductosDesdeLocalStorage();
    const mapaProductos = new Map();
    let totalCompra = 0; // Variable para almacenar el total de la compra

    // Llenar el mapa de productos
    productos.forEach(producto => {
        mapaProductos.set(producto.id, producto);
    });

    function getProductosDesdeLocalStorage() {
        const productosJson = localStorage.getItem('productos');
        return productosJson ? JSON.parse(productosJson) : [];
    }

    function guardarProductosEnLocalStorage(productos) {
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    function actualizarTablas() {
        const tablaProductos = document.getElementById('bodyvender');
        const tablaVentas = document.getElementById('bodyventas');
        limpiarTabla(tablaProductos);
        limpiarTabla(tablaVentas);

        const fragmentoProductos = document.createDocumentFragment();
        const fragmentoVentas = document.createDocumentFragment();

        productos.forEach(producto => {
            if (producto.id && producto.producto && producto.precio && producto.stock) {
                const row = crearFila(producto);
                const venderCell = document.createElement('td');
                const venderButton = document.createElement('button');
                venderButton.textContent = 'Vender';
                venderButton.addEventListener('click', () => venderProducto(producto));
                venderButton.classList.add("btn", "btn-success", "boton-vender");
                venderCell.appendChild(venderButton);
                row.appendChild(venderCell);
                fragmentoProductos.appendChild(row);
            }
        });

        tablaProductos.appendChild(fragmentoProductos);

        if (tablaVentas.children.length === 0 && carrito.length > 0) {
            const headerRow = document.createElement('tr');
            const productoLabel = document.createElement('th');
            productoLabel.textContent = 'Producto';
            headerRow.appendChild(productoLabel);
            const precioLabel = document.createElement('th');
            precioLabel.textContent = 'Precio';
            headerRow.appendChild(precioLabel);
            const cantidadLabel = document.createElement('th');
            cantidadLabel.textContent = 'Cantidad';
            headerRow.appendChild(cantidadLabel);
            const accionesLabel = document.createElement('th');
            accionesLabel.textContent = 'Acciones';
            headerRow.appendChild(accionesLabel);
            tablaVentas.appendChild(headerRow);
        }

        carrito.forEach(producto => {
            const row = document.createElement('tr');
            const nombreCell = document.createElement('td');
            nombreCell.textContent = producto.producto;
            row.appendChild(nombreCell);
            const precioCell = document.createElement('td');
            precioCell.textContent = producto.precio;
            row.appendChild(precioCell);
            const cantidadCell = document.createElement('td');
            cantidadCell.textContent = producto.cantidad;
            row.appendChild(cantidadCell);
            const accionesCell = document.createElement('td');
            const incrementarButton = document.createElement('button');
            incrementarButton.textContent = '+';
            incrementarButton.addEventListener('click', () => incrementarCantidad(producto));
            incrementarButton.classList.add(`incrementar-btn`);
            const decrementarButton = document.createElement('button');
            decrementarButton.textContent = '-';
            decrementarButton.addEventListener('click', () => decrementarCantidad(producto));
            decrementarButton.classList.add(`decrementar-btn`);
            accionesCell.appendChild(incrementarButton);
            accionesCell.appendChild(decrementarButton);
            row.appendChild(accionesCell);
            fragmentoVentas.appendChild(row);
        });

        tablaVentas.appendChild(fragmentoVentas);

        // Actualizar el total de la compra
        actualizarTotalCompra();
    }

    function limpiarTabla(tabla) {
        while (tabla.firstChild) {
            tabla.removeChild(tabla.firstChild);
        }
    }

    function crearFila(producto, mostrarStock = true) {
        const row = document.createElement('tr');
        const columns = ['id', 'producto', 'precio'];

        if (mostrarStock) {
            columns.push('stock');
        }

        columns.forEach(column => {
            const cell = document.createElement('td');
            cell.textContent = producto[column];
            row.appendChild(cell);
        });

        return row;
    }

    function venderProducto(producto) {
        if (producto.stock > 0) {
            const productoEnCarrito = carrito.find(item => item.id === producto.id);

            if (productoEnCarrito) {
                productoEnCarrito.cantidad++;
            } else {
                carrito.push({ ...producto, cantidad: 1 });
            }

            producto.stock--;
            guardarProductosEnLocalStorage(productos);
            actualizarTablas();
        } else {
            alert(`No hay suficiente stock para ${producto.producto}`);
        }
    }

    function incrementarCantidad(producto) {
        const productoEnCarrito = carrito.find(item => item.id === producto.id);
        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
    
        const productoEnTabla = mapaProductos.get(producto.id);
        if (productoEnTabla) {
            productoEnTabla.stock--;
            guardarProductosEnLocalStorage(productos);
            actualizarTablas();
        }
    }
    
    function decrementarCantidad(producto) {
        const productoEnCarrito = carrito.find(item => item.id === producto.id);
        if (productoEnCarrito) {
            if (productoEnCarrito.cantidad > 1) {
                productoEnCarrito.cantidad--;
            } else {
                const index = carrito.findIndex(item => item.id === producto.id);
                if (index !== -1) {
                    carrito.splice(index, 1);
                }
            }
    
            const productoEnTabla = mapaProductos.get(producto.id);
            if (productoEnTabla) {
                productoEnTabla.stock++;
                guardarProductosEnLocalStorage(productos);
                actualizarTablas();
            }
        }
    }

    // Manejador de evento para el botón "Vaciar Carrito"
    const botonVaciarCarrito = document.getElementById('botonVaciarCarrito');
    botonVaciarCarrito.addEventListener('click', vaciarCarrito);

    // Manejador de evento para el botón "Confirmar Compra"
    const botonConfirmarCompra = document.getElementById('botonConfirmarCompra');
    botonConfirmarCompra.addEventListener('click', confirmarCompra);

    function vaciarCarrito() {
        carrito.forEach(productoEnCarrito => {
            const productoEnTabla = mapaProductos.get(productoEnCarrito.id);
            if (productoEnTabla) {
                productoEnTabla.stock += productoEnCarrito.cantidad;
            }
            Swal.fire({
                title: "Vaciar Carrito?",
                text: "Esta seguro con Vaciar el Carrito?",
                icon: "question"
              });
        });

        carrito.length = 0;

        actualizarTablas();
    }

    function confirmarCompra() {
        vaciarCarrito();
        Swal.fire("Compra Realizada! Gracias!");
        actualizarTablas();
    }

    // Manejador de evento para el botón de búsqueda
    const botonBuscar = document.getElementById('buscarsh');
    botonBuscar.addEventListener('click', function () {
        console.log("Botón de búsqueda clickeado");
        const busqueda = document.getElementById('searchInput').value.trim().toLowerCase();
        if (busqueda.includes('-')) {
            Swal.fire("El ID no puede contener simbolos negativos!");
            return;
        }
        const productoEncontrado = mapaProductos.get(busqueda);
        if (productoEncontrado) {
            agregarProductoATablaVentas(productoEncontrado);
        } else {
            Swal.fire("Producto no encotrado!");
        }
    });

    function agregarProductoATablaVentas(producto) {
        const tablaVentas = document.getElementById('bodyventas');
        const row = document.createElement('tr');
        const nombreCell = document.createElement('td');
        nombreCell.textContent = producto.producto;
        row.appendChild(nombreCell);
        const precioCell = document.createElement('td');
        precioCell.textContent = producto.precio;
        row.appendChild(precioCell);
        const cantidadCell = document.createElement('td');
        cantidadCell.textContent = 1; // Mostrar solo una cantidad inicial de 1
        row.appendChild(cantidadCell);
        const accionesCell = document.createElement('td');
    
        const incrementarButton = document.createElement('button');
        incrementarButton.textContent = '+';
        incrementarButton.addEventListener('click', () => incrementarCantidad(producto)); // Pasar el producto como parámetro
        incrementarButton.classList.add(`incrementar-btn`);
        const decrementarButton = document.createElement('button');
        decrementarButton.textContent = '-';
        decrementarButton.addEventListener('click', () => decrementarCantidad(producto)); // Pasar el producto como parámetro
        decrementarButton.classList.add(`decrementar-btn`);
        accionesCell.appendChild(incrementarButton);
        accionesCell.appendChild(decrementarButton);
    
        row.appendChild(accionesCell);
        tablaVentas.appendChild(row);

        // Actualizar el total de la compra al agregar un producto
        actualizarTotalCompra();
    }

    // Función para actualizar el total de la compra
    function actualizarTotalCompra() {
        totalCompra = carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
        document.getElementById('totalCompra').textContent = `Total: $${totalCompra.toFixed(2)}`;
    }

    // Actualizar las tablas cuando se cargue la página
    actualizarTablas();

});

const redic = document.getElementById('cerrar');

redic.addEventListener('click', function(){
    window.location.href = 'index.html';
});