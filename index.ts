
/* function handlePreFlightRequest(): Response {
  return new Response("Preflight OK!", {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type",
    },
  });
}


// -------- 1. Serveur reçoit une requête = demande de comparaison entre 2 mots --------
async function handler(_req: Request): Promise<Response> { 
  if (_req.method == "OPTIONS") {
    handlePreFlightRequest();
  }
 
// -------- 2. Le server prépare sa requête --------
  const headers = new Headers(); // 
  headers.append("Content-Type", "application/json");

  const similarityRequestBody = JSON.stringify({
    word1: "centrale",
    word2: "supelec",
  });

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: similarityRequestBody,
    redirect: "follow",
  };


// -------- 3. Il interroge une API externe pour comparer les deux mots --------
  try {
    const response = await fetch("https://word2vec.nicolasfley.fr/similarity", requestOptions);

// -------- 4. On récupère la réponse de l'API --------

    if (!response.ok) {
      console.error(`Error: ${response.statusText}`);
      return new Response(`Error: ${response.statusText}`, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "content-type",
        },
      });
    }

    const result = await response.json();

    console.log(result);
    
// -------- 5. On transmet la réponse -------- 

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

Deno.serve(handler); */

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
