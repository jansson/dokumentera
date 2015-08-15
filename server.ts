import * as express from "express";
import * as path from "path";
import idx = require("./index");

export function run(indexer: idx.Indexer) {

	var app = express();
	
	app.use(function (req, res, next) {
		
		if (req.path.indexOf("/client") === 0) {
			next();
			return;
		}
		if (req.path.indexOf("/api") === 0) {
			next();
			return;
		}
		
		res.sendFile(path.join(__dirname, "client", "index.html"))
	});
	
	app.use("/client", express.static(path.join(__dirname, "client")));
	
	app.get("/api/navigation", (req, res) => {
		res.send(indexer.getNavigation());
	});
	
	app.get("/api/article*", (req, res) => {
		let url = req.path.substr("/api/article/".length).replace(/^\/+|\/+$/g, '');
		res.send(indexer.getArticle(url));
	});
	
	var server = app.listen(3000, function () {
	  var host = server.address().address;
	  var port = server.address().port;
	
	  console.log('Server listening at http://%s:%s', host, port);
	});
}