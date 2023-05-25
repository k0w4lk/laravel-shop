import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Pagination } from '../../configs/interfaces/pagination.interface';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() public pagination: Pagination = null;

  @Output() public pageChanged = new EventEmitter<number>();

  public openPage(page: number): void {
    this.pageChanged.emit(page);
  }
}
