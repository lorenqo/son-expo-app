для запуска: npx expo start --tunnel

для запуска https: 
1: npx expo start
2: npx local-ssl-proxy --source 9443 --target 8081 --hostname test.xander-le.work --cert test.xander-le.work.pem --key test.xander-le.work-key.pem

для запуска на андроид в терминале команда: 
adb reverse tcp:1111 tcp:80
adb reverse tcp:7777 tcp:443
после шаги выше

docker start: 
cd /home/fulzeero/Документы/site/home/xander/sites/liveexpert
docker compose up -d