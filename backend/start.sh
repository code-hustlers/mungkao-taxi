docker-compose up -d --build --force-recreate
docker-compose run backend npm install
docker-compose run backend npm start