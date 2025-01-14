import { Garden } from "./garden.model";

export class Crop{
    constructor(
        public idCrop:number,
        public quantity:number,
        public type:string,
        public date:string,
        public huerto:Garden
    ){}
}