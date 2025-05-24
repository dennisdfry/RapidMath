import { Routes } from '@angular/router';
import { MathematicsComponent } from './mathematics/mathematics.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { BrainJoggingCanvasComponent } from './brain-jogging-canvas/brain-jogging-canvas.component';
import { MemoryGameComponent } from './memory-game/memory-game.component';
import { ReactionMatrixComponent } from './reaction-matrix/reaction-matrix.component';
import { ColorFocusComponent } from './color-focus/color-focus.component';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
    {path:'', component: AuthComponent},
    {path:'mainpage', component: MainpageComponent},
    {path:'mathematics', component: MathematicsComponent},
    {path:'visuality', component: BrainJoggingCanvasComponent},
    {path:'memory', component: MemoryGameComponent},
    {path:'matrix', component: ReactionMatrixComponent},
    {path:'color-focus', component: ColorFocusComponent}
];
