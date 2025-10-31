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
   * @param {string} collectionName - Nombre de la colección
   * @returns {Array|Object} Datos de la colección
   */
  getCollection(collectionName) {
    const data = this.getAllData();
    return data[collectionName] || (collectionName === "settings" ? {} : []);
  }

  /**
   * Guarda una colección específica
   * @param {string} collectionName - Nombre de la colección
   * @param {Array|Object} collectionData - Datos de la nueva colección
   */
  saveCollection(collectionName, collectionData) {
    const allData = this.getAllData();
    allData[collectionName] = collectionData;
    this.saveAllData(allData);
  }

  /**
   * Genera un ID único para nuevos elementos
   * @param {string} collectionName - Nombre de la colección
   * @returns {number} ID único
   */
  generateID(collectionName) {
    const collection = this.getCollection(collectionName);
    if (collection.length === 0) return 1;
    return Math.max(...collection.map((item) => item.id)) + 1;
  }

  /**
   * Busca un elemento por ID en una colección
   * @param {string} collectionName - Nombre de la colección
   * @param {number} id - ID del elemento
   * @returns {Object|null} Elemento encontrado o null
   */
  findById(collectionName, id) {
    const collection = this.getCollection(collectionName);
    return collection.find((item) => item.id === parseInt(id));
  }

  /**
   * Agrega un nuevo elemento a la colección
   * @param {string} collectionName - Nombre de la colección
   * @param {Object} item - Elemento a agregar
   * @returns {Object} Elemento agregado con ID
   */
  addItem(collectionName, item) {
    //PRIMERO DEBEMOS PEDIR LA COLECCION
    const collection = this.getCollection(collectionName); // [producto1, producto2, producto3]

    //DESPUES DEBEMOS CREAR EL OBJETO A GUARDAR Y AGREGARLE UN ID NUEVO
    const newItem = {
      ...item,
      id: this.generateID(collectionName),
      createdAt: new Date().toISOString(), //fecha de creación en formato ISO (YYYY-MM-DDTHH:MM:SS.SSSZ)
    };

    //DESPUES DEBEMOS GUARDAR LA COLECCION
    collection.push(newItem);
    this.saveCollection(collectionName, collection);
    return newItem;
  }

  /**
   * Actualiza un elemento de una colección
   * @param {string} collectionName - Nombre de la colección
   * @param {number} id - ID del elemento
   * @param {Object} itemUpdates - Datos a actualizar
   * @returns {Object|null} Elemento actualizado o null si no lo encuentra
   */
  updateItem(collectionName, id, itemUpdates) {
    //PRIMERO DEBEMOS PEDIR LA COLECCION
    const collection = this.getCollection(collectionName); // [producto1, producto2, producto3, producto4]
    const index = collection.findIndex((item) => item.id === parseInt(id));

    //ACA PODEMOS METER UN CONDICIONAL POR SI NO LO ENCUENTRA
    if (index === -1) return null;

    //DESPUES DEBEMOS CREAR EL OBJETO A GUARDAR Y AGREGARLE UN ID NUEVO
    collection[index] = {
      ...collection[index],
      ...itemUpdates,
      updatedAt: new Date().toISOString(), //fecha de creación en formato ISO (YYYY-MM-DDTHH:MM:SS.SSSZ)
    };

    //DESPUES DEBEMOS GUARDAR LA COLECCION
    this.saveCollection(collectionName, collection);
    return collection[index];
  }

  /**
   * Elimina un elemento de una colección
   * @param {string} collectionName - Nombre de la colección
   * @param {number} id - ID del elemento
   * @returns {boolean} True si se eliminó, false si no se encontró
   */
  deleteItem(collectionName, id) {
    //PRIMERO DEBEMOS PEDIR LA COLECCION
    const collection = this.getCollection(collectionName); // [producto1, producto2, producto3, producto4]
    const index = collection.findIndex((item) => item.id === parseInt(id));

    //ACA PODEMOS METER UN CONDICIONAL POR SI NO LO ENCUENTRA
    if (index === -1) return false;

    //DESPUES DEBEMOS GUARDAR LA COLECCION
    collection.splice(index, 1);
    this.saveCollection(collectionName, collection);
    return true;
  }

  clearAllData() {
    localStorage.removeItem(this.storageKey);
  }
}

const storage = new StorageManager();
