import { beforeEach, describe, expect, test } from "bun:test";
import { createInMemoryApp } from "../src/controllers/main";

describe("chat tests", () => {
  let app = createInMemoryApp();

  beforeEach(() => {
    app = createInMemoryApp();
  });

  async function getToken(email = "test@test.com") {
    await app.request("/api/v1/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: "password123",
        name: "Chat User",
      }),
    });
    const loginResponse = await app.request("/api/v1/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: "password123",
      }),
    });

    const token = (await loginResponse.json()) as { token: string };
    return token;
  }

  async function createChat(token: string) {
    const createChatResponse = await app.request("/api/v1/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: "Test Chat" }),
    });
    const response = await createChatResponse.json();
    //const chatId = response.data.id; //unsafe member access on any value
    const typedResponse = response as { data: { id: string } };
    const chatId = typedResponse.data.id;
    return chatId;
  }

  test("GET /chat/ - get user chats", async () => {
    const token = await getToken();
    const chatId = await createChat(token.token);
    const response = await app.request("/api/v1/chat/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token.token}` },
    });
    expect(response.status).toBe(200);
    const responseData = (await response.json()) as { data: { id: string }[] };
    const data = responseData.data;
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBe(1);
    expect(data[0].id).toBe(chatId);
  });

  test("GET /chat/ - get user chats when multiple chat and users are available", async () => {
    const token = await getToken();
    const token2 = await getToken("email@email.com");
    const chatId = await createChat(token.token);
    const chatId2 = await createChat(token2.token);
    const response = await app.request("/api/v1/chat/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token.token}` },
    });
    expect(response.status).toBe(200);
    const responseData = (await response.json()) as { data: { id: string }[] };
    const data = responseData.data;
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBe(1);
    expect(data[0].id).toBe(chatId);

    const response2 = await app.request("/api/v1/chat/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token2.token}` },
    });
    expect(response.status).toBe(200);
    const responseData2 = (await response2.json()) as { data: { id: string }[] };
    const data2 = responseData2.data;
    expect(Array.isArray(data2)).toBeTruthy();
    expect(data2.length).toBe(1);
    expect(data2[0].id).toBe(chatId2);
  });

  test("POST, GET /chat/:id/message/ - create and get chat messages", async () => {
    const token = await getToken();
    const chatId = await createChat(token.token);
    await app.request(`/api/v1/chat/${chatId}/message/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify({ message: "Hello World" }),
    });

    const response = await app.request(`/api/v1/chat/${chatId}/message/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token.token}` },
    });

    expect(response.status).toBe(200);
    const messages = (await response.json()) as { data: { message: string }[] };
    expect(messages.data).toBeInstanceOf(Array);
    expect(messages.data.length).toBe(2);
    expect(messages.data[0].message).toBe("Hello World");
    expect(messages.data[1].message).toBe("dummy response");
  });

  test("POST /chat - incorrect body", async () => {
    const token = await getToken();
    const jsonBody = {
      name: "",
    };

    const response = await app.request("/api/v1/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify(jsonBody),
    });

    expect(response.status).toBe(400);
    const json = (await response.json()) as { success: boolean; error: { name: string } };
    expect(json.success).toBe(false);
    expect(json.error.name).toBe("ZodError");
  });
  test("POST /chat/:id/message - incorrect body", async () => {
    const token = await getToken();
    const response = await app.request(`/api/v1/chat/a/message/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify({}),
    });
    expect(response.status).toBe(400);
    const json = (await response.json()) as { success: boolean; error: { name: string } };
    expect(json.success).toBe(false);
    expect(json.error.name).toBe("ZodError");
  });
});
