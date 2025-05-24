import { Component } from "@angular/core";
import { FormsModule } from '@angular/forms';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
  MatTooltipModule,
} from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from "@angular/router";
import { MainpageComponent } from "./mainpage/mainpage.component";
import { AuthComponent } from "./auth/auth.component";

@Component({
  selector:'app-root',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatTooltipModule, MatInputModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {

}
