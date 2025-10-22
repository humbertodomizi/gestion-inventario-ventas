/**
 * Módulo de cálculos finacieros
 * Maneja todos los cálculos relacionados con precios, IVA y ganancias
 */

class CalculationsUtils {
  constructor() {
    this.vatPercentage = 21; //Procentaje de IVA por defecto
  }

  /**
   * Actualiza el porcentaje de IVA global
   * @param {number} percentage - Nuevo porcentaje de IVA
   */
  setVatPercetange(percentage) {
    this.vatPercentage = parseFloat(percentage) || 0;
  }

  /**
   * Obtiene el porcentaje de IVA actual
   * @returns {number} - Retorna el porcentaje de IVA
   */
  getVatPercentage() {
    return this.vatPercentage;
  }

  /**
   * Calcula el porcentaje de ganancia basado en precio de costo y precio de venta
   * @param {number} costPrice - Precio de costo
   * @param {number} salePrice - Precio de venta
   * @returns {number} - Porcetaje de ganancia
   */
  calculateProfitPercentage(costPrice, salePrice) {
    if (costPrice <= 0) return 0;
    return ((salePrice - costPrice) / costPrice) * 100;
  }

  /**
   * Calcula el precio de venta basado en precio de costo y el porcentaje de ganancia
   * @param {number} costPrice - Precio de costo
   * @param {number} profitPercentage - Porcetaje de ganancia
   * @returns {number} - Precio de venta calculado
   */
  calculateSalePrice(costPrice, profitPercentage) {
    return costPrice * (1 + profitPercentage / 100);
  }

  /**
   * Calcula el IVA sobre un precio
   * @param {number} price - Precio base
   * @param {number} vatPercentage - Porcentaje de IVA (opcional, usa el global si no se le pasa nada)
   * @returns {number} Valor del IVA calculado
   */
  calculateVat(price, vatPercentage = null) {
    const vat = vatPercentage !== null ? vatPercentage : this.vatPercentage;
    return price * (vat / 100);
  }

  /**
   * Calcula el precio total con IVA incluido
   * @param {number} price - Precio base
   * @param {number} vatPercentage - Porcentaje de IVA (opcional, usa el global si no se le pasa nada)
   * @returns {number} Valor del IVA calculado
   */
  calculatePriceWithVat(price, vatPercentage = null) {
    const vat = vatPercentage !== null ? vatPercentage : this.vatPercentage;
    return price * (1 + vat / 100);
  }

  /**
   * Calcula el precio base sin IVA a partir del precio con IVA
   * @param {number} priceWithVat - Precio con IVA
   * @param {number} vatPercentage - Porcentaje de IVA (opcional, usa el global si no se le pasa nada)
   * @returns {number} Valor del IVA calculado
   */
  calculatePriceWithoutVat(priceWithVat, vatPercentage = null) {
    const vat = vatPercentage !== null ? vatPercentage : this.vatPercentage;
    return priceWithVat / (1 + vat / 100);
  }

  /**
   * Calcula el total de una venta con IVA
   * @param {number} unitPrice - Precio unitario del producto
   * @param {number} quantity - Cantidad vendida
   * @param {number} vatPercentage - Porcentaje de IVA (opcional, usa el global si no se le pasa nada)
   * @returns {Object} Objeto con subtotal, IVA y total
   */
  calculateSaleTotal(unitPrice, quantity, vatPercentage = null) {
    const vatValue = this.calculateVat(unitPrice, vatPercentage);
    const subtotal = unitPrice * quantity;
    const total = subtotal + vatValue;

    return {
      subtotal: subtotal,
      vat: vatValue,
      total: total,
      vatPercentage:
        vatPercentage !== null ? vatPercentage : this.vatPercentage,
    };
  }

  /**
   * Calcula la ganancia total de una venta
   * @param {number} costPrice - Precio de costo del producto
   * @param {number} salePrice - Precio de venta del producto
   * @param {number} quantity - Cantidad vendida
   * @returns {Object} Objeto con ganancia unitaria y total
   */
  calculateProfit(costPrice, salePrice, quantity) {
    const unitProfit = salePrice - costPrice;
    const totalProfit = unitProfit * quantity;
    const profitPercentage = this.calculateProfitPercentage(
      costPrice,
      salePrice
    );

    return {
      unitProfit: unitProfit,
      totalProfit: totalProfit,
      profitPercentage: profitPercentage,
    };
  }

  /**
   * Formatea un número como moneda
   * @param {number} amount - Cantidad a formatear
   * @returns {string} Cantidad formateada como moneda ------->> 0.2498789 ---->> $0.25
   */
  formatCurrency(amount) {
    const value = parseFloat(amount).toFixed(2);
    return `$${value}`;
  }

  /**
   * Formatea un porcentaje
   * @param {number} percentage - Porcentaje a formatear
   * @returns {string} Porcentaje formateado ------->> 2.162154 ---->> 2.16%
   */
  formatPercentage(percentage) {
    const value = parseFloat(percentage).toFixed(2);
    return `${value}%`;
  }

  /**
   * Valida que un precio sea válido
   * @param {number} price - Precio a validar
   * @returns {boolean} true si es valido, false si no
   */
  isValidPrice(price){
    return !isNaN(price) && price >= 0;
  }

  //que una cantidad que le pasemos sea valida

  //redondear a 2 decimales

  //calcular estadisticas de ventas
}
