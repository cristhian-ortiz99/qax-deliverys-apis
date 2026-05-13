const { PostResponse } = require("../models/PostResponse");

class PostService {
  constructor(request) { 
    this.request = request;
    this.baseEndpoint = "/posts"
   }

  async getPost(id) { 
    const response = await this.request.get(`${this.baseEndpoint}/${id}`);
    const body = await response.json();
    return new PostResponse(body);
   }       // GET /posts/:id  → PostResponse

  async createPost(postRequest) { 
    const response = await this.request.post(this.baseEndpoint, {
      data: postRequest.toJSON() // Serializa automáticamente
    });
    const body = await response.json();
    return { status: response.status(), body: new PostResponse(body) };
   } // POST /posts    → { status, body: PostResponse }

  async updatePost(id, postRequest) { 
    const response = await this.request.put(`${this.baseEndpoint}/${id}`, {
      data: postRequest.toJSON()
    });
    return { status: response.status() };
   } // PUT /posts/:id  → { status }

  async patchPost(id, fields) { 
    const response = await this.request.patch(`${this.baseEndpoint}/${id}`, {
      data: fields
    });
    return { status: response.status() };
   }   // PATCH /posts/:id → { status }

   async deletePost(id) { 
    const response = await this.request.delete(`${this.baseEndpoint}/${id}`);
    return { status: response.status() };
   } 
}

module.exports = { PostService };