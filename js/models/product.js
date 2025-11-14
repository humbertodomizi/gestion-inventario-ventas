/*
 * Modelo de Producto
 * Maneja la lógica de negocio para productos
 * (nombre, descripción, cantidad, precio de costo, precio de venta y % de ganancia auto calculado)
 */

class ProductModel {
  constructor() {
    this.storage = storage;
    this.calculations = calculations;
  }

  /**
   * Obtiene todos los productos
   * @returns {Array} Lista de productos
   */
  getAllProducts() {
    return this.storage.getCollection("products"); // --->>> [product1, product2]
  }

  /**
   * Obtiene un producto por ID
   * @param {number} id - ID del producto
   * @returns {Object|null} Producto encontrado o null
   */
  getProductById(id) {
    return this.storage.findById("products", id);
  }

  /**
   * Crear nuevo producto
   * @param {Object} productData - Producto a crear
   * @returns {Object} Producto creado
   */
  createProduct(productData) {
    if (!this.validateProductData(productData)) {
      throw new Error("Datos del producto inválidos.");
    }

    const profitPercentage = this.calculations.calculateProfitPercentage(
      productData.costPrice,
      productData.salePrice
    );

    const product = {
      name: productData.name.trim(),
      description: productData.description.trim() || "",
      quantity: parseInt(productData.quantity),
      costPrice: parseInt(productData.costPrice),
      salePrice: parseInt(productData.salePrice),
      profitPercentage: this.calculations.roundToTwoDecimals(profitPercentage),
    };

    return this.storage.addItem("products", product);
  }

  /**
   * Actualizar producto existente
   * @param {number} id - ID del producto
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object|null} Producto actualizado o null
   */

  updateProduct(id, updateData) {
    const existingProduct = this.getProductById(id);

    if (!existingProduct) {
      throw new Error("Producto no encontrado.");
    }

    //destructuring
    const { name, costPrice, salePrice } = updateData;

    if (
      name !== undefined ||
      costPrice !== undefined ||
      salePrice !== undefined
    ) {
      const validationData = {
        ...existingProduct,
        ...updateData,
      };

      if (!this.validateProductData(validationData)) {
        throw new Error("Datos del producto inválidos.");
      }
    }

    //Recalcular porcentaje de ganancia si se actualizan precios
    let costPriceUpdated = existingProduct.costPrice;
    let salePriceUpdated = existingProduct.salePrice;

    if (costPrice !== undefined) {
      costPriceUpdated = costPrice;
    }

    if (salePrice !== undefined) {
      salePriceUpdated = salePrice;
    }

    updateData.profitPercentage = calculations.calculateProfitPercentage(
      costPriceUpdated,
      salePriceUpdated
    );

    return this.storage.updateItem("products", id, updateData);
  }

  /**
   * Elimina un producto
   * @param {number} id - ID del producto
   * @returns {boolean} true si se eliminó, false si no se encontró
   */
  deleteProduct(id) {
    // Verificar si el producto tiene ventas asociadas
    const sales = this.storage.getCollection("sales");
    const hasSales = sales.some((sale) => sale.productId === id);

    if (hasSales) {
      throw new Error(
        "No se puede eliminar un producto que tiene ventas asociadas"
      );
    }

    return this.storage.deleteItem("products", id);
  }

  /**
   * Valida los datos de un producto
   * @param {Object} productData - Producto a validar
   * @returns {boolean} true si es valido, false si no lo es
   */
  validateProductData(productData) {
    //validar nombre, cantidad, precios, que el precio de venta sea mayor o igual al precio de costo

    if (!productData.name) {
      return false;
    }

    if (!calculations.isValidQuantity(productData.quantity)) {
      return false;
    }

    if (
      !calculations.isValidPrice(productData.costPrice) ||
      !calculations.isValidPrice(productData.salePrice)
    ) {
      return false;
    }

    if (productData.salePrice < productData.costPrice) {
      return false;
    }

    return true;
  }

  /**
   * Busca productos por nombre
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Array} Productos que coinciden con la búsqueda
   */
  searchProducts(searchTerm) {
    const products = this.getAllProducts();
    const word = searchTerm.toLowerCase().trim();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(word) ||
        product.description.toLowerCase().includes(word)
    );
  }

  /**
   * Obtiene productos con stock bajo
   * @param {number} threshold - Umbral de stock bajo (por defecto 10)
   * @returns {Array} Productos con stock bajo
   */

  getLowStockProducts(threshold = 10) {
    const products = this.getAllProducts();
    return products.filter((product) => product.quantity <= threshold);
  }

  /**
   * Actualiza el stock de un producto
   * @param {number} id - ID del producto
   * @param {number} quantityChange - Cambio en la cantidad (positivo para agregar, negativo para restar)
   * @returns {Object|null} Producto actualizado o null
   */
  updateStock(id, quantityChange) {
    const existingProduct = this.getProductById(id);

    if (!existingProduct) {
      throw new Error("Producto no encontrado.");
    }

    const newQuantity = existingProduct.quantity + quantityChange;
    if (newQuantity < 0) {
      throw new Error("No se puede tener stock negativo");
    }

    return this.updateProduct(id, { quantity: newQuantity });
  }

  /**
   * Verifica si un producto tiene stock suficiente
   * @param {number} id - ID del producto
   * @param {number} requiredQuantity - Cantidad requerida
   * @returns {boolean} true si hay stock suficiente, false si no
   */
  hasEnoughStock(id, requiredQuantity) {
    const existingProduct = this.getProductById(id);
    if (!existingProduct) {
      return false;
    }

    return existingProduct.quantity >= requiredQuantity;
  }
}

const productModel = new ProductModel();
