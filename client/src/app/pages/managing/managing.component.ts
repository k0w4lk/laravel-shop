import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../core/components/header/header.component';

@Component({
  selector: 'app-managing',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './managing.component.html',
  styleUrls: ['./managing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagingComponent {}
