import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import SAVEDCSS from "./saved-recipe.module.css";
import { MdBookmarkRemove } from "react-icons/md";
import { TextField } from "@mui/material";
import { MdSearch } from "react-icons/md";
import InputAdornment from "@mui/material/InputAdornment";

export const SavedRecipe = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const [modalData, setModalData] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(
          `https://kitchenkonnect.onrender.com/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSavedRecipe();
  }, []);

  const handleOpen = () => setOpen(true);

  const handleCloseModal = () => {
    setOpen(false);
  };

  const openModal = (recipe) => {
    setModalData(recipe);
    handleOpen();
  };

  const deleteSavedRecipe = async (recipeId) => {
    try {
      await axios.delete(
        `https://kitchenkonnect.onrender.com/recipes/savedRecipes/${userID}/${recipeId}`
      );
      setSavedRecipes(savedRecipes.filter((recipe) => recipe._id !== recipeId));
    } catch (err) {
      console.error(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  const filteredRecipes = savedRecipes.filter((recipe) => {
    const { name, mealType, ingredients } = recipe;

    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mealType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  return (
    <>
      <div className={SAVEDCSS.search}>
        <div className={SAVEDCSS.fixedSearch}>
          <TextField
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            className={SAVEDCSS.txtBox}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdSearch size={20} className={SAVEDCSS.srch} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      <div className={SAVEDCSS.recipes}>
        <h1 className={SAVEDCSS.Head}>My Favorite Recipes</h1>
        {filteredRecipes.length === 0 ? (
          <div className={SAVEDCSS.errmsg}>
            <p className={SAVEDCSS.result}>No matching recipes found!</p>
          </div>
        ) : (
          <ul>
            {filteredRecipes.map((recipe) => (
              <li key={recipe._id} className={SAVEDCSS.recipeList}>
                <div className={SAVEDCSS.fav}>
                  <h2 className={SAVEDCSS.recipeHead}>{recipe.name}</h2>
                  <button
                    className={SAVEDCSS.addBtn}
                    onClick={() => deleteSavedRecipe(recipe._id)}
                  >
                    {isRecipeSaved(recipe._id) ? (
                      <MdBookmarkRemove size="30px" className={SAVEDCSS.icn} />
                    ) : (
                      <MdBookmarkRemove size="30px" className={SAVEDCSS.icn} />
                    )}
                  </button>
                </div>

                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className={SAVEDCSS.foodImg}
                />
                <div className={SAVEDCSS.description}>
                  <p>{recipe.description}</p>
                </div>
                <div>
                  <button
                    onClick={() => openModal(recipe)}
                    className={SAVEDCSS.view}
                  >
                    View Recipe
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div>
          <Modal
            open={open}
            onClose={null}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className={SAVEDCSS.mdl}>
              {modalData && (
                <>
                  <div className={SAVEDCSS.divs}>
                    <h2 className={SAVEDCSS.name}>{modalData.name}</h2>
                    <img
                      src={modalData.imageUrl}
                      alt={modalData.name}
                      style={{ maxWidth: "100%" }}
                    />
                    <p className={SAVEDCSS.time}>
                      Cooking Time: {modalData.cookingTime} (minutes)
                    </p>
                  </div>

                  <div className={SAVEDCSS.divs}>
                    <h3>Ingredients</h3>
                    <ul>
                      {modalData.ingredients.map((ingredient, index) => (
                        <li key={index} className={SAVEDCSS.chklist}>
                          <input
                            value={ingredient}
                            id={ingredient}
                            type="checkbox"
                            className={SAVEDCSS.chk}
                          />
                          <label className={SAVEDCSS.lst} htmlFor={ingredient}>
                            {ingredient}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={SAVEDCSS.divs}>
                    <h3>Instructions</h3>
                    <ol className={SAVEDCSS.instruct}>
                      {modalData.instructions.map((instruction, index) => (
                        <li key={index} className={SAVEDCSS.items}>
                          {instruction}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <button
                      onClick={handleCloseModal}
                      className={SAVEDCSS.view}
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};
