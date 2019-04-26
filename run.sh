pkill -ef -9 node
cd frontend
npm run build
cd ../backend
nohup npm start &