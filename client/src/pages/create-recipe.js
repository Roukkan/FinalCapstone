import { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import CREATECSS from "./create-recipe.module.css";
import { MdDeleteForever } from "react-icons/md";

export const CreateRecipe = () => {
  const userID = useGetUserID();
  const [cookies] = useCookies(["access_token"]);
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    mealType: "",
    ingredients: [],
    instructions: [],
    imageUrl: "",
    cookingTime: 0,
    userOwner: userID,
  });

  const selectOptions = [
    {
      label: "",
      value: "",
    },
    {
      label: "Breakfast",
      value: "breakfast",
    },
    {
      label: "Appetizers",
      value: "appetizers",
    },
    {
      label: "Main Dishes",
      value: "mainDish",
    },
    {
      label: "Soups & Stews",
      value: "soup",
    },
    {
      label: "Desserts",
      value: "desserts",
    },
  ];

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const [option, setOption] = useState(selectOptions[0]);
  const setSelectedOption = (event) => {
    const option = selectOptions.find(
      (option) => option.value === event.target.value
    );

    setOption(option);
    setRecipe({ ...recipe, mealType: option.value });
  };

  const handleIngredientChange = (event, idx) => {
    const { value } = event.target;
    const ingredients = recipe.ingredients;
    ingredients[idx] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleInstructionChange = (event, idx) => {
    const { value } = event.target;
    const instructions = recipe.instructions;
    instructions[idx] = value;
    setRecipe({ ...recipe, instructions });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const addInstruction = () => {
    setRecipe({ ...recipe, instructions: [...recipe.instructions, ""] });
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "mealType",
      "description",
      "imageUrl",
      "cookingTime",
    ];
    const requiredArrays = ["ingredients", "instructions"];

    for (const field of requiredFields) {
      if (!recipe[field]) {
        alert(`Please fill in all fields.`);
        return false;
      }
    }

    for (const arrayField of requiredArrays) {
      if (recipe[arrayField].length === 0) {
        alert(`Please add at least one ${arrayField} field.`);
        return false;
      }
    }

    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        await axios.post(
          "https://kitchenkonnect.onrender.com/recipes",
          recipe,
          {
            headers: { authorization: cookies.access_token },
          }
        );
        alert("Recipe Created!");
        navigate("/");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteIngredient = (idx) => {
    const ingredients = [...recipe.ingredients];
    ingredients.splice(idx, 1);
    setRecipe({ ...recipe, ingredients });
  };

  const handleDeleteInstruction = (idx) => {
    const instructions = [...recipe.instructions];
    instructions.splice(idx, 1);
    setRecipe({ ...recipe, instructions });
  };

  return (
    <div className={CREATECSS.recipeCard}>
      <div className={CREATECSS.createRecipe}>
        <h2>Create Recipe</h2>
        <form onSubmit={onSubmit}>
          <label htmlFor="name" className={CREATECSS.lbl}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
            className={CREATECSS.recipeInput}
          />

          <label htmlFor="mealType" className={CREATECSS.lbl}>
            Meal Type
          </label>
          <select
            onChange={setSelectedOption}
            defaultValue={option.value}
            className={CREATECSS.Mealselect}
            id="mealType"
          >
            {selectOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label htmlFor="description" className={CREATECSS.lbl}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            onChange={handleChange}
            className={CREATECSS.recipeInput}
          ></textarea>

          <label className={CREATECSS.lbl}>Ingredients</label>
          {recipe.ingredients.map((ingredient, idx) => (
            <div key={idx}>
              <input
                type="text"
                name="ingredients"
                value={ingredient}
                onChange={(event) => handleIngredientChange(event, idx)}
                className={CREATECSS.recipeInput}
              />
              <button
                type="button"
                onClick={() => handleDeleteIngredient(idx)}
                className={CREATECSS.del}
              >
                <MdDeleteForever size={20} color="red" />
              </button>
            </div>
          ))}
          <button
            onClick={addIngredient}
            type="button"
            className={CREATECSS.btn}
          >
            Add Ingredient
          </button>

          <label className={CREATECSS.lbl}>Instructions</label>
          {recipe.instructions.map((instruction, idx) => (
            <div key={idx}>
              <input
                type="text"
                name="instructions"
                value={instruction}
                onChange={(event) => handleInstructionChange(event, idx)}
                className={CREATECSS.recipeInput}
              />
              <button
                type="button"
                onClick={() => handleDeleteInstruction(idx)}
                className={CREATECSS.del}
              >
                <MdDeleteForever size={20} color="red" />
              </button>
            </div>
          ))}
          <button
            onClick={addInstruction}
            type="button"
            className={CREATECSS.btn}
          >
            Add Instructions
          </button>

          <label htmlFor="imageUrl">Image Url</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            onChange={handleChange}
            className={CREATECSS.recipeInput}
          />

          <label htmlFor="cookingTime">Cooking Time (minutes)</label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            onChange={handleChange}
            className={CREATECSS.recipeInput}
          />

          <button type="submit" className={CREATECSS.btn}>
            Create Recipe
          </button>
        </form>
      </div>
    </div>
  );
};
