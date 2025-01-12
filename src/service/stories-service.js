import dbPool from "../config/database.js";
import ResponseError from "../utils/response-error.js";

const create = async (userId, description) => {
  try {
    const query = "INSERT INTO stories (user_id, description) VALUES (?, ?)";
    const [result] = await dbPool.execute(query, [userId, description]);

    if (result.affectedRows === 0) throw new ResponseError(500, "Failed to create story");

    return result;
  } catch (e) {
    throw new ResponseError(500, e.message || "Database error");
  }
};

const getAll = async () => {
  try {
    const query = `
      SELECT 
        stories.story_id, 
        users.name, 
        stories.description, 
        stories.created_at 
      FROM stories 
      JOIN users ON stories.user_id = users.user_id
      ORDER BY story_id DESC
    `;

    const [stories] = await dbPool.execute(query);

    return stories;
  } catch (e) {
    throw new ResponseError(500, e.message || "Database error");
  }
};

const getById = async (id) => {
  try {
    const query = `
      SELECT 
        stories.story_id, 
        users.name AS name, 
        stories.description, 
        stories.created_at 
      FROM stories 
      JOIN users ON stories.user_id = users.user_id 
      WHERE stories.story_id = ?
    `;

    const [story] = await dbPool.execute(query, [id]);

    return story[0];
  } catch (e) {
    throw new ResponseError(500, e.message || "Database error");
  }
}

export default {
  create,
  getAll,
  getById,
}