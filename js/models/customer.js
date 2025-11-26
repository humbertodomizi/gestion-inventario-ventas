/*
 * Modelo de Cliente
 * Maneja la lógica de negocio para clientes
 * (nombre, email, teléfono, dirección)
 */

class CustomerModel {
  constructor() {
    this.storage = storage;
  }

  /**
   * Obtiene todos los clientes
   * @returns {Array} Lista de clientes
   */
  getAllCustomers() {
    return this.storage.getCollection("customers");
  }

  /**
   * Obtiene un cliente por ID
   * @param {number} id - ID del cliente
   * @returns {Object|null} cliente encontrado o null
   */
  getCustomerById(id) {
    return this.storage.findById("customers", id);
  }

  /**
   * Crear nuevo cliente
   * @param {Object} customerData - cliente a crear
   * @returns {Object} cliente creado
   */
  createCustomer(customerData) {
    if (!this.validateCustomerData(customerData)) {
      throw new Error("Datos del cliente inválidos.");
    }

    const customer = {
      name: customerData.name.trim(),
      email: customerData.email?.trim() || "",
      phone: customerData.phone?.trim() || "",
      address: customerData.address?.trim() || "",
    };

    return this.storage.addItem("customers", customer);
  }

  /**
   * Actualizar cliente existente
   * @param {number} id - ID del cliente
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object|null} cliente actualizado o null
   */

  updateCustomer(id, updateData) {
    const existingCustomer = this.getCustomerById(id);

    if (!existingCustomer) {
      throw new Error("Cliente no encontrado.");
    }

    if (updateData.name !== undefined) {
      const validationData = {
        ...existingCustomer,
        ...updateData,
      };

      if (!this.validateCustomerData(validationData)) {
        throw new Error("Datos del cliente inválidos.");
      }
    }

    return this.storage.updateItem("customers", id, updateData);
  }

  /**
   * Elimina un cliente
   * @param {number} id - ID del cliente
   * @returns {boolean} true si se eliminó, false si no se encontró
   */
  deleteCustomer(id) {
    // Verificar si el cliente tiene ventas asociadas
    const sales = this.storage.getCollection("sales");
    const hasSales = sales.some((sale) => sale.customerId === id);

    if (hasSales) {
      throw new Error(
        "No se puede eliminar un cliente que tiene ventas asociadas"
      );
    }

    return this.storage.deleteItem("customers", id);
  }

  /**
   * Valida los datos de un cliente
   * @param {Object} customerData - cliente a validar
   * @returns {boolean} true si es valido, false si no lo es
   */
  validateCustomerData(customerData) {
    if (!customerData.name || customerData.name.trim().length === 0) {
      return false;
    }

    if (!customerData.email || customerData.email.trim().length === 0) {
      return false;
    }

    return true;
  }

  /**
   * Verifica si un email ya existe
   * @param {string} email - Email a verificar
   * @param {number} excludeId - ID del cliente a excluir (para actualizaciones)
   * @returns {boolean} true si el email existe, false si no
   */
  emailExists(email, excludeId = null) {
    const customers = this.getAllCustomers();
    return customers.some(
      (customer) => customer.email === email && customer.id !== excludeId
    );
  }
}

const customerModel = new CustomerModel();
