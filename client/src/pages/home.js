import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import { MdSearch } from "react-icons/md";
import HOMECSS from "./home.module.css";
import {
  MdBookmarkAdded,
  MdBookmarkBorder,
  MdOutlinePeopleOutline,
} from "react-icons/md";
import InputAdornment from "@mui/material/InputAdornment";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);
  const userID = useGetUserID();
  const [modalData, setModalData] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userCounts, setUserCounts] = useState({});

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          "https://kitchenkonnect.onrender.com/recipes"
        );
        setRecipes(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(
          `https://kitchenkonnect.onrender.com/recipes/savedRecipes/ids/${userID}`
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

  useEffect(() => {
    recipes.forEach((recipe) => {
      fetchUserCount(recipe._id);
    });
  }, [recipes]);

  const fetchUserCount = async (recipeID) => {
    try {
      const response = await axios.get(
        `https://kitchenkonnect.onrender.com/recipes/recipe/${recipeID}/user-count`
      );
      setUserCounts((prevCounts) => ({
        ...prevCounts,
        [recipeID]: response.data.userCount,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        "https://kitchenkonnect.onrender.com/recipes",
        {
          recipeID,
          userID,
        },
        { headers: { authorization: cookies.access_token } }
      );
      setSavedRecipes(response.data.savedRecipes);

      setUserCounts((prevCounts) => ({
        ...prevCounts,
        [recipeID]: prevCounts[recipeID] + 1,
      }));
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
        <div className={HOMECSS.fixedSearch}>
          <TextField
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            className={HOMECSS.txtBox}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdSearch size={20} className={HOMECSS.srch} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      <div className={HOMECSS.recipes}>
        <h1 className={HOMECSS.Head}>Recipes</h1>
        {filteredRecipes.length === 0 ? (
          <div className={HOMECSS.errmsg}>
            <p className={HOMECSS.result}>No matching recipes found!</p>
          </div>
        ) : (
          <ul>
            {filteredRecipes.map((recipe) => (
              <li key={recipe._id} className={HOMECSS.recipeList}>
                <div className={HOMECSS.fav}>
                  <h2 className={HOMECSS.recipeHead}>{recipe.name}</h2>
                </div>

                <div className={HOMECSS.action}>
                  <p className={HOMECSS.counter}>
                    <MdOutlinePeopleOutline
                      size="30px"
                      className={HOMECSS.ppl}
                    />
                    {userCounts[recipe._id] || 0}{" "}
                    <button
                      onClick={() => saveRecipe(recipe._id)}
                      disabled={isRecipeSaved(recipe._id)}
                      className={HOMECSS.addBtn}
                    >
                      {isRecipeSaved(recipe._id) ? (
                        <MdBookmarkAdded
                          size="30px"
                          className={HOMECSS.addedIcon}
                        />
                      ) : (
                        <MdBookmarkBorder
                          size="30px"
                          className={HOMECSS.addIcon}
                        />
                      )}
                    </button>
                  </p>
                </div>

                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className={HOMECSS.foodImg}
                />
                <div className={HOMECSS.description}>
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
        )}
        <div>
          <Modal
            open={open}
            onClose={null}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className={HOMECSS.mdl}>
              {modalData && (
                <>
                  <div className={HOMECSS.divs}>
                    <h2 className={HOMECSS.name}>{modalData.name}</h2>
                    <img
                      src={modalData.imageUrl}
                      alt={modalData.name}
                      style={{ maxWidth: "100%" }}
                    />
                    <p className={HOMECSS.time}>
                      Cooking Time: {modalData.cookingTime} (minutes)
                    </p>
                  </div>

                  <div className={HOMECSS.divs}>
                    <h3>Ingredients</h3>
                    <ul>
                      {modalData.ingredients.map((ingredient, index) => (
                        <li key={index} className={HOMECSS.chklist}>
                          <input
                            value={ingredient}
                            id={ingredient}
                            type="checkbox"
                            className={HOMECSS.chk}
                          />
                          <label className={HOMECSS.lst} htmlFor={ingredient}>
                            {ingredient}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={HOMECSS.divs}>
                    <h3>Instructions</h3>
                    <ol className={HOMECSS.instruct}>
                      {modalData.instructions.map((instruction, index) => (
                        <li key={index} className={HOMECSS.items}>
                          {instruction}
                        </li>
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
