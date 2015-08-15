import * as fs from "fs"
import * as path from "path" 
import * as util from "util"

export class Article {
	
	constructor (simpleTitle: string, fullPath : string) {
		
		this.title = simpleTitle;
		
		var data = fs.readFileSync(fullPath);
		
		this.rawBody = data.toString();
		
		// Try extracting the title from first header
		let m = this.rawBody.match("^=*\s*(.+?)\s*=*(\r|\n|\z)")
		if (m && m.length >= 2) {
			this.title = m[1].trim();
		}
	}
	
	private title: string;
	private rawBody: string;
	
	public getTitle() { return this.title; } 
	public getBody() { return this.rawBody; }  
}

interface IndexNode {
	key: string;
	article: Article;
	children: IndexNode[];
}

export class Indexer {
	
	private root;
	private index = {};
	
	constructor (private basePath : string) {
		
		this.refresh();
		
		console.log("Index:");
		console.log(util.inspect(this.root, false, null));
		
		console.log("URL Index:");
		console.log(util.inspect(this.index, false, null));
		
		console.log("Navigation Tree:");
		console.log(util.inspect(this.getNavigation(), false, null));
	}
	
	private refresh() {
		this.index = {};
		this.root = this.indexDir(this.basePath);
	}
	
	private indexDir(basePath:string, subPath = "", currentUrl = "") {
		
		let dirPath = path.join(basePath, subPath);
		
		let root: IndexNode = {key:path.basename(subPath), article:undefined, children:[]};
		
		if (currentUrl.length > 0) {
			currentUrl += "/";
		}
		currentUrl += root.key;
		
		for (let f of fs.readdirSync(dirPath)) {
			
			let fullPath = path.join(dirPath, f);
			let stat = fs.statSync(fullPath);
			
			if (stat && stat.isDirectory()) {
				root.children.push(this.indexDir(basePath, path.join(subPath, f), currentUrl));
			} else if (path.extname(f) === ".md") {
				
				let key = path.basename(f, ".md");
				if (f === "index.md" || f === path.basename(subPath) + ".md") {
					root.article = new Article(key, fullPath)
				} else {
					let child = {
						key: key,
						article: new Article(key, fullPath),
						children: undefined
						};
					root.children.push(child);
					this.index[currentUrl + "/" + child.key] = child.article;
				}
				
			}
		}
		
		this.index[currentUrl] = root.article;
			
		return root;
	}
	
	public getNavigation() {
		return this.getNavigationFrom(this.root);
	}
	
	public getArticle(url: string) {
		return this.index[url];
	}
	
	private getNavigationFrom(node: IndexNode, currentUrl: string = "") {
		
		if (currentUrl.length > 0) {
			currentUrl += "/";
		}
		
		var nav = {
			url: currentUrl + node.key,
			title: node.article.getTitle(),
			children: undefined
		}; 
		
		if (node.children) {
			nav.children = node.children.map((c) => {
				return this.getNavigationFrom(c, currentUrl + node.key);
			})
		}
		
		return nav;
		
	}
	
}