class ProductRequest {
  /**
   * @param {string} name - Nombre del producto
   * @param {object} data - Datos adicionales del producto (specs técnicas)
   */
  constructor(name, data = {}) {
    this.name = name;
    this.data = data;
  }

  /**
   * Serializa el objeto a un JSON listo para enviar en el body del request.
   * @returns {object}
   */
  toJSON() {
    return {
      name: this.name,
      data: this.data,
    };
  }
}

module.exports = { ProductRequest };