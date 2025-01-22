const API_URL = "/api/cocktails";

// State to track the user's like/dislike selection
const userSelections = {};

let allCocktails = []; // To store all cocktails for filtering purposes

// Fetch cocktails and display them
async function fetchCocktails() {
  const response = await fetch(API_URL);
  allCocktails = await response.json(); // Store all cocktails in a variable
  displayCocktails(allCocktails); // Display all cocktails initially
}

function displayCocktails(cocktails) {
  const cocktailsDiv = document.getElementById("cocktails");
  cocktailsDiv.innerHTML = ""; // Clear current list
  cocktails.forEach(cocktail => {
    const cocktailDiv = document.createElement("div");
    cocktailDiv.className = "cocktail";
    cocktailDiv.innerHTML = `
      <h3>${cocktail.name}</h3>
      <img src="${cocktail.img}" alt="${cocktail.name}">
      <p>${cocktail.description}</p>
      <p><strong>Ingredients:</strong> ${cocktail.ingredients.join(", ")}</p>
      <p>
        <button class="like-button ${userSelections[cocktail.id] === "like" ? "selected" : ""}" data-id="${cocktail.id}">
          👍 Like (${cocktail.like})
        </button>
        <button class="dislike-button ${userSelections[cocktail.id] === "dislike" ? "selected" : ""}" data-id="${cocktail.id}">
          👎 Dislike (${cocktail.dislike})
        </button>
      </p>
    `;
    
    // Add event listener to handle card clicks explicitly
    cocktailDiv.addEventListener("click", (e) => {
      // Check if the click target is NOT a button
      if (e.target.tagName !== "BUTTON") {
        // Ensure this is not a text selection action
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          displayCocktails([cocktail]); // Show only the clicked cocktail
        }
      }
    });

    cocktailsDiv.appendChild(cocktailDiv);
  });

  // Attach event listeners for like and dislike buttons
  document.querySelectorAll(".like-button").forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering the click on the cocktail container
      handleLikeDislike(button.dataset.id, "like");
    });
  });

  document.querySelectorAll(".dislike-button").forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent triggering the click on the cocktail container
      handleLikeDislike(button.dataset.id, "dislike");
    });
  });
}

// Filter cocktails based on search query
document.getElementById("search-bar").addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();
  const filteredCocktails = allCocktails.filter(cocktail =>
    cocktail.name.toLowerCase().includes(query) ||
    cocktail.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
  );
  displayCocktails(filteredCocktails); // Update the displayed list
});

// Handle like/dislike button interaction
async function handleLikeDislike(cocktailId, action) {
  // Check if the current action is already selected
  if (userSelections[cocktailId] === action) {
    // Toggle off the action
    userSelections[cocktailId] = null;
    await updateLikes(cocktailId, action, 0); // Decrease the count
  } else {
    // Toggle on the selected action and toggle off the other if needed
    if (userSelections[cocktailId]) {
      await updateLikes(cocktailId, userSelections[cocktailId], 0); // Decrease the previous action
    }
    userSelections[cocktailId] = action;
    await updateLikes(cocktailId, action, 1); // Increase the selected action
  }
  fetchCocktails(); // Refresh the list
}

// Function to dynamically add a new ingredient field
document.getElementById("add-ingredient").addEventListener("click", () => {
  const ingredientsContainer = document.getElementById("ingredients-container");

  // Create a new textarea for the next ingredient
  const newIngredient = document.createElement("textarea");
  newIngredient.className = "ingredient";
  newIngredient.placeholder = `Ingredient ${ingredientsContainer.querySelectorAll(".ingredient").length + 1}`;
  newIngredient.required = true;

  // Append the new textarea to the ingredients container
  ingredientsContainer.appendChild(newIngredient);
});

// Function to add a new cocktail (unchanged)
async function addCocktail(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const img = document.getElementById("img").value;
  const description = document.getElementById("description").value;

  // Gather all ingredient textareas' values
  const ingredientFields = document.querySelectorAll(".ingredient");
  const ingredients = Array.from(ingredientFields).map(field => field.value);

  if (!name || !img || ingredients.some(ing => !ing) || !description) {
    alert("Please fill out all fields!");
    return;
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, img, ingredients, description })
  });

  if (response.ok) {
    alert("Cocktail added successfully!");
    document.getElementById("cocktail-form").reset();
    document.getElementById("ingredients-container").innerHTML = `
      <label>Ingredients:</label>
      <textarea class="ingredient" placeholder="Ingredient 1" required></textarea>
    `;
    fetchCocktails();
  } else {
    alert("Failed to add cocktail.");
  }
}

// Function to update likes or dislikes
async function updateLikes(cocktailId, type, delta) {
  const response = await fetch(`${API_URL}/${cocktailId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ [type]: delta })
  });

  if (!response.ok) {
    alert("Failed to update cocktail.");
  }
}

// Fetch initial list of cocktails
fetchCocktails();

document.getElementById("cocktail-form").addEventListener("submit", addCocktail);