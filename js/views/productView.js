/**
 * Vista de Productos
 * Maneja la interfaz de usuario para la gestión de productos
 */

class ProductView {
  constructor() {
    //el cuerpo de la tabla
    this.tableBody = document.querySelector("#products-table tbody");

    //modal y el titulo del modal
    this.modal = document.querySelector("#product-modal");
    this.modalTitle = document.querySelector("#product-modal-title");

    //formulario de producto
    this.form = document.querySelector("#product-form");

    //quiero una variable que me diga que ID de producto esta activo
    this.currentProductId = null;
  }

  //EL CONSTRUCTOR SIRVE PARA QUE LUEGO AQUI DENTRO PODAMOS ACCEDER A TODOS LOS ELEMENTOS QUE DECLARAMOS!

  /**
   * Renderiza la tabla de productos
   * @param {Array} products - Lista de productos
   */
  renderProductsTable(products) {
    this.tableBody.innerHTML = "";

    if (products.length === 0) {
      this.tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <h3>No hay productos registrados</h3>
          <p>Haz clic en "Agregar Productos" para comenzar</p>
        </td>
      </tr>
      `;
    }

    products.forEach((product) => {
      const row = this.createProductRow(product);
      this.tableBody.appendChild(row);
    });
  }

  /**
   * Crea una fila de producto para la tabla
   * @param {Object} product - Datos del producto
   * @returns {HTMLElement} Fila de la tabla
   */
  createProductRow(product) {
    const row = document.createElement("tr");

    //Determinar el estado del stock
    let stockStatus = "";

    if (product.quantity === 0) {
      stockStatus =
        '<span class="status-indicator out-of-stock"></span>Sin stock';
    } else if (product.quantity <= 10) {
      stockStatus =
        '<span class="status-indicator low-stock"></span>Stock bajo';
    } else {
      stockStatus = '<span class="status-indicator in-stock"></span>En stock';
    }

    row.innerHTML = `
    
    <td>${product.name}</td>
    <td>${product.description}</td>
    <td>${product.quantity} ${stockStatus}</td>
    <td>${calculations.formatCurrency(product.costPrice)}</td>
    <td>${calculations.formatCurrency(product.salePrice)}</td>
    <td>${calculations.formatPercentage(product.profitPercentage)}</td>
    <td>
      <div class="table-actions">
      <button class="action-btn edit" data-action="edit" data-id="${
        product.id
      }" title="Ver detalles"> ✏️ </button>
      <button class="action-btn delete" data-action="delete" data-id="${
        product.id
      }" title="Ver detalles"> 🗑️ </button> 
      </div>
    </td>
    `;

    return row;
  }

  /**
   * Muestra el modal para crear/editar producto
   * @param {Object} product - Datos del producto (opcional para edición)
   */
  showProductModal(product = null) {
    this.currentProductId = product ? product.id : null;

    if (product) {
      this.modalTitle.textContent = "Editar Producto";
      this.populateForm(product);
    } else {
      this.modalTitle.textContent = "Agregar Producto";
      this.clearForm();
    }

    this.modal.classList.add("show");
    this.modal.style.display = "flex";
  }

  /**
   * Oculta el modal
   */
  hideProductModal() {
    this.modal.classList.remove("show");
    this.modal.style.display = "none";
    this.currentProductId = null;
    this.clearForm();
  }

  /**
   * Llena el formulario con datos del producto
   * @param {Object} product - Datos del producto
   */
  populateForm(product) {
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-description").value =
      product.description || "";
    document.getElementById("product-quantity").value = product.quantity;
    document.getElementById("product-cost").value = product.costPrice;
    document.getElementById("product-sale").value = product.salePrice;
    document.getElementById("product-profit").value = product.profitPercentage;
  }

  /**
   * Limpia el formulario
   */
  clearForm() {
    this.form.reset();
    document.getElementById("product-profit").value = "";
  }

  /**
   * Obtiene los datos del formulario
   * @returns {Object} Datos del formulario
   */
  getFormData() {
    return {
      name: document.getElementById("product-name").value,
      description: document.getElementById("product-description").value,
      quantity: parseInt(document.getElementById("product-quantity").value),
      costPrice: parseInt(document.getElementById("product-cost").value),
      salePrice: parseInt(document.getElementById("product-sale").value),
    };
  }

  /**
   * Muestra un mensaje de éxito
   * @param {string} message - Mensaje a mostrar
   */
  showSuccessMessage(message) {
    this.showMessage(message, "success");
  }

  /**
   * Muestra un mensaje de error
   * @param {string} message - Mensaje a mostrar
   */
  showErrorMessage(message) {
    this.showMessage(message, "error");
  }

  /**
   * Muestra un mensaje
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de mensaje (success, error)
   */
  showMessage(message, type) {
    //remover mensajes existentes
    const existingMessages = document.querySelectorAll(
      ".success-message, .error-message"
    );
    existingMessages.forEach((msg) => msg.remove());

    //crear un nuevo mensaje
    const messageDiv = document.createElement("div");
    messageDiv.className =
      type === "success" ? "success-message" : "error-message";
    messageDiv.textContent = message;

    //insertar el mensaje en el modal
    const modalContent = this.modal.querySelector(".modal-content");
    modalContent.insertBefore(messageDiv, this.form);

    //auto - remover despues de 3 segundos
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  /**
   * Configura los event listeners para el modal
   */
  setupEventListeners() {
    //boton cancelar
    const closeBtn = document.querySelectorAll(".close");
    closeBtn.forEach((button) => {
      button.addEventListener("click", () => this.hideProductModal());
    });

    //cerrar modal al hacer clic fuera
    this.modal.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.hideProductModal();
      }
    });

    //calculo automatico de ganancia
    const costInput = document.getElementById("product-cost");
    const saleInput = document.getElementById("product-sale");
    const profitInput = document.getElementById("product-profit");

    const calculateProfit = () => {
      const cost = parseFloat(costInput.value) || 0;
      const sale = parseFloat(saleInput.value) || 0;

      if (cost > 0 && sale > 0) {
        const profit = calculations.calculateProfitPercentage(cost, sale);
        profitInput.value = calculations.roundToTwoDecimals(profit);
      } else {
        profitInput.value = "";
      }
    };

    costInput.addEventListener("input", calculateProfit);
    saleInput.addEventListener("input", calculateProfit);

    //validacion en tiempo real
    const nameInput = document.getElementById("product-name");
    nameInput.addEventListener("blur", () => {
      if (!nameInput.value) {
        this.showErrorMessage("El nombre del producto es requerido");
      }
    });
  }

  /**
   * Configura los event listeners para las acciones de la tabla
   * @param {Function} onEdit - Callback para editar producto
   * @param {Function} onDelete - Callback para eliminar producto
   */
  setupTableActions(onEdit, onDelete) {
    this.tableBody.addEventListener("click", (event) => {
      const actionBtn = event.target.closest(".action-btn");
      if (!actionBtn) return;

      const action = actionBtn.dataset.action;
      const productId = actionBtn.dataset.id;

      switch (action) {
        case "edit":
          onEdit(productId);
          break;
        case "delete":
          onDelete(productId);
          break;
      }
    });
  }

  /**
   * Confirma la eliminación de un producto
   * @param {string} productName - Nombre del producto
   * @returns {boolean} true si se confirma, false si no
   */
  confirmDelete(productName) {
    return confirm(
      `¿Estás seguro de que quieres eliminar el producto ${productName}? Esta acción no puede deshacerse.`
    );
  }
}

const productView = new ProductView()
