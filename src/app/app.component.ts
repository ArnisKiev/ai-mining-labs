import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Lab1Component } from './labs/lab1/lab1.component';
import { Lab3Component } from './labs/lab3/lab3.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Lab1Component, Lab3Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ai-mining-labs';
}
