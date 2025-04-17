const fs = require('fs');
const path = require('path');


const dataFilePath = path.join(__dirname, 'scrapedData.json');


const saveData = (newData) => {
    const processedData = newData.map((item) => ({
      ...item,
      priceValue: parseFloat(item.price.replace(/[^0-9.-]+/g, "")), 
    }));

  if (fs.existsSync(dataFilePath)) {
    const existingData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    existingData.push(...newData); 
    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2), 'utf8');
  } else {
   
    fs.writeFileSync(dataFilePath, JSON.stringify(processedData, null, 2), 'utf8');
  }
  console.log('✅ Data has been saved to scrapedData.json');
};


const readData = () => {
  if (fs.existsSync(dataFilePath)) {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    console.log('📥 Stored Data:', data);
    return data;
  } else {
    console.log('❌ No data found in the storage.');
    return [];
  }
};

module.exports = { saveData, readData };
