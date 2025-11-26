/**
 * Vista de Clientes
 * Maneja la interfaz de usuario para la gestión de clientes
 */

class CustomerView {
  constructor() {
    //el cuerpo de la tabla
    this.tableBody = document.querySelector("#customers-table tbody");

    //modal y el titulo del modal
    this.modal = document.querySelector("#customer-modal");
    this.modalTitle = document.querySelector("#customer-modal-title");

    //formulario de cliente
    this.form = document.querySelector("#customer-form");

    //quiero una variable que me diga que ID de cliente esta activo
    this.currentCustomerId = null;
  }

  /**
   * Renderiza la tabla de clientes
   * @param {Array} customers - Lista de clientes
   */
  renderCustomersTable(customers) {
    this.tableBody.innerHTML = "";

    if (customers.length === 0) {
      this.tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <h3>No hay clientes registrados</h3>
            <p>Haz clic en "Agregar Cliente" para comenzar</p>
          </td>
        </tr>
        `;
    }

    customers.forEach((customer) => {
      const row = this.createCustomerRow(customer);
      this.tableBody.appendChild(row);
    });
  }

  /**
   * Crea una fila de cliente para la tabla
   * @param {Object} customer - Datos del cliente
   * @returns {HTMLElement} Fila de la tabla
   */
  createCustomerRow(customer) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${customer.name}</td>
      <td>${customer.email || "-"}</td>
      <td>${customer.phone || "-"}</td>
      <td>${customer.address || "-"}</td>
      <td>
        <div class="table-actions">
        <button class="action-btn edit" data-action="edit" data-id="${
          customer.id
        }" title="Ver detalles"> ✏️ </button>
        <button class="action-btn delete" data-action="delete" data-id="${
          customer.id
        }" title="Ver detalles"> 🗑️ </button> 
        </div>
      </td>
      `;

    return row;
  }

  /**
   * Muestra el modal para crear/editar cliente
   * @param {Object} customer - Datos del cliente (opcional para edición)
   */
  showCustomerModal(customer = null) {
    this.currentCustomerId = customer ? customer.id : null;

    if (customer) {
      this.modalTitle.textContent = "Editar Cliente";
      this.populateForm(customer);
    } else {
      this.modalTitle.textContent = "Agregar Cliente";
      this.clearForm();
    }

    this.modal.classList.add("show");
    this.modal.style.display = "flex";
  }

  /**
   * Oculta el modal
   */
  hideCustomerModal() {
    this.modal.classList.remove("show");
    this.modal.style.display = "none";
    this.currentCustomerId = null;
    this.clearForm();
  }

  /**
   * Llena el formulario con datos del cliente
   * @param {Object} customer - Datos del cliente
   */
  populateForm(customer) {
    document.getElementById("customer-name").value = customer.name;
    document.getElementById("customer-email").value = customer.email || "";
    document.getElementById("customer-phone").value = customer.phone || "";
    document.getElementById("customer-address").value = customer.address || "";
  }

  /**
   * Limpia el formulario
   */
  clearForm() {
    this.form.reset();
  }

  /**
   * Obtiene los datos del formulario
   * @returns {Object} Datos del formulario
   */
  getFormData() {
    return {
      name: document.getElementById("customer-name").value,
      email: document.getElementById("customer-email").value,
      phone: document.getElementById("customer-phone").value,
      address: document.getElementById("customer-address").value,
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
    const closeBtn = document.querySelector(".close");
    closeBtn.addEventListener("click", () => this.hideCustomerModal());

    //boton cancelar
    const cancelBtn = document.getElementById("cancel-customer");
    cancelBtn.addEventListener("click", () => this.hideCustomerModal());

    //cerrar el modal al hacer click fuera
    this.modal.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.hideCustomerModal();
      }
    });
  }

  /**
   * Configura los event listeners para las acciones de la tabla
   * @param {Function} onEdit - Callback para editar cliente
   * @param {Function} onDelete - Callback para eliminar cliente
   */
  setupTableActions(onEdit, onDelete) {
    this.tableBody.addEventListener("click", (event) => {
      const actionBtn = event.target.closest(".action-btn");
      if (!actionBtn) return;

      const action = actionBtn.dataset.action;
      const customerId = actionBtn.dataset.id;

      switch (action) {
        case "edit":
          onEdit(customerId);
          break;
        case "delete":
          onDelete(customerId);
          break;
      }
    });
  }

  /**
   * Confirma la eliminación de un cliente
   * @param {string} customerName - Nombre del cliente
   * @returns {boolean} true si se confirma, false si no
   */
  confirmDelete(customerName) {
    return confirm(
      `¿Estás seguro de que quieres eliminar el cliente ${customerName}? Esta acción no puede deshacerse.`
    );
  }
}

const customerView = new CustomerView();
