class RepoRequest {
  
  constructor(name, description, isPrivate, autoInit) {
    this.name = name;
    this.description = description;
    this.private = isPrivate;
    this.auto_init = autoInit;
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      private: this.private,
      auto_init: this.auto_init,
    };
  }
}

module.exports = { RepoRequest };