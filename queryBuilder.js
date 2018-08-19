const sql_con = require('sqlite3').verbose();
const fs = require("fs-extra");
class QueryBuilder {
    constructor() {
		let dbc = new sql_con.Database("app.db");
        this.db = dbc;
        this.results = [];
    }
    select(selection, table, lim) {
        //TODO: Implement Me
        var qs = "SELECT ";
        qs += this.arrayJustify(selection);
        qs += " FROM ";
        qs += this.arrayJustify(table);
        if (lim !== undefined) {
            qs += " WHERE ";
            qs += lim;
        }
        return qs;

    };
    update(table, colepar, id, val) {
        //TODO: Implement Me
        var qs = "UPDATE " + table + ' SET ';
        qs += this.arrayJustify(colepar);
        qs += " WHERE " + id + " = " + val;
        return qs;
    };
    arrayJustify(obj) {
        //TODO: Implement Me
        var qs = '';
        if (obj !== undefined) {
            if (!obj.hasOwnProperty("substr"))
                qs += obj;
        } else /*if (obj.hasOwnProperty("length")) */ {
            if ((obj[0]) !== undefined && obj.hasOwnProperty("length")) {
                qs += obj[0];
                for (var a = 1; a < obj.length; a++) {
                    qs += ", " + (obj[a] === undefined ? null : obj[a]);
                }
            }
        }
        return qs;
    };

    insert(tble, cols, vals) {
        //TODO: Implement Me --dangerous
        //console.log('datas',cols,vals);
        var qs = "INSERT or REPLACE INTO ";
        qs += tble + "(";
        qs += this.arrayJustify(cols);
        qs += ") VALUES (";
        qs += this.arrayJustify(vals) + ")";
        return qs;
    };
    valuate(data, arrEmp) {
        data.forEach((element, idx) => {
            arrEmp.push(element);
        });
        return arrEmp;
    };
    ex_key(data, arrEmp) {
        for (var element in data) {
            arrEmp.push(element);
        }
        return arrEmp;
    };
    ex_val(data, arrEmp) {
        for (var element in data) {
            arrEmp.push(this.str(data[element], []));
        }
        return arrEmp;
    };
    val_to_str(data) {
        let str = "";
        for(var e in data){
            str += e + "=" + this.str(data[e]) + ",";
        }     
        return str.substr(0,str.length-1);
    }
    str(element) {
        if (isNaN(element))
            return '"' + element + '"';
        else
            return (element);
    }
    correc (old,new_,pre) {
        for (let a in old){
            new_[pre + a] = old[a];
        }
        return new_;
    }
    mute(old,new_,muted){
        let ismuted = (current)=>{
            let tf = false;
            muted.some((el)=>{
                tf = el === current;
                return tf;
            });
            return tf;
        };
        for (let a in old){
            if(!ismuted(a)){
                new_[a] = old[a];
            }
        }
        return new_;
    }
    replace(old,new_,obj){
        for (let a in old){
                new_[obj[a]] = old[a];

        }
        return new_;
    }
    async dbInit(query){
		let result;
		console.log(result,"init");
	}
	promiseGet(query){
		let db = this.db;
		return new Promise(function(win,fail){
			db.all(query,(e,r)=>{
				if(e)fail(e);
				win(r);
			});
		});
	}
	promiseRun(query){
		let db = this.db;
		return new Promise(function(win,fail){
			db.run(query,function(e,r){
				if(e)fail(e);
				win(this.lastID);
			});
		});
	}
	/**
	 * query string is separated by ';'
	 * */
	async multipleQuery(string){
		let querys = string.split(";");
		let self = this;
		self.results = [];
		for(value in querys){
			try{
				let r = await self.promiseRun(value);
				self.results.push(r);
			}catch(e){
				self.results.push({"error":e.message});
			}
		}
		return self.results;
	}
	readSQL(fileName){
		return fs.readFileSync(fileName);
	}
	async readyDBTables(){
		let qrySQL = readSQL("db.sql");
		let result = multipleQuery(qrySQL);
		console.log(result);
	}
	
}
module.exports = QueryBuilder;
