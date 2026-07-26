import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './summary-card.html',
  styleUrls: ['./summary-card.scss']
})
export class SummaryCard {

  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  amount = 0;

  @Input({ required: true })
  icon!: string;

  @Input()
  color: 'green' | 'red' | 'blue' = 'blue';

}