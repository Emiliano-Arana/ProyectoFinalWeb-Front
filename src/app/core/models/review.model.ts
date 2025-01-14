import { Garden } from "./garden.model";

export class Review{
    constructor(
            public idReview:number,
            public title:string,
            public content:string,
            public score:number,
            public date:string,
            public huerto:Garden
        ){}
}