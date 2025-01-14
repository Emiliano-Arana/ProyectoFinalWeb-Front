import { Garden } from "./garden.model";
import { Product } from "./product.model";

export class Relation{
    constructor(
        public huerto:Garden,
        public producto:Product,
        public stock: number
    ){}
}