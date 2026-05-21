import { test, expect } from '@playwright/test';
import { postService } from '../src/services/PostService';
import { postBody } from '../src/types/post.types';

test.describe('Posts API', () => {

  let postServices: postService;

  test.beforeEach(async ({ request }) => {
    postServices = new postService(request);
  });

  test('Debe obtener un post por ID @GET', async () => {
    // ACT
    const {status, body} = await postServices.getPost(1);

    // ASSERT
    expect(status).toBe(200);
    expect(body.id).toBe(1);
    console.log('Título obtenido:',body.title);
  });

  test('Debe crear un nuevo post @POST', async () => {
    const newPost: postBody = {
      title: 'titulo',
      body: 'Contenedor 4',
      userId: 1
    };

    const {status, body} = await postServices.createPost(newPost);

    // ASSERT
    expect(status).toBe(201);
    expect(body.title).toBe(newPost.title);
    expect(body.body).toBe(newPost.body);
    expect(body.userId).toBe(newPost.userId);
  });

});