/*
 * Aplicación principal
 * Coordina todos los módulos y maneja la navegación
 */

class InventoryApp {
  constructor() {
    this.currentTab = "products";
    this.setupEventListeners();
    this.initializeApp();
  }

  /**
   * Inicializa la aplicación
   */
  initializeApp() {
    try {
      //cargar configuracion global inicial (IVA)

      //Mostrar la pestaña inicial
      this.showTab("products");
      console.log("ejecutandose");
    } catch (error) {
      console.error("Error al inicializar la aplicación:", error);
      this.showErrorMessage("Error al inicializar la aplicación");
    }
  }

  /**
   * Configura todos los event listeners
   */
  setupEventListeners() {
    //Navegación por pestañas
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const tabName = event.target.dataset.tab;
        this.showTab(tabName);
        this.refreshTabData(tabName);
      });
    });

    //Evenet listeners para cerrar modales con la tecla Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.closeAllModals();
      }
    });
  }

  /**
   * Muestra una pestaña específica
   * @param {string} tabName - Nombre de la pestaña
   */
  showTab(tabName) {
    try {
      //ocultar todas las pestañas
      const tabContents = document.querySelectorAll(".tab-content");
      tabContents.forEach((content) => {
        content.classList.remove("active");
      });

      //remover clase active de todos los botones
      const tabButtons = document.querySelectorAll(".tab-btn");
      tabButtons.forEach((button) => {
        button.classList.remove("active");
      });

      //mostrar pestaña seleccionada
      const selectedTab = document.getElementById(tabName);
      if (selectedTab) {
        selectedTab.classList.add("active");
      }

      //activar el boton correspondiente
      const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
      if (selectedButton) {
        selectedButton.classList.add("active");
      }

      this.currentTab = tabName;
    } catch (error) {
      console.error("Error al mostrar pestaña:", error);
      this.showErrorMessage("Error al mostrar pestaña");
    }
  }

  /**
   * Actualiza los datos de una pestaña específica
   * @param {string} tabName - Nombre de la pestaña
   */
  refreshTabData(tabName) {
    try {
      switch (tabName) {
        case "products":
          productController.loadProducts();
          break;
        case "customers":
          customerController.loadCustomers();
          break;
        case "sales":
          salesController.loadSales();
          break;
        case "settings":
          settingsController.loadSettings();
          break;
      }
    } catch (error) {
      console.error("Error al actualizar los datos de la pestaña:", error);
    }
  }

  /**
   * Cierra todos los modales abiertos
   */
  closeAllModals() {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.classList.remove("show");
      modal.style.display = "none";
    });
  }

  /**
   * Muestra un mensaje de error global
   * @param {string} message - Mensaje a mostrar
   */
  showErrorMessage(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.position = "fixed";
    errorDiv.style.top = "20px";
    errorDiv.style.right = "20px";
    errorDiv.style.zIndex = "9999";
    errorDiv.style.maxWidth = "300px";
    errorDiv.textContent = message;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 5000);
  }

  /**
   * Muestra un mensaje de éxito global
   * @param {string} message - Mensaje a mostrar
   */
  showErrorMessage(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "success-message";
    errorDiv.style.position = "fixed";
    errorDiv.style.top = "20px";
    errorDiv.style.right = "20px";
    errorDiv.style.zIndex = "9999";
    errorDiv.style.maxWidth = "300px";
    errorDiv.textContent = message;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    }, 3000);
  }
}

//Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  try {
    window.InventoryApp = new InventoryApp();

    window.productController = productController;
    window.customerController = customerController;
    //saleController, settingsController
    
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
    alert("Error al cargar la aplicación. Por favor, recarga la página");
  }
});
