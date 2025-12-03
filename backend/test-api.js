const http = require('http');

function testAPI(endpoint, description) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3001${endpoint}`, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`✅ ${description}`);
          console.log(`   Endpoint: ${endpoint}`);
          console.log(`   Questions: ${parsed.length}`);
          if (parsed.length > 0) {
            console.log(`   Ejemplo: "${parsed[0].text.substring(0, 50)}..."`);
          }
          resolve(true);
        } catch (error) {
          console.log(`❌ ${description} - Error parsing JSON`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ ${description} - ${err.message}`);
      resolve(false);
    });
  });
}

async function runTests() {
  console.log('🧪 Probando endpoints de la API...\n');
  
  await testAPI('/api/questions/logoquiz/1', 'Logo Quiz - Nivel 1');
  await testAPI('/api/questions/python/1', 'Python - Nivel 1');
  await testAPI('/api/questions/git/1', 'Git - Nivel 1');
  await testAPI('/api/questions/php/1', 'PHP - Nivel 1');
  
  console.log('\n✨ Pruebas completadas');
  process.exit();
}

runTests();
