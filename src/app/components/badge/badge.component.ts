import { Component, Input } from '@angular/core';

/**
 * Componente criado para exibir um emblema.
 * Para ser criado precisamos inserir uma string dizendo qual o tipo de emblema.
 * O emblema pode ser: confirmed, pending ou cancelled.
 */
@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {

  @Input() badgeType: string = "";

}
