/*
 * Controlador de Clientes
 * Maneja la lógica de negocio y coordinación entre modelo y vista
 */

class CustomerController {
  constructor() {
    this.model = customerModel;
    this.view = customerView;
    this.setupEventListeners();
    this.loadCustomers();
  }

  /**
   * Configura todos los event listeners
   */
  setupEventListeners() {
    //Boton agregar cliente
    document
      .getElementById("add-customer-btn")
      .addEventListener("click", () => {
        this.view.showCustomerModal();
      });

    //Formulario de cliente
    document
      .getElementById("customer-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleFormSubmit();
      });

    //Configurar la vista
    this.view.setupEventListeners();
    this.view.setupTableActions(
      (id) => this.editCustomer(id),
      (id) => this.deleteCustomer(id)
    );
  }

  /**
   * Carga y muestra todos los clientes
   */
  loadCustomers() {
    try {
      const customers = this.model.getAllCustomers();
      this.view.renderCustomersTable(customers);
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
      this.view.showErrorMessage("Error al cargar los clientes");
    }
  }

  /**
   * Maneja el envío del formulario
   */
  handleFormSubmit() {
    try {
      const formData = this.view.getFormData();

      if (this.view.currentCustomerId) {
        this.updateCustomer(this.view.currentCustomerId, formData);
      } else {
        this.createCustomer(formData);
      }
    } catch (error) {
      console.error("Error al procesar formulario:", error);
      this.view.showErrorMessage("Error al procesar formulario");
    }
  }

  /**
   * Crea un nuevo cliente
   * @param {Object} customerData - Datos del cliente
   */
  createCustomer(customerData) {
    try {
      //Verificando si el email existe
      if (customerData.email && this.model.emailExists(customerData.email)) {
        this.view.showErrorMessage("Ya existe un cliente con este email");
        return;
      }

      this.model.createCustomer(customerData);
      this.view.showSuccessMessage("Cliente creado exitosamente");
      this.view.hideCustomerModal();
      this.loadCustomers();
    } catch (error) {
      console.error("Error al crear cliente:", error);
      this.view.showErrorMessage("Error al crear cliente");
    }
  }

  /**
   * Actualiza un cliente existente
   * @param {number} id - ID del cliente
   * @param {Object} updateData - Datos a actualizar
   */
  updateCustomer(id, updateData) {
    try {
      //Verificando si el email existe
      if (
        updateData.email &&
        this.model.emailExists(updateData.email, id)
      ) {
        this.view.showErrorMessage("Ya existe un cliente con este email");
        return;
      }

      this.model.updateCustomer(id, updateData);
      this.view.showSuccessMessage("Cliente actualizado exitosamente");
      this.view.hideCustomerModal();
      this.loadCustomers();
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      this.view.showErrorMessage("Error al actualizar cliente");
    }
  }

  /**
   * Muestra el modal para editar un cliente
   * @param {number} id - ID del cliente
   */
  editCustomer(id) {
    try {
      const customer = this.model.getCustomerById(id);
      if (customer) {
        this.view.showCustomerModal(customer);
      } else {
        this.view.showErrorMessage("Cliente no encontrado");
      }
    } catch (error) {
      console.error("Error al abrir modal para editar cliente:", error);
      this.view.showErrorMessage("Error al abrir modal para editar cliente");
    }
  }

  /**
   * Elimina un cliente
   * @param {number} id - ID del cliente
   */
  deleteCustomer(id) {
    try {
      const customer = this.model.getCustomerById(id);
      if (!customer) {
        this.view.showErrorMessage("cLIENTE no encontrado");
        return;
      }

      if (this.view.confirmDelete(customer.name)) {
        this.model.deleteCustomer(id);
        this.view.showSuccessMessage("Cliente eliminado exitosamente");
        this.loadCustomers();
      }
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      this.view.showErrorMessage("Error al eliminar cliente");
    }
  }
}

const customerController = new CustomerController();
