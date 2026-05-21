// src/models/ProductResponse.js

class ProductResponse {
  /**
   * Deserializa el JSON de la API en un objeto manejable.
   * @param {object} data - El body del response
   */
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.data = data.data || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  /**
   * Verifica que el producto tiene un ID válido.
   * @returns {boolean}
   */
  hasValidId() {
    return this.id !== undefined && this.id !== null && this.id !== '';
  }

  /**
   * Verifica que el nombre no está vacío.
   * @returns {boolean}
   */
  hasName() {
    return typeof this.name === 'string' && this.name.trim().length > 0;
  }

  /**
   * Obtiene el precio del producto si existe en data.
   * @returns {number|null}
   */
  getPrice() {
    return this.data?.price ?? null;
  }

  /**
   * Verifica que el precio es mayor a cero.
   * @returns {boolean}
   */
  hasPriceGreaterThanZero() {
    const price = this.getPrice();
    return price !== null && price > 0;
  }
}

module.exports = { ProductResponse }