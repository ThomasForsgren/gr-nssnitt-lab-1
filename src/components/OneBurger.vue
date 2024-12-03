<template>
  <div class="burger-kort">
    <div class="order-controls">
      <button class="decrease" @click="decreaseOrder">-</button><button class="increase" @click="increaseOrder">+</button>
      <p>Antal i order: {{ amountOrdered }}</p>
    </div>
    <!-- Burger Name -->
    <header><h3>{{ burger.name }}</h3></header>

    <!-- Burger Image -->
    <img :src="burger.url" :alt="burger.name" class="burger-image" />

    <!-- Burger Details -->
    <ul>
      <li v-for="ingredient in burger.ingredients" :key="ingredient">{{ ingredient }}</li>
    </ul>

    <p>{{ burger.kCal }} kcal</p>

    <!-- Dynamiska allergen -->
    <section style="font-size: 10px;">
      <dl>
        <dt>Allergener:</dt>
        <dd class="allergen">
          <span v-if="burger.laktos">Laktos, </span>
          <span v-if="burger.gluten">Gluten, </span>
          <span v-if="burger.lök">Lök, </span>
          <span v-if="burger.senapsfrö">Senapsfrö, </span>
          <span v-if="burger.sesam">Sesam </span>
          <span v-if="burger.chili">Chili, </span>
          <span v-if="burger.tomat">Tomat </span>
        </dd>
      </dl>
    </section>
  </div>
</template>

<script>
export default {
  name: 'OneBurger',
  props: {
    burger: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      amountOrdered: 0,
    };
  },
  methods: {
    increaseOrder() {
      this.amountOrdered++;
      this.addBurger(); 
    },
    decreaseOrder() {
      if (this.amountOrdered > 0) {
        this.amountOrdered--;
        this.addBurger(); 
      }
    },
    addBurger() {
    this.$emit('orderedBurger', {
      name: this.burger.name,
      amount: this.amountOrdered,
    });
  },
  },
};
</script>

<!-- CSS Styling for Component -->
<style scoped>
.burger-kort p { 
  display: inline-block; /*ta bort? */
  padding: 15px;
  text-align: center;
  width: 200px;
  background-color: none;
  color: white;
  margin: 10px; /*ta bort och färg?*/
}
.order-controls {
  align-items: center;
  justify-content: center;
  border: 2px double white; 
  border-radius: 10px; 
  background-color: #333; 
  color: white;
  margin-bottom: 10px; 
}
button.increase {
  background-color: green; 
  color: white;
}

button.increase:hover {
  background-color: #014c01; }

button.decrease {
  background-color: red; 
  color: white;
}

button.decrease:hover {
  background-color: #8b0000; 
}

.burger-kort h3 {
  font-size: 1.2em;
  margin: 10px 0;
}

.burger-image {
  width: 180px; /* 180px?  */
  border-radius: 5px;
  margin-bottom: 10px;
}

.burger-kort ul { /*kort p? - margin: 5px 0; */
  list-style: none;
  padding: 0;
}
.burger-kort li {
  margin: 5px 0;
}
.allergen {
  color: white;
  font-weight: bold;
}
.burger-kort dl {
  margin-top: 10px;
  font-size: 0.9em;
} /*kolla dessa sista, olika versioner */
</style>


