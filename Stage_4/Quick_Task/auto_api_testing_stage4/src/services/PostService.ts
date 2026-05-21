import { APIRequestContext, APIResponse } from '@playwright/test';
import type { postBody, postResponse } from '../types/post.types';

export class postService {
  // Encapsulamiento: el request está guardado dentro de la clase
  private readonly request: APIRequestContext;
  private endpoint = '/posts';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getPost(id: number): Promise<{
          status: number;
          body: postResponse;
      }> {

    const response: APIResponse = await this.request.get(`${this.endpoint}/${id}`);
    const body: postResponse = await response.json();
    
    return {
          status: response.status(),
          body
          };
  }

  async createPost(payload: postBody): Promise<{
          status: number;
          body: postResponse;
            }> {
    const response: APIResponse = await this.request.post(this.endpoint,
      {
        data: payload
      }
      );
    const body: postResponse = await response.json();
      return {
          status: response.status(),
          body
            };
            }
}