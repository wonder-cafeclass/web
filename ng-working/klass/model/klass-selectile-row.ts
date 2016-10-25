import { KlassSelectile }                  from './klass-selectile';

export class KlassSelectileRow {
    public selectiles: KlassSelectile[];

    constructor() {
        this.selectiles = [];
    }

    public add(selectile:KlassSelectile):void {
    	this.selectiles.push(selectile);
    }
}