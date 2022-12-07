import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent {
  @Input()
  contextMenuItems: Array<ContextMenuModel>

  @Output()
  onContextMenuItemClick: EventEmitter<any> = new EventEmitter<any>()

  onContextMenuClick(event, data): any {
    console.log(event, data)
    this.onContextMenuItemClick.emit({
      event,
      data,
    })
  }
}

interface ContextMenuModel {
  menuText: string
  menuEvent: string
  icon: string
  extraData: any
}