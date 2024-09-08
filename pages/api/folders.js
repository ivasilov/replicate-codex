import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  if (error || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  switch (req.method) {
    case "GET":
      return getFolders(user.id, res);
    case "POST":
      return createFolder(user.id, req.body, res);
    case "PUT":
      return updateFolder(user.id, req.body, res);
    case "DELETE":
      return deleteFolder(user.id, req.body, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
  }
}

async function getFolders(userId, res) {
  try {
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("user_id", userId)
      .order("name");

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return res.status(500).json({ error: "Error fetching folders" });
  }
}

async function createFolder(userId, { name }, res) {
  try {
    const { data, error } = await supabase
      .from("folders")
      .insert({ user_id: userId, name })
      .single();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (error) {
    console.error("Error creating folder:", error);
    return res.status(500).json({ error: "Error creating folder" });
  }
}

async function updateFolder(userId, { id, name }, res) {
  try {
    const { data, error } = await supabase
      .from("folders")
      .update({ name })
      .match({ id, user_id: userId })
      .single();

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error updating folder:", error);
    return res.status(500).json({ error: "Error updating folder" });
  }
}

async function deleteFolder(userId, { id }, res) {
  try {
    const { data: uncategorizedFolder } = await supabase
      .from("folders")
      .select("id")
      .eq("user_id", userId)
      .eq("name", "Uncategorized")
      .single();

    await supabase
      .from("bookmarks")
      .update({ folder_id: uncategorizedFolder.id })
      .match({ folder_id: id, user_id: userId });

    const { error } = await supabase
      .from("folders")
      .delete()
      .match({ id, user_id: userId });

    if (error) throw error;

    return res.status(204).end();
  } catch (error) {
    console.error("Error deleting folder:", error);
    return res.status(500).json({ error: "Error deleting folder" });
  }
}