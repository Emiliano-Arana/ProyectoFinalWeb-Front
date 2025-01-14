import { Crop } from "./crop.model";
import { GardenProduct } from "./gardenProduct.model";
import { Review } from "./review.model";

export class Garden{
    constructor(
        public idGarden:number,
        public name: string,
        public latitude: number,
        public longitude: number,
        public description: string,
        public huertoProductos: GardenProduct[],
        public opiniones: Review[],
        public cultivos: Crop[]
    ){}
}