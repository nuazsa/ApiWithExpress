import storiesService from "../service/stories-service.js";
import ResponseError from "../utils/response-error.js";

const create = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) throw new ResponseError(401, "Unauthorized: User information is missing");
    const userId = req.user.id;

    await storiesService.create(userId, req.body);

    res.status(201).json({
      error: false,
      message: "Success"
    });
  } catch (e) {
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const stories = await storiesService.getAll();
    if (!stories) throw new ResponseError(404, "Stories not found");

    res.status(200).json({
      error: false,
      message: "Story fetched successfully",
      listStory: stories.map((row) => ({
        storyId: row.story_id,
        name: row.name,
        description: row.description,
        createdAt: row.created_at,
      }))
    });
  } catch (e) {
    next(e);
  }
}

const getById = async (req, res, next) =>{
  try {
    const story = await storiesService.getById(req.params.id);
    if (!story) throw new ResponseError(404, "Story not found");

    res.status(200).json({
      error: false,
      message: "Story fetched successfully",
      story: {
        storyId: story.story_id,
        name: story.name,
        description: story.description,
        createdAt: story.created_at,
      }
    });
  } catch (e) {
    next(e);
  }
}

export default {
  create,
  getAll,
  getById,
}