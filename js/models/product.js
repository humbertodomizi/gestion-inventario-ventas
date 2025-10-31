/*
 * Modelo de Producto
 * Maneja la lógica de negocio para productos
 * (nombre, descripción, cantidad, precio de costo, precio de venta y % de ganancia auto calculado)
 */

class ProductModel {
  constructor() {
    this.storage = storage;
    this.calculations = calculations
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
   * Obtiene un producto por ID
   * @param {Object} productData - Producto a crear
   * @returns {Object} Producto creado
   */
  createProduct(productData) {

    //FALTA VALIDAR SI LA DATA ESTA OK

    const profitPercentage = this.calculations.calculateProfitPercentage(
        productData.costPrice,
        productData.salePrice
    )

    const product = {
        name: productData.name.trim(),
        description: productData.description.trim() || "",
        quantity: parseInt(productData.quantity),
        costPrice: parseInt(productData.costPrice),
        salePrice: parseInt(productData.salePrice),
        profitPercentage: this.calculations.roundToTwoDecimals(profitPercentage)    
    }

    return this.storage.addItem('products', product)
  }
}

const productModel = new ProductModel();
