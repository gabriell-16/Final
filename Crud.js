document.addEventListener('DOMContentLoaded', () => {
    const crudForm = document.getElementById('form');
    const tablaBody = document.getElementById('tableBody');
    let editarelemento = null;

    if (crudForm) {
        crudForm.addEventListener('submit', Cargar);
    }

    function Cargar(event) {
        event.preventDefault();

        const id = document.getElementById('inputId').value;
        const producto = document.getElementById('inputProducto').value;
        const precio = document.getElementById('inputPrecio').value;
        const stock = document.getElementById('inputStock').value;
        const marca = document.getElementById('inputMarca').value;

        // Verificar si el ID es negativo
        if (id < 0) {
        Swal.fire('So Tontito?');
        return;
        }
        

        // Verificar si el ID ya existe
        const productoExistente = getProductosDesdeLocalStorage().find(p => p.id === id);
        if (productoExistente && !editarelemento) {
            Swal.fire('Ya existe un producto con este ID. Por favor, elige un ID único.');
            return;
        }

        if (editarelemento) {
            editarProductoEnLocalStorage(editarelemento, producto, precio, stock, marca);
        } else {
            agregarProductoALocalStorage(id, producto, precio, stock, marca);
        }

        actualizarTabla();
        limpiarFormulario();
    }

    const buscar = document.getElementById('search');
    buscar.addEventListener('click', searchProductById);

    function searchProductById() {
        const searchId = document.getElementById('searchInput').value;
        const producto = getProductoDesdeLocalStorage(searchId);

        if (producto) {
            document.getElementById('inputId').value = producto.id;
            document.getElementById('inputProducto').value = producto.producto;
            document.getElementById('inputPrecio').value = producto.precio;
            document.getElementById('inputStock').value = producto.stock;
            document.getElementById('inputMarca').value = producto.marca;

            editarelemento = searchId;
            document.getElementById('searchInput').value = '';
        } else {
            Swal.fire('Producto no encontrado');
        }
    }

    function getProductoDesdeLocalStorage(id) {
        const productos = getProductosDesdeLocalStorage();
        return productos.find(producto => producto.id == id);
    }

    function editarProductoEnLocalStorage(id, producto, precio, stock, marca) {
        const productos = getProductosDesdeLocalStorage();
        const index = productos.findIndex(p => p.id == id);
        if (index !== -1) {
            productos[index] = { id, producto, precio, stock, marca };
            guardarProductosEnLocalStorage(productos);
        }
    }

    function agregarProductoALocalStorage(id, producto, precio, stock, marca) {
        const productos = getProductosDesdeLocalStorage();
        productos.push({ id, producto, precio, stock, marca });
        guardarProductosEnLocalStorage(productos);
    }

    function getProductosDesdeLocalStorage() {
        const productosJson = localStorage.getItem('productos');
        return productosJson ? JSON.parse(productosJson) : [];
    }

    function guardarProductosEnLocalStorage(productos) {
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    function limpiarFormulario() {
        crudForm.reset();
        editarelemento = null;
    }

    function actualizarTabla() {
        const productos = getProductosDesdeLocalStorage();

        while (tablaBody.firstChild) {
            tablaBody.removeChild(tablaBody.firstChild);
        }

        productos.forEach(producto => {
            const row = document.createElement('tr');
            const columns = ['id', 'producto', 'precio', 'stock', 'marca'];

            columns.forEach(column => {
                const cell = document.createElement('td');
                cell.textContent = producto[column];
                row.appendChild(cell);
            });

            const accionesCell = document.createElement('td');

            const editarBoton = document.createElement('button');
            editarBoton.textContent = 'Editar';
            editarBoton.addEventListener('click', () => editarProducto(producto.id));
            editarBoton.classList.add("btn", "btn-warning");

            const eliminarBoton = document.createElement('button');
            eliminarBoton.textContent = 'Eliminar';
            eliminarBoton.addEventListener('click', () => eliminarProducto(producto.id));
            eliminarBoton.classList.add("btn", "btn-danger");

            accionesCell.appendChild(editarBoton);
            accionesCell.appendChild(eliminarBoton);

            row.appendChild(accionesCell);

            tablaBody.appendChild(row);
        });
    }

    function eliminarProducto(id) {
        const confirmacion = Swal.fire({
            title: "Eliminar Producto?",
            text: "Esta por eliminar un Producto! ¿Desea hacerlo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminar!"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Producto ELiminado!",
                text: "El producto ya no se encuentra en la lista.",
                icon: "success"
              });
            }
          });
    
        if (confirmacion) {
            const productos = getProductosDesdeLocalStorage().filter(producto => producto.id !== id);
            guardarProductosEnLocalStorage(productos);
            actualizarTabla();
            limpiarFormulario();
        }
    }
    
    function editarProducto(id) {
        const producto = getProductoDesdeLocalStorage(id);
        if (producto) {
            document.getElementById('inputId').value = producto.id;
            document.getElementById('inputProducto').value = producto.producto;
            document.getElementById('inputPrecio').value = producto.precio;
            document.getElementById('inputStock').value = producto.stock;
            document.getElementById('inputMarca').value = producto.marca;
    
            editarelemento = id;
        }
    }

    actualizarTabla();
});

const redic = document.getElementById('redirec');

redic.addEventListener('click', function(){
    window.location.href = 'Emp-Crud.html';
});

const cerrar = document.getElementById('cerrar');

cerrar.addEventListener('click', function(){
    window.location.href = 'index.html';
});