const { readData } = require('./dataStorage');

const searchAndFilter = (searchTerm, minPrice = 0, maxPrice = Infinity) => {
  const data = readData();  

  const filteredProducts = data.filter(product => {
    const titleMatch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const priceMatch = product.priceValue >= minPrice && product.priceValue <= maxPrice;
    return titleMatch && priceMatch;
  });
  
  console.log('📦 Filtered Products:');
  if (filteredProducts.length > 0) {
    filteredProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - ${product.price}`);
    });
  } else {
    console.log('❌ No products found matching your search and filter criteria.');
  }
};


module.exports = {searchAndFilter};
