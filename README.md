node-chrome-har-replay
======================

A node.js script that takes chorme HAR network log files, replay's it and generates performance benchmark.

How to use:

1.  Put some har files in worker/har
2.  Start the performance tester `node worker\main.js`
3.  Start the web service server `node server\server.js`
4.  Pull up `fontend\index.html` in any web-server

Alternatively, is using PM2 , just do `pm2 start pm2-app-runner.json` to fire up worker and server. 





