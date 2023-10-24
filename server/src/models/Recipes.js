import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mealType: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: [{ type: String, required: true }],
  imageUrl: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  saveCount: { type: Number },
});

export const RecipeModel = mongoose.model("Recipes", RecipeSchema);
