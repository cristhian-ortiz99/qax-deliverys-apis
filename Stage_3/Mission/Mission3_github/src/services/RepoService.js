const { RepoResponse } = require('../models/RepoResponse');

class RepoService {
  constructor(request) {
    this.request = request;
    this.endpoint = '/repos';
    this.headers = {

      Authorization:
        `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept':'application/vnd.github+json',
        'X-GitHub-Api-Version':'2022-11-28',
        'Content-Type':'application/json'
    };
  }

  async getProduct(nombre) {
    const response = await this.request.get(`${this.endpoint}/${process.env.GITHUB_USERNAME}/${nombre}`,{
        headers: this.headers
    });
    const body = await response.json();
    return {
      status: response.status(),
      body: new RepoResponse(body),
    };
  }

  async createProduct(productRequest) {
    const response = await this.request.post(`/user/repos`, {
        headers: this.headers
    ,
      data: productRequest.toJSON(),
    });
    const body = await response.json();
    return {
      status: response.status(),
      body: new RepoResponse(body),
    };
  }

  
}
module.exports = { RepoService };