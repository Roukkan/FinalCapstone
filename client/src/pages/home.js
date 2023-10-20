import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import { MdSearch } from "react-icons/md";
import HOMECSS from "./home.module.css";
import { MdBookmarkAdded, MdBookmarkBorder } from "react-icons/md";
import InputAdornment from "@mui/material/InputAdornment";

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

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);
  const userID = useGetUserID();
  const [modalData, setModalData] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecipe();
    if (cookies.access_token) fetchSavedRecipe();
  }, []);

  const handleOpen = () => setOpen(true);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        "http://localhost:3001/recipes",
        {
          recipeID,
          userID,
        },
        { headers: { authorization: cookies.access_token } }
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const openModal = (recipe) => {
    setModalData(recipe);
    handleOpen();
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  const filteredRecipes = recipes.filter((recipe) => {
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
      <div className={HOMECSS.search}>
        <div>
          <TextField
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            margin="normal"
            className={HOMECSS.txtBox}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <MdSearch size={20} color="red" className={HOMECSS.icn} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      <div className={HOMECSS.recipes}>
        <h1 className={HOMECSS.Head}>Recipes</h1>
        <ul>
          {filteredRecipes.map((recipe) => (
            <li key={recipe._id} className={HOMECSS.recipeList}>
              <div className={HOMECSS.fav}>
                <h2 className={HOMECSS.recipeHead}>{recipe.name}</h2>
                <button
                  onClick={() => saveRecipe(recipe._id)}
                  disabled={isRecipeSaved(recipe._id)}
                  className={HOMECSS.addBtn}
                >
                  {isRecipeSaved(recipe._id) ? (
                    <MdBookmarkAdded size="30px" color="brown" />
                  ) : (
                    <MdBookmarkBorder size="30px" color="brown" />
                  )}
                </button>
              </div>

              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className={HOMECSS.foodImg}
              />
              <div className={HOMECSS.instructions}>
                <p>{recipe.description}</p>
              </div>
              <div>
                <button
                  onClick={() => openModal(recipe)}
                  className={HOMECSS.view}
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
                            className={HOMECSS.chk}
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
                    <button onClick={handleCloseModal} className={HOMECSS.view}>
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
