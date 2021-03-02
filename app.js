const search = document.getElementById('search')
const resultHeading = document.getElementById('result-heading')
const meals = document.getElementById('meals')
const submit = document.getElementById('submit')
const random = document.getElementById('random')
const singleMeal = document.getElementById('single-meal')

// Search meal and fetch from API
const searchMeal = (e) => {
  // Clear single meal
  singleMeal.innerHTML = ''

  // Get search term
  const term = search.value

  // Check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search results for: <span class="search-term">${term}</span></h2>`

        if (data.meals === null) {
          resultHeading.innerHTML = `<p class="error">There are no search results. Try again!</p>`

          // Clear search meals
          meals.innerHTML = ''
        } else {
          meals.innerHTML = data.meals
            .map(
              (meal) => `
                <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            `,
            )
            .join('')
        }
      })

    // Clear search text
    search.value = ''
  } else {
    resultHeading.innerHTML = `<p class="error">Please enter a search term.</p>`
  }

  e.preventDefault()
}

// Fetch meal by ID
const getMealById = (mealID) => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0]

      addMealToDOM(meal)
    })
}

// Fetch random meal from API
const getRandomMeal = () => {
  // Clear meals and heading
  meals.innerHTML = ''
  resultHeading.innerHTML = ''

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0]

      addMealToDOM(meal)
    })
}

const addMealToDOM = (meal) => {
  const ingredients = []

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`,
      )
    } else {
      break
    }
  }

  singleMeal.innerHTML = `
    <div class='single-meal'>
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt=${meal.strMeal} />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
             ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
    </div>
  `
}

// Search Meal Event Listener
submit.addEventListener('submit', searchMeal)

// Random Meal Event Listener
random.addEventListener('click', getRandomMeal)

// Get Meal Info Event Listener
meals.addEventListener('click', (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('meal-info')
    } else {
      return false
    }
  })

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealid')
    getMealById(mealID)
  }
})
