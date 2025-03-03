export default {
  async fetch(request, env, ctx) {
    return await handleRequest(request, env);
  }
};

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Environment variables from wrangler.toml or Cloudflare dashboard
  const API_KEY = env.API_KEY || "sk-123456";
  const BASE_URL = "https://grok.com";
  const TEMP_COOKIE = env.TEMP_COOKIE || "";

  const headers = {
    "accept": "*/*",
    "content-type": "text/plain;charset=UTF-8",
    "origin": "https://grok.com",
    "cookie": TEMP_COOKIE,
  };

  if (path === "/v1/models" && request.method === "GET") {
    // Return list of models
    const models = [
      "grok-2",
      "grok-2-imageGen",
      "grok-2-search",
      "grok-3",
      "grok-3-search",
      "grok-3-imageGen",
      "grok-3-deepsearch",
      "grok-3-reasoning",
    ];
    return new Response(
      JSON.stringify({
        object: "list",
        data: models.map((id) => ({
          id,
          object: "model",
          created: Math.floor(Date.now() / 1000),
          owned_by: "grok",
        })),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  if (path === "/v1/chat/completions" && request.method === "POST") {
    // Handle chat completions
    const body = await request.json();
    if (request.headers.get("Authorization") !== `Bearer ${API_KEY}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Simplified request to Grok API
    const response = await fetch(`${BASE_URL}/api/rpc`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        rpc: "createConversation",
        req: { temporary: false },
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to create conversation" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { conversationId } = await response.json();
    const chatResponse = await fetch(
      `${BASE_URL}/api/conversations/${conversationId}/responses`,
      {
        method: "POST",
        headers: { ...headers, accept: "text/event-stream" },
        body: JSON.stringify(body),
      }
    );

    return new Response(chatResponse.body, {
      status: chatResponse.status,
      headers: chatResponse.headers,
    });
  }

  return new Response("API running", { status: 200 });
}
