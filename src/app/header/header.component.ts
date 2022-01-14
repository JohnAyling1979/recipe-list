import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() selectedView = new EventEmitter<string>();
  collapsed = true;

  onClicked(view: string) {
    this.selectedView.emit(view);
  }
}
