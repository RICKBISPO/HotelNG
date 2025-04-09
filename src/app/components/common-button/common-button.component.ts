import { Component, Input } from '@angular/core';

/**
 * Componente criado para exibir um botao personalizado.
 * Para ser criado precisamos inserir uma classe e um type. 
 * O restante é criado usando ng-container no componente que for implementar.
 */
@Component({
  selector: 'app-common-button',
  imports: [],
  templateUrl: './common-button.component.html',
  styleUrl: './common-button.component.scss'
})
export class CommonButtonComponent {

  @Input() buttonClass: string = "";
  @Input() buttonType: string = "";

}
