const Qb = require("./queryBuilder");
let q = new Qb();

try{
	q.dbInit();
}catch(e){
	console.error(e);
}
