export class RLikeDataTable {
    data = [];
    column_names: string[];

    public ncol(): number {
        return this.data.length
    }

    public nrow(): number {
        return this.data[0].length
    }

    public addColumn(name:string, array:any[]): void {
        if(array.length == this.nrow()) {
            this.column_names.push(name);
            this.data.push(array);
        } else {
            console.error("Improper column size");
            console.error(this.data);
            console.error(array);
        }
    }

    public getColumn(param:string|number): any[] {
        if (typeof param === "number") {
            return this.data[param]
        } else {
            return this.data[this.column_names.indexOf(param)]
        }
    }

    public computeNewColumn( new_col_name: string, callbackfct: (foo:any, bar:any) => any, first_col: string|number, second_col: string|number): void {
        let new_col = [];
        let col1 = this.getColumn(first_col);
        let col2 = this.getColumn(second_col);
        for(let i=0; i<this.nrow(); i++) {
            new_col.push(callbackfct(col1[i], col2[i]))
        }
        this.addColumn(new_col_name, new_col)
    }

    public ijk(truc): void {

    }

    public singleTest(col: string|number, test_function: (foo:any) => boolean): boolean[] {
        let test_col = this.getColumn(col);
        return test_col.map(e => { return test_function(e); })
    }

    public simpleFilter(keep: boolean[]): void {
        let new_data = [];
        for(let col_index=0; col_index<this.ncol(); col_index++){
            let new_col = [];
            for(let row_index=0; row_index<this.nrow(); row_index++) {
                if(keep[row_index]) {
                    new_col.push(this.data[col_index][row_index]);
                }
            }
            new_data.push(new_col);
        }
        this.data = new_data;

        /*this.data.map(col => {
            col.map((cell, index) => {

            })
        })*/
    }

    public createFromObjectArray<ObjectType>(object_array: Array<ObjectType>): boolean {
        this.data = [];
        if(object_array.length == 0) {
            console.error("Empty object_array as parameter of RLikeDataTable.createFromObjectArray()");
            return false;
        } else {
            this.column_names = Object.keys(object_array[0]);
            this.column_names.map(key => { this.data.push([]); })
            object_array.map((row_object)=>{
                this.column_names.map((key,index)=>{
                    this.data[index].push(row_object[key]);
                });
            });
            return true;
        }
    }

    public getObjectArray(): Array<Object> {
        let result = [];
        for(let a = 0; a<this.nrow(); a++){
            let object = {};
            this.column_names.map((attribute, cindex) => {
                object[attribute] = this.data[cindex][a]
            })
            result.push(object);
        }
        return result;
    }

    constructor(){
    }
}
