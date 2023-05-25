import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() public disabled: boolean = false;
  @Input() public type: string = 'button';

  @Output() public buttonClick = new EventEmitter<void>();

  @HostListener('click') public buttonClicked() {
    this.buttonClick.emit();
  }
}
