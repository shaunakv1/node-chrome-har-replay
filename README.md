node-chrome-har-replay
======================

A node.js script that takes chorme HAR network log files, replay's it and generates performance benchmark.


How to use:

1.  Install node.js, if you haven't already. 
2.  Pull down all dependencies `npm install`
3.  Put some har files in worker/har
4.  Start the performance tester `node worker\main.js`
5.  Start the web service server `node server\server.js`
6.  Pull up `fontend\index.html` in any web-server

Alternatively, is using PM2 , just do `pm2 start pm2-app-runner.json` to fire up worker and server. 

Notes:

1.  Make sure to modify your `frontend\js\urlconf.js` if you are running server.js under different port or behind a web server proxy. 





