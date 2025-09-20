{
  "name": "job-scraper-backend",
  "version": "1.0.0",
  "description": "Backend para extração de vagas do Gupy",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "job",
    "scraper", 
    "gupy",
    "api",
    "node.js"
  ],
  "author": "Seu Nome",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "axios": "^1.6.0",
    "cheerio": "^1.0.0-rc.12",
    "sqlite3": "^5.1.6"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}