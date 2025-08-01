export const items = {
  fasterTimer: {
    id: "fasterTimer",
    name: "Time Booster",
    description: "Start orders with more time",
    type: "permanent",
    cost: 60,
    effect: (timer) => timer.start(timer.getRemaining() + 10),
  },

  bonusTip: {
    id: "bonusTip",
    name: "Charm Points",
    description: "Customers leave a tip",
    type: "stackable",
    cost: 25, // affordable and stackable
    effect: (tip) => tip * 1.05,
  },

  instantComplete: {
    id: "instantComplete",
    name: "Auto-Serve",
    description: "Complete an order instantly",
    type: "consumable",
    cost: 50,
    effect: () => {
      // do something
    },
  },

  timeStop: {
    id: "timeStop",
    name: "Stopwatch",
    description: "Stops the timer for 10 seconds",
    type: "consumable",
    cost: 55,
    effect: () => {
      // do something
    },
  },

  cleanSlate: {
    id: "cleanSlate",
    name: "Soap Sponge",
    description: "Remove all decoys from the current ingredient view",
    type: "consumable",
    cost: 45,
    effect: () => {},
  },

  coffeeShot: {
    id: "coffeeShot",
    name: "Coffee Shot",
    description: "Instantly complete an ingredient from the ingredient view",
    type: "consumable",
    cost: 40,
    effect: () => {},
  },

  glasses: {
    id: "glasses",
    name: "Prescription Glasses",
    description: "Highlights one of the correct ingredients",
    type: "permanent",
    cost: 90,
    effect: () => {},
  },

  calmingMusic: {
    id: "music",
    name: "Calming Music",
    description: "Adds more time to customer orders",
    type: "permanent",
    cost: 75,
    effect: () => {},
  },
};
