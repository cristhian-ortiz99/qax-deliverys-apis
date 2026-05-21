const { RepoResponse } = require('../models/RepoResponse');

class UserService {
  constructor(request) {
    this.request = request;
    this.endpoint = '/users';
    this.headers = {

      Authorization:
        `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept':'application/vnd.github+json',
        'X-GitHub-Api-Version':'2022-11-28',
    };
  }

  async getUser(username) {
    const response = await this.request.get(`${this.endpoint}/${process.env.GITHUB_USERNAME}`,{
        headers: this.headers
    });
    const body = await response.json();
    return {
      status: response.status(),
      body: new RepoResponse(body),
    };
  }

  
}
module.exports = { UserService };