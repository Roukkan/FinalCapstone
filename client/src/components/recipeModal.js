import React from "react";

const recipeModal = ({ ingredients, closeModal }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h3>Ingredients</h3>
        <ul>
          {ingredients.map((ingredient, index) => {
            <li key={index}>
              <input value={ingredient} type="checkbox" />
              {ingredient}
            </li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default recipeModal;
