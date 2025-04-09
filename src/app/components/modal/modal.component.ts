import { Component, Input } from '@angular/core';

/**
 * Componente criado para exibir um modal personalizado.
 * Para ser criado precisamos inserir um id. 
 * O restante é criado usando ng-container no componente que for implementar.
 */
@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  @Input() modalId: string = "";

}
