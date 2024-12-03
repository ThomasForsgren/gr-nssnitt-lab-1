<template>
  
  <div>
    <!-- Header Section -->
    <header class="main-header">
      <h1>Välkommen till Thompas burgarhak</h1>
    </header>

    <!-- Navigation Section -->
    <nav>
      <h2>Meny</h2>
      <p class="beskrivning">Här väljer du hamburgare</p>
    </nav>

    <!-- Main Section -->
    <main>
      <!-- Burgers Section -->
      <section class="burgardelen">
        <Burger
          v-for="burger in burgers"
          :burger="burger"
          :key="burger.name"
          v-on:orderedBurger="addToOrder($event)"
        />
      </section>

      <!-- Customer Information Section -->
      <section class="kundinformation">
        <header><h3>Kundinformation</h3></header>
        <form @submit.prevent="submitForm">
          <label for="name">Namn:</label>
          <input type="text" id="name" v-model="formData.name" required /><br /><br />

          <label for="email">E-post:</label>
          <input type="email" id="email" v-model="formData.email" required /><br /><br />

          <label>Kön:</label><br />
          <input type="radio" id="man" name="gender" value="man" v-model="formData.gender" required />
          <label for="man">Man</label><br />
          <input type="radio" id="kvinna" name="gender" value="kvinna" v-model="formData.gender" required />
          <label for="kvinna">Kvinna</label><br />
          <input type="radio" id="annat" name="gender" value="annat" v-model="formData.gender" required/>
          <label for="annat">Annat</label><br /><br />

          <label for="payment">Betalningsmetod:</label>
          <select id="payment" v-model="formData.payment" required>
            <option value="kort">Kort</option>
            <option value="kontant">Kontant</option>
            <option value="swish">Swish</option>
            <option value="klarna">Klarna</option>
          </select><br /><br />
            <div id="map-container">
                <div id="map" v-on:click="setLocation">
                click here
                  <div
                  v-for="order in orders"
                  :key="order.orderId"
                  class="target"
                  v-bind:style="{ 
                    left: order.details.x + 'px', 
                    top: order.details.y + 'px' 
                  }">
                    📍
                  </div>
                  <div
              v-if="location.x && location.y"
              class="target"
              v-bind:style="{ 
                left: location.x + 'px', 
                top: location.y + 'px' 
              }">
              📍
            </div>

                </div>
            </div>
          <button type="submit" style="display: flex; align-items: center;" v-on:click="submitForm">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZTKeKwIXlmrkXB756eRHrBRZKQfGebPgh7w&s"
              alt="Beställ-knapp"
              style="width: 20px; margin-right: 5px;"
            />
            <span>Beställ</span>
          </button>
        </form>
      </section>
    </main>
  </div>

<footer>
      &copy; Thomas Ventures
   </footer>
</template>

<script>
import menu from '../assets/menu.json'
import Burger from '../components/OneBurger.vue'
import io from 'socket.io-client'

const socket = io("localhost:3000");

function MenuItem(name, kCal, url, lactose, gluten, lök, senapsfrö, sesam, chili, tomat, ingredients) {
  this.name = name;
  this.kCal = kCal;
  this.url = url;
  this.lactose = lactose;
  this.gluten = gluten;
  this.lök = lök;
  this.senapsfrö = senapsfrö;
  this.sesam = sesam;
  this.chili = chili;
  this.tomat = tomat;
  this.ingredients = ingredients;
}

const burgersArray = [
  new MenuItem(
    'Pippi-burgare',
    300,
    'https://www.thespicedchickpea.com/media/1863/img_2137.jpg',
    true, true, true, true, true, false, false,
    ['Pankopanerad kyckling', 'Sesambröd', 'Picklad rödlök', 'Romansallad', 'Dillpickles', 'Cheddar']
  ),
  new MenuItem(
    'Gedigen Burgare',
    400,
    'https://www.lantmannenunibake.dk/siteassets/sweden/images/03.-inspiration/recept/receptbilder-teasers/600x400/600x400_recept_burger_bun_grande_dubbel_orebro.jpg?maxwidth=600&maxheight=600',
    true, true, true, false, false, true, true,
    ['Dubbla biffar', 'Brioche', 'Picklad rödlök', 'Romansallad', 'Jalapenos', 'Cheddar']
  ),
  new MenuItem(
    'Knappt En Burgare',
    150,
    'https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,q_auto,w_750,f_auto/f_auto/healthiest-fast-food-burgers-phpW60uHJ',
    false, true, false, false, false, false, true,
    ['Kött', 'Bröd', 'Ketchup']
  ),];

export default {
  name: 'HomeView',
  components: {
    Burger, /* ett komma här? */
  },
  data() {
    return {
    burgers: menu, 
    formData: {
      name: '',
      email: '',
      gender: '',
      payment: ''
    },
    orderedBurgers: {},
    orders: [],
    location: { x: 0, y: 0 }
    };
  }, /* rätt med parenteser och komman? */
  mounted() {
    console.log(this.burgers); 
  },
  methods: {
    setLocation(event) {
    const offset = {
      x: event.currentTarget.getBoundingClientRect().left,
      y: event.currentTarget.getBoundingClientRect().top,
    };
    this.location.x = event.clientX - offset.x;
    this.location.y = event.clientY - offset.y;
    console.log("plats uppdaterad till:", this.location);
  },
  submitForm(event) {
    event.preventDefault();
    if (this.location.x === 0 && this.location.y === 0) {
    console.error("Du måste välja en plats på kartan innan du kan beställa.");
    alert("Vänligen klicka på kartan för att välja en plats innan du beställer.");
    return; 
  }
  if (Object.keys(this.orderedBurgers).length === 0) {
    alert("Du måste välja minst en burgare innan du kan beställa.");
    return;
  }
  if (!this.formData.name || !this.formData.email || !this.formData.gender || !this.formData.payment) {
    alert("Du måste fylla i alla fält: Namn, E-post, Kön och Betalningsmetod.");
    return;
  }
    socket.emit("addOrder", {
      orderId: this.getOrderNumber(),
      details: { ...this.location }, 
      orderItems: Object.entries(this.orderedBurgers),
      customerInfo: {
        name: this.formData.name,
        email: this.formData.email,
        gender: this.formData.gender,
        payment: this.formData.payment,
      },
    });
    console.log("Order skickad:", {
      details: { ...this.location },
      orderItems: Object.entries(this.orderedBurgers),
      customerInfo: this.formData,
    });
    this.resetForm(); 
  },
  resetForm() {
    this.formData = {
      name: '',
      email: '',
      gender: '',
      payment: ''
    };
    this.orderedBurgers = {};
    this.location = { x: 0, y: 0 }; 
  },
    getOrderNumber: function () {
      return Math.floor(Math.random()*100000);
    },
    addToOrder(event) {
    this.orderedBurgers[event.name] = event.amount;
    console.log("aktuella ordrar", this.orderedBurgers);
    },
    /*resetForm() {
    this.orderedBurgers = {};
    this.formData = {
      name: "",
      email: "",
      gender: "",
      payment: "",
    };
  },*/
}}
  /*,
    addOrder(event) {
  const offset = {
    x: event.currentTarget.getBoundingClientRect().left,
    y: event.currentTarget.getBoundingClientRect().top,
  };
  this.location.x = event.clientX - offset.x;
  this.location.y = event.clientY - offset.y;
  console.log('Location updated:', this.location);
}}*/
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Agbalumo&family=Cormorant:wght@700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Libre+Caslon+Text&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Girassol&display=swap');
body {
    font-size: 1.5em;
    font-family: "libre caslon text", serif;
}
html, body {
    margin: 0;
    padding: 0;
    width: 100vw;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: overlay;
    background-color: bisque;
}
section, div {
    margin: 0p;
    padding: 0;
    box-sizing: border-box;
}

p {
    color: black
}

h1 {
    font-family: 'Girassol', sans-serif;
    color: rgb(191, 144, 68);
    -webkit-text-stroke: 0.05px black;
    font-size: 3.2em;
    padding-top: 40px
}
main, header, footer, nav ul {
    margin: 0 auto 0 auto;
}



.main-header {
    font-family: 'Girassol', sans-serif;
    background-image: url("https://northamericansigns.com/wp-content/uploads/2015/05/1024px-Fremont_Street_1952.jpg");
    background-size: cover;
    overflow: hidden;
    background-position: bottom;
    width: 100vw;
    height: 350px;
    opacity: 1;
}

header h1 {
    width:40rem;
    margin: 0 auto;
    text-align: center;
}

.allergen {
    font-weight: bold !important;
}

.burgardelen {
    display: grid;
    box-sizing: inherit;
    grid-template-columns: repeat(3, 1fr); 
    justify-content: center;
    gap: 20px; 
    padding: 10px;
    background-color: black;
    width: calc(100vw-50px);
    background-color: black;
    color: white !important;
    background-image: none !important;
    border: 8px double #7a7978;
    margin: 5px;
    border-radius: 45px;
}

section.kundinformation {
    width: calc(100vw-50px);
    box-sizing: inherit;
    background-image: none !important;
    background-color: rgb(242, 194, 136);
    border: 8px double #7a7978;
    margin: 5px;
    border-radius: 45px;
}

.burgardelen header {
    background-image: none !important;
    background-color: transparent;
    opacity: 1 !important;
 }

button{
    margin: 2em;
    padding: 1em;
}

 button:hover {
    background-color: #707070; 
    color: white; 
    cursor: pointer; 
    transition: background-color 0.5s ease; 
}

.beskrivning {
    padding-left: 20px;   
}

nav ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, 9.25em);
    gap: 3em;
    padding: 0;
    margin: 30px
}

nav li {
    display: block;
    padding: 3em;
}
nav h2 {
    padding: 20px;
}
.Very-good {
    color: green;
}

@media screen and (max-width: 800px) {
    h1 {
        font-size: 6vw;
    }
}


.Master {
    color: green;
    font-weight: bold;
}
#map-container {
  position: relative;
  width: 1400px; 
  height: 600px; 
  overflow: scroll;
  border: 2px solid #ccc; 
}
  #map {
    width: 1920px;
  height: 1078px;
    background: url("/img/polacks.jpg");
    background-size: cover;
    position: relative;
  }

  .target {
  position: absolute;
  font-weight: bold;
  color: red; 
  font-size: 30px;
  transform: translate(-50%, -100%); 
}
</style>