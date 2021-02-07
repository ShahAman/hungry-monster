const search = document.getElementById('search');
const submit = document.getElementById('submit');
const mealList = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal');
//search meal from API
function searchFood(e){
  e.preventDefault();

  const searchVal = search.value;

  if(searchVal.trim()){

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchVal}`)
    .then(res => res.json())
    .then(data =>{
      console.log(data);
      resultHeading.innerHTML = `<h2>Search results for ${searchVal}: </h2>`
      let html = ``;
      if(data.meals){
        data.meals.forEach(meal => {
          html += `
                <div class = "col-sm-3 meal-item" data-id = "${meal.idMeal}">
                    <div class = "meal-img">
                        <img src = "${meal.strMealThumb}" alt = "food">
                    </div>
                    <div class = "meal-name">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            `;
        });
        mealList.classList.remove('notFound');
    } else{
      resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
        mealList.classList.add('notFound');
    }
    mealList.innerHTML = html;
    })
  }else{
    alert('Please enter a search value...')
  }
  
}

submit.addEventListener('submit', searchFood);

// Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      addMealToDOM(meal);
    });
}


// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class="single-meal">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
      </div>
      <div class="main">
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}



mealList.addEventListener('click', e => {
  
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-item');
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-id');
    getMealById(mealID);
  }
});
