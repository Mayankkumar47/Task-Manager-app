import Message from "../models/message.model.js"
import { errorHandler } from "../utils/error.js"

export const getChatMessages = async (req, res, next) => {
  try {
    // Fetch recent 100 messages populated with sender's name and image
    const messages = await Message.find()
      .sort({ createdAt: 1 })
      .limit(100)
      .populate("sender", "name email profileImageUrl")

    res.status(200).json(messages)
  } catch (error) {
    next(error)
  }
}

export const postChatMessage = async (req, res, next) => {
  try {
    const { text } = req.body
    if (!text || text.trim() === "") {
      return next(errorHandler(400, "Message text is required"))
    }

    const newMessage = new Message({
      sender: req.user.id,
      text: text.trim(),
    })

    await newMessage.save()

    const populated = await Message.findById(newMessage._id).populate(
      "sender",
      "name email profileImageUrl"
    )

    res.status(201).json(populated)
  } catch (error) {
    next(error)
  }
}
