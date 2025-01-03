module.exports = {
  ci: {
    collect: {
      numberOfRuns: 2, // Кількість прогонів тестів
    },
    upload: {
      target: 'temporary-public-storage', // Тимчасове збереження звітів
    },
  },
};
