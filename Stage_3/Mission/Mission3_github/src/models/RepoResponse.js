
class RepoResponse {
  
  constructor(data) {
    this.login = data.login;
    this.id = data.id;
    this.avatar_url = data.avatar_url || null;
    this.repos_url = data.repos_url || null;
    this.type = data.type || null;
    this.name = data.name;
  }


  hasValidId() {
    return this.id !== undefined && this.id !== null && this.id !== '';
  }

  hasLogin() {
    return typeof this.login === 'string' && this.login.trim().length > 0;
  }

  hasIdGreaterThanZero() {
    return id !== null && id > 0;
  }
}

module.exports = { RepoResponse }