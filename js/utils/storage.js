/**
 * Módulo de gestión de almacenamiento local
 * Maneja el almacenamiento y recuperación de datos del localStorage
 */

class StorageManager {
  constructor() {
    this.storageKey = "inventory_app_data";
    this.defaultData = {
      products: [],
      customers: [],
      sales: [],
      settings: {
        vatPercentage: 21,
      },
    };
  }

  /**
   * Obtiene los datos del localStorage
   * @returns {Object} Datos del localStorage
   */
  getAllData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : this.defaultData;
    } catch (error) {
      console.error("Error al cargar los datos del localStorage:", error);
      return this.defaultData;
    }
  }

  /**
   * Guarda los datos en localStorage
   * @param {Object} data Datos a guardar en localStorage
   */
  saveAllData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Error al guardar los datos en localStorage:", error);
    }
  }

  /**
   * Obtiene una colección específica (productos, clientes, ventas o configuración)
   * @param {string} collection - Nombre de la colección
   * @returns {Array|Object} Datos de la colección
   */
  getCollection(collection) {
    const data = this.getAllData();
    return data[collection] || (collection === "settings" ? {} : []);
  }

  //guardar la coleccion
  //generar un ID para nuevos elementos
  //encontrar elemento por ID
  //Agregar elemento a una colección
  //Actualizar elemento en una colección
  //Eliminar un elemento de una colección
  //Limpiar toda la data
  //Export e import de toda la data
}

const storage = new StorageManager();
