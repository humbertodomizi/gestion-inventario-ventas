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
}

//Instancia global de la clase para que se pueda usar en cualquier parte del proyecto
const calculations = new CalculationsUtils();
