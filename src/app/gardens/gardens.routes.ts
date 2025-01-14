import { Routes } from "@angular/router";
import { GardensListComponent } from "./gardens-list/gardens-list.component";
import { GardenDetailComponent } from "./garden-detail/garden-detail.component";
import { GardensOwnerComponent } from "./gardens-owner/gardens-owner.component";
import { GardenEditComponent } from "./garden-edit/garden-edit.component";
import { Component } from "@angular/core";
import { MapaComponent } from "./mapa/mapa.component";
import { GardenAddComponent } from "./garden-add/garden-add.component";
import { authOwnerGuard } from "../core/guards/auth-owner.guard";
import { CreateReviewComponent } from "./create-review/create-review.component";
import { authUserGuard } from "../core/guards/auth-user.guard";
import { AddHarvestComponent } from "./add-harvest/add-harvest.component";

export const GARDENS_ROUTES: Routes = [
    {path: '', component: GardensListComponent,
        canMatch:[authUserGuard]
    },
    {path: '', component: GardensOwnerComponent,
        canMatch:[authOwnerGuard]
    },
    {path: 'add-garden', component: GardenAddComponent,
        canMatch:[authOwnerGuard]
    },
    {path: 'edit-garden/:id', component: GardenEditComponent,
        canMatch:[authOwnerGuard]
    },
    {path: 'edit-garden/:id/add-harvest', component: AddHarvestComponent,
        canMatch:[authOwnerGuard]
    },
    {path: 'mapa',component: MapaComponent},
    {path: 'garden-detail/:id', component: GardenDetailComponent,
        canMatch:[authUserGuard]
    },
    {path: 'garden-detail/:id/create-review', component: CreateReviewComponent,
        canMatch:[authUserGuard]
    }
]