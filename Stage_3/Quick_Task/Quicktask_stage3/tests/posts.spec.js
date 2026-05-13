const { test, expect } = require("@playwright/test");
const { PostService } = require("../services/PostService");
const { PostRequest } = require("../models/PostRequest");
const { PostResponse } = require("../models/PostResponse");

test.describe("Posts API @smoke", () => {

  test("debe obtener un post por ID", async ({ request }) => {
    const postService = new PostService(request);
    let post;
    await test.step("Llamar al endpoint GET /posts/1", async () => {  
        post = await postService.getPost(1);
    });
    await test.step("Validar status 200 y estructura del response", async () => {
      expect(post.id).toBeDefined();
      expect(post.hasTitle).toBeTruthy();
    });
  });

  test("debe crear un post correctamente", async ({ request }) => {
    // Implementa usando PostService y PostRequest
    const postService = new PostService(request);
    const newPost = new PostRequest("era","lorem",20);

    const {status, body} = await postService.createPost(newPost);

    expect(status).toBe(201);
    expect(body.title).toBe("era");

  });

  test("debe actualizar un post con PUT @regression", async ({ request }) => {
    // Implementa — recuerda enviar el objeto completo
    const postService = new PostService(request);
    const newPost = new PostRequest("tele","lorem",45,101);

    const {status} = await postService.updatePost(1,newPost);

    expect(status).toBe(200);

  });

  test("debe actualizar solo el título con PATCH @regression", async ({ request }) => {
    // Implementa — solo envía el campo title
    const postService = new PostService(request);

    const {status} = await postService.patchPost(1,{
        title: "gous"
    });

    expect(status).toBe(200);
  });

  test.skip("debe eliminar un post", async ({ request }) => {
    const postService = new PostService(request);

    const {status} = await postService.deletePost(1);

    expect(status).toBe(200);
  });

});