function handlePreFlightRequest(): Response {
  return new Response("Preflight OK!", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    },
  });
}

async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return handlePreFlightRequest();
  }

    const url = new URL(req.url);
    const word = url.searchParams.get("word");


  if (!word) {
    return new Response(
      JSON.stringify({ error: "Missing parameter 'word'." }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  const targetWord = "centrale";

  const similarityRequestBody = JSON.stringify({
    word1: word,
    word2: targetWord,
  });

  try {
    const response = await fetch(
      "https://word2vec.nicolasfley.fr/similarity",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: similarityRequestBody,
      }
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: response.statusText }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

Deno.serve(handler);

