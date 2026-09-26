const MAX_PROMPT_CHARACTERS = 80000;
const MAX_COMPLETION_TOKENS = 12000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function cleanError(error) {
  return String(error?.message || error || "Unknown error")
    .replace(/\s+/g, " ")
    .slice(0, 500);
}

function extractText(result) {
  if (typeof result === "string") {
    return result.trim();
  }

  if (typeof result?.response === "string") {
    return result.response.trim();
  }

  if (
    result?.response &&
    typeof result.response === "object"
  ) {
    return JSON.stringify(result.response);
  }

  const choice = result?.choices?.[0];

  if (typeof choice?.message?.content === "string") {
    return choice.message.content.trim();
  }

  if (typeof choice?.text === "string") {
    return choice.text.trim();
  }

  return "";
}

async function runModel(env, model, messages) {
  const startedAt = Date.now();

  const raw = await env.AI.run(model, {
    messages,
    temperature: 0.25,
    max_completion_tokens: MAX_COMPLETION_TOKENS,
    stream: false,
  });

  const content = extractText(raw);

  if (!content) {
    throw new Error("empty_model_response");
  }

  return {
    content,
    duration_ms: Date.now() - startedAt,
    usage: raw?.usage || null,
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        service: "consutrain-ai-gateway",
        status: "healthy",
      });
    }

    if (url.pathname !== "/v1/draft") {
      return json({
        ok: false,
        error: "not_found",
      }, 404);
    }

    if (request.method !== "POST") {
      return json({
        ok: false,
        error: "method_not_allowed",
      }, 405);
    }

    if (
      !env.AI_GATEWAY_TOKEN ||
      !env.PRIMARY_AI_MODEL ||
      !env.FALLBACK_AI_MODEL
    ) {
      console.error("AI Gateway configuration is incomplete");

      return json({
        ok: false,
        error: "server_configuration_error",
      }, 500);
    }

    const authorization =
      request.headers.get("Authorization") || "";

    if (
      authorization !==
      `Bearer ${env.AI_GATEWAY_TOKEN}`
    ) {
      return json({
        ok: false,
        error: "unauthorized",
      }, 401);
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return json({
        ok: false,
        error: "invalid_json",
      }, 400);
    }

    const prompt = String(body?.prompt || "").trim();

    if (!prompt) {
      return json({
        ok: false,
        error: "prompt_required",
      }, 400);
    }

    if (prompt.length > MAX_PROMPT_CHARACTERS) {
      return json({
        ok: false,
        error: "prompt_too_large",
        max_characters: MAX_PROMPT_CHARACTERS,
      }, 413);
    }

    const requestId =
      String(body?.request_id || "").trim() ||
      crypto.randomUUID();

    const primaryModel = env.PRIMARY_AI_MODEL;
    const fallbackModel = env.FALLBACK_AI_MODEL;

    const messages = [
      {
        role: "system",
        content:
          "You are the ConsuTrain Tech Radar drafting engine. " +
          "Follow the user's instructions exactly. " +
          "When JSON is requested, return only valid JSON with no Markdown code fences. " +
          "Do not invent facts that are not supported by the supplied material.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    try {
      const primary = await runModel(
        env,
        primaryModel,
        messages
      );

      console.log("AI draft generation completed", {
        request_id: requestId,
        model_used: primaryModel,
        fallback_used: false,
        duration_ms: primary.duration_ms,
      });

      return json({
        ok: true,
        request_id: requestId,
        provider: "cloudflare_workers_ai",
        model_used: primaryModel,
        fallback_used: false,
        duration_ms: primary.duration_ms,
        usage: primary.usage,
        content: primary.content,
      });
    } catch (primaryError) {
      const primaryErrorMessage =
        cleanError(primaryError);

      console.warn("Primary AI model failed", {
        request_id: requestId,
        model: primaryModel,
        error: primaryErrorMessage,
      });

      if (
        !fallbackModel ||
        fallbackModel === primaryModel
      ) {
        return json({
          ok: false,
          request_id: requestId,
          error: "primary_model_failed",
          fallback_attempted: false,
        }, 502);
      }

      try {
        const fallback = await runModel(
          env,
          fallbackModel,
          messages
        );

        console.log(
          "AI draft generation completed with fallback",
          {
            request_id: requestId,
            model_used: fallbackModel,
            fallback_used: true,
            duration_ms: fallback.duration_ms,
          }
        );

        return json({
          ok: true,
          request_id: requestId,
          provider: "cloudflare_workers_ai",
          model_used: fallbackModel,
          fallback_used: true,
          primary_model: primaryModel,
          duration_ms: fallback.duration_ms,
          usage: fallback.usage,
          content: fallback.content,
        });
      } catch (fallbackError) {
        console.error("All AI models failed", {
          request_id: requestId,
          primary_model: primaryModel,
          fallback_model: fallbackModel,
          primary_error: primaryErrorMessage,
          fallback_error: cleanError(fallbackError),
        });

        return json({
          ok: false,
          request_id: requestId,
          error: "all_models_failed",
          primary_model: primaryModel,
          fallback_model: fallbackModel,
        }, 502);
      }
    }
  },
};