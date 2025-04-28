import { Routes } from '@angular/router';
import { MathematicsComponent } from './mathematics/mathematics.component';
import { MainpageComponent } from './mainpage/mainpage.component';

export const routes: Routes = [
    {path:'', component: MainpageComponent},
    {path:'mathematics', component: MathematicsComponent}
];
