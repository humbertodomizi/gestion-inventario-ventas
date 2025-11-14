/*
 * Controlador de Productos
 * Maneja la lógica de negocio y coordinación entre modelo y vista
 */

class ProductController {
  constructor() {
    this.model = productModel;
    this.view = productView;
    this.setupEventListeners();
    this.loadProducts();
  }

  /**
   * Configura todos los event listeners
   */
  setupEventListeners() {
    //Boton agregar producto
    document.getElementById("add-product-btn").addEventListener("click", () => {
      this.view.showProductModal();
    });

    //Submit del form de producto
    document
      .getElementById("product-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleFormSubmit();
      });

    //Configurar la vista
    this.view.setupEventListeners();
    this.view.setupTableActions(
      (id) => this.editProduct(id),
      (id) => this.deleteProduct(id)
    );
  }

  /**
   * Carga y muestra todos los productos
   */
  loadProducts() {
    try {
      const products = this.model.getAllProducts();
      this.view.renderProductsTable(products);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      this.view.showErrorMessage("Error al cargar los productos");
    }
  }

  handleFormSubmit() {
    try {
      const formData = this.view.getFormData();

      if (this.view.currentProductId) {
        this.updateProduct(this.view.currentProductId, formData);
      } else {
        this.createProduct(formData);
      }
    } catch (error) {
      console.error("Error al procesar formulario:", error);
      this.view.showErrorMessage("Error al procesar formulario");
    }
  }

  /**
   * Crea un nuevo producto
   * @param {Object} productData - Datos del producto
   */
  createProduct(productData) {
    try {
      this.model.createProduct(productData);
      this.view.showSuccessMessage("Producto creado exitosamente.");
      this.view.hideProductModal();
      this.loadProducts();
    } catch (error) {
      console.error("Error al crear producto:", error);
      this.view.showErrorMessage("Error al crear producto");
    }
  }

  /**
   * Crea un nuevo producto
   * @param {number} id - ID del producto
   * @param {Object} productData - Datos del producto
   */
  updateProduct(id, productData) {
    try {
      this.model.updateProduct(id, productData);
      this.view.showSuccessMessage("Producto actualizado exitosamente.");
      this.view.hideProductModal();
      this.loadProducts();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      this.view.showErrorMessage("Error al actualizar producto");
    }
  }

  /**
   * Muestra el modal para editar un producto
   * @param {number} id - ID del producto
   */
  editProduct(id) {
    try {
      const product = this.model.getProductById(id);
      if (product) {
        this.view.showProductModal(product);
      } else {
        this.view.showErrorMessage("Producto no encontrado");
      }
    } catch (error) {
      console.error("Error al abrir modal para editar producto:", error);
      this.view.showErrorMessage("Error al abrir modal para editar producto");
    }
  }

  /**
   * Elimina un producto
   * @param {number} id - ID del producto
   */
  deleteProduct(id) {
    try {
      const product = this.model.getProductById(id);
      if (!product) {
        this.view.showErrorMessage("Producto no encontrado");
        return;
      }

      if (this.view.confirmDelete(product.name)) {
        this.model.deleteProduct(id);
        this.view.showSuccessMessage("Producto eliminado exitosamente");
        this.loadProducts();
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      this.view.showErrorMessage("Error al eliminar producto");
    }
  }

  /**
   * Actualiza el stock de un producto
   * @param {number} id - ID del producto
   * @param {number} quantityChange - Cambio en la cantidad
   */
  updateStock(id, quantityChange) {
    try {
      this.model.updateStock(id, quantityChange);
      this.loadProducts();
    } catch (error) {
      console.error("Error al actualizar stock del producto:", error);
      this.view.showErrorMessage("Error al actualizar stock del producto");
    }
  }

  /**
   * Verifica si un producto tiene stock suficiente
   * @param {number} id - ID del producto
   * @param {number} requiredQuantity - Cantidad requerida
   * @returns {boolean} true si hay stock suficiente
   */
  hasEnoughStock(id, requriedQuantity) {
    try {
      return this.model.hasEnoughStock(id, requriedQuantity);
    } catch (error) {
      console.error("Error al verificar stock:", error);
      return false;
    }
  }
}

const productController = new ProductController();
