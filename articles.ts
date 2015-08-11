export class Article {
	
	constructor (
		private title: string,
		private url: string,
		private body: string) {
		
	}
	
	public getTitle() { return this.title; }
	public getUrl() { return this.url; } 
	public getBody() { return this.body; }  
	
	public children: Article[];
}

export class ArticleTree {
	
	constructor(path: string) {
		
	}
	
	public getRoot() {
		return new Article("Index", "index", "Hello World");
	}
}