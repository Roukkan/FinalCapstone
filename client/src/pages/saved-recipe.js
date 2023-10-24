import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import SAVEDCSS from "./saved-recipe.module.css";
import { MdBookmarkAdded, MdBookmarkBorder } from "react-icons/md";
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
          `http://localhost:3001/recipes/savedRecipes/${userID}`
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
        `http://localhost:3001/recipes/savedRecipes/${userID}/${recipeId}`
      );
      setSavedRecipes(savedRecipes.filter((recipe) => recipe._id !== recipeId));
    } catch (err) {
      console.error(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <>
      <div className={SAVEDCSS.search}>
        <div>
          <TextField
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            margin="normal"
            className={SAVEDCSS.txtBox}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <MdSearch size={20} color="red" className={SAVEDCSS.icn} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      <div className={SAVEDCSS.recipes}>
        <h1 className={SAVEDCSS.Head}>My Favorite Recipes</h1>
        <ul>
          {savedRecipes.map((recipe) => (
            <li key={recipe._id} className={SAVEDCSS.recipeList}>
              <div className={SAVEDCSS.fav}>
                <h2 className={SAVEDCSS.recipeHead}>{recipe.name}</h2>
                <button
                  className={SAVEDCSS.addBtn}
                  onClick={() => deleteSavedRecipe(recipe._id)}
                >
                  {isRecipeSaved(recipe._id) ? (
                    <MdBookmarkBorder size="30px" color="brown" />
                  ) : (
                    <MdBookmarkAdded size="30px" color="brown" />
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
                    <h2>{modalData.name}</h2>
                    <img
                      src={modalData.imageUrl}
                      alt={modalData.name}
                      style={{ maxWidth: "100%" }}
                    />
                    <p> Cooking Time: {modalData.cookingTime} (minutes)</p>
                  </div>

                  <div className={SAVEDCSS.divs}>
                    <h3>Ingredients</h3>
                    <ul>
                      {modalData.ingredients.map((ingredient, index) => (
                        <li key={index}>
                          <input
                            value={ingredient}
                            type="checkbox"
                            className={SAVEDCSS.chk}
                          />
                          <label htmlFor="chk">{ingredient}</label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={SAVEDCSS.divs}>
                    <h3>Instructions</h3>
                    <ol className={SAVEDCSS.instruct}>
                      {modalData.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
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
