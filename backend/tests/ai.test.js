import test from "node:test";
import assert from "node:assert/strict";
import aiRoutes from "../routes/aiRoutes.js";
import protect from "../middleware/authMiddleware.js";
import { askAI, createAskAI } from "../controllers/aiController.js";

function responseRecorder() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test("POST /ask is registered behind the Bearer auth middleware", () => {
  const askRoute = aiRoutes.stack.find(
    (layer) => layer.route?.path === "/ask" && layer.route.methods.post,
  );

  assert.ok(askRoute, "expected POST /ask route");
  assert.equal(askRoute.route.stack[0].handle, protect);
  assert.equal(askRoute.route.stack[1].handle, askAI);
});

test("AI route rejects requests without a Bearer token", async () => {
  const req = { headers: {} };
  const res = responseRecorder();
  let nextCalled = false;

  await protect(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 401);
  assert.equal(res.body.message, "Authentication required. Please log in.");
  assert.equal(nextCalled, false);
});

test("AI controller rejects empty prompts with JSON validation errors", async () => {
  const res = responseRecorder();

  await askAI({ body: { prompt: "  " } }, res, assert.fail);

  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /enter a question or prompt/i);
});

test("authenticated AI controller requests return an answer", async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = "test-only";
  const handler = createAskAI(() => ({
    models: {
      async generateContent({ model, contents }) {
        assert.equal(model, "gemini-2.5-flash");
        assert.equal(contents, "Explain this code");
        return { text: "This code does the requested work." };
      },
    },
  }));
  const res = responseRecorder();

  try {
    await handler({ body: { prompt: "Explain this code" }, user: { id: "test-user" } }, res, assert.fail);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { answer: "This code does the requested work." });
  } finally {
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  }
});
