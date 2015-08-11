import * as path from "path";
import * as fs from "fs";
import Server = require("./server");
import Articles = require("./articles");

var clientPath = path.join(__dirname, "client");
var docPath = process.cwd();

if (fs.existsSync(path.join(docPath, "doc")) &&
  fs.lstatSync(path.join(docPath, "doc")).isDirectory()) {
    docPath = path.join(docPath, "doc")
} else if (fs.existsSync(path.join(docPath, "docs")) &&
  fs.lstatSync(path.join(docPath, "docs")).isDirectory()) {
    docPath = path.join(docPath, "docs");
}


console.log("Dokumentera Server");
console.log("---");
console.log("Client path: " + clientPath);
console.log("Documentation path: " + docPath);

var t = new Articles.ArticleTree(docPath);

Server.run(t);