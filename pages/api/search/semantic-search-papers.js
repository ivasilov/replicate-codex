import { createClient } from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from "openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function getStartDate(timeRange) {
  const now = new Date();
  switch (timeRange) {
    case "today":
      return new Date(now.setHours(0, 0, 0, 0)).toISOString();
    case "thisWeek":
      const firstDayOfWeek = new Date(
        now.setDate(now.getDate() - now.getDay())
      );
      return firstDayOfWeek.toISOString();
    case "thisMonth":
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    case "thisYear":
      return new Date(now.getFullYear(), 0, 1).toISOString();
    case "allTime":
    default:
      return "1970-01-01T00:00:00Z";
  }
}

async function createEmbedding(query) {
  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: query,
  });
  const [{ embedding }] = embeddingResponse.data.data;
  return embedding;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {
        query = "",
        similarityThreshold = 0.7,
        matchCount = 20,
        timeRange = "allTime",
      } = req.body;

      console.log("Received request body:", req.body);

      const trimmedQuery = query ? query.trim() : "";
      const isEmptyQuery = trimmedQuery === "";

      const timeRangeStart = getStartDate(timeRange);
      console.log("Time range start:", timeRangeStart);

      let results = [];

      if (isEmptyQuery) {
        console.log("Handling empty query case");
        const { data: papersData, error: papersError } = await supabase.rpc(
          "search_papers",
          {
            query_embedding: null,
            similarity_threshold: similarityThreshold,
            match_count: matchCount,
            time_range_start: timeRangeStart,
          }
        );

        if (papersError) {
          console.error("Error in empty query search:", papersError);
          throw papersError;
        }

        results = papersData || [];
      } else {
        console.log("Handling non-empty query case");
        const embedding = await createEmbedding(trimmedQuery);
        console.log("Created embedding for query");

        const { data: papersData, error: papersError } = await supabase.rpc(
          "search_papers",
          {
            query_embedding: embedding,
            similarity_threshold: similarityThreshold,
            match_count: matchCount,
            time_range_start: timeRangeStart,
          }
        );

        if (papersError) {
          console.error("Error in semantic search:", papersError);
          throw papersError;
        }

        results = papersData || [];
        console.log("Semantic search results:", results.length);

        if (results.length < matchCount) {
          const remaining = matchCount - results.length;

          const { data: fuzzyPapers, error: fuzzyError } = await supabase
            .from("arxivPapersData")
            .select("*")
            .or(`arxivId.ilike.%${trimmedQuery}%,title.ilike.%${trimmedQuery}%`)
            .gte("publishedDate", timeRangeStart)
            .order("totalScore", { ascending: false })
            .limit(remaining);

          if (fuzzyError) {
            console.error("Error in fuzzy search:", fuzzyError);
            throw fuzzyError;
          }

          const uniqueFuzzyPapers = fuzzyPapers.filter(
            (fuzzy) => !results.some((paper) => paper.id === fuzzy.id)
          );

          results = [...results, ...uniqueFuzzyPapers];
          console.log("After fuzzy search, total results:", results.length);
        }
      }

      console.log("Returning results:", results.length);
      return res.status(200).json({ data: results.slice(0, matchCount) });
    } catch (error) {
      console.error("Error in semantic search:", error);
      return res.status(500).json({
        error: "An error occurred during the search. Please try again later.",
        details: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
