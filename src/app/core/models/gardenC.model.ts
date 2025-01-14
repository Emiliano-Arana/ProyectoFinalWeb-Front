import { User } from "./user.model";

export class GardenC{
    constructor(
        public idGarden:number,
        public name: string,
        public latitude: number,
        public longitude: number,
        public description: string,
        public usuario: User
    ){}
}