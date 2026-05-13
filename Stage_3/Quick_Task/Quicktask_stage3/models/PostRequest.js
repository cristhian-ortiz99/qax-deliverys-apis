

class PostRequest {
  constructor(title, body, userId) {
    this.title = title;
    this.body = body;
    this.userId = userId;
  }

  toJSON() {
    return {
        title: this.title,
        body: this.body,
        userId: this.userId
    };
  }
}

module.exports = { PostRequest };