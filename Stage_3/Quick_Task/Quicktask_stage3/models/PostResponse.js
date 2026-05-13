
class PostResponse {
  constructor(data) {
    this.title = data.title;
    this.body = data.body;
    this.userId = data.userId;
    this.id = data.id;
  }

  hasTitle() {
    return this.title !== '';
  }
}

module.exports = { PostResponse };