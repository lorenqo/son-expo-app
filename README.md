для запуска: npx expo start --tunnel

для запуска https: 
npx expo start 
npx local-ssl-proxy --source 9443 --target 8081 --hostname test.xander-le.work --cert test.xander-le.work.pem --key test.xander-le.work-key.pem

для запуска на андроид в терминале команда: 
ngrok http 443

docker start: 
cd /home/fulzeero/Документы/site/home/xander/sites/liveexpert
docker compose up -d

app build:
npx expo run:android