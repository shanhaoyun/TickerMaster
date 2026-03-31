const fs = require('fs');

try {
  const data = fs.readFileSync('./data.json', 'utf8');
  const parsed = JSON.parse(data);
  console.log('JSON is valid!');
  console.log('Parsed data:', parsed);
} catch (error) {
  console.error('JSON is invalid:', error.message);
}