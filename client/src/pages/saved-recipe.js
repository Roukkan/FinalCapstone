import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import { MdSearch } from "react-icons/md";
import SAVEDCSS from "./saved-recipe.module.css";
import { MdBookmarkAdded, MdBookmarkBorder } from "react-icons/md";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
};

const searchStyle = {
  position: "absolute",
  top: "90px",
  right: "20px",
  zIndex: 999,
};

export const SavedRecipe = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();
  const [modalData, setModalData] = useState(null);
  const [open, setOpen] = useState(false);
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

  return (
    <div>
      <h1>My Favorite Recipes</h1>
      <ul>
        {savedRecipes.map((recipe) => (
          <li key={recipe._id} className={SAVEDCSS.recipeList}>
            <div className={SAVEDCSS.fav}>
              <h2 className={SAVEDCSS.recipeHead}>{recipe.name}</h2>
              <button className={SAVEDCSS.addBtn}>
                <MdBookmarkAdded size="30px" color="brown" />
              </button>
            </div>

            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className={SAVEDCSS.foodImg}
            />
            <div className={SAVEDCSS.instructions}>
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
          <Box sx={modalStyle}>
            {modalData && (
              <>
                <div>
                  <h2>{modalData.name}</h2>
                  <img
                    src={modalData.imageUrl}
                    alt={modalData.name}
                    style={{ maxWidth: "100%" }}
                  />
                  <p> Cooking Time: {modalData.cookingTime} (minutes)</p>
                </div>

                <div>
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

                <div>
                  <h3>Instructions</h3>
                  <ol>
                    {modalData.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
                <div>
                  <button onClick={handleCloseModal} className={SAVEDCSS.view}>
                    Done
                  </button>
                </div>
              </>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
};
