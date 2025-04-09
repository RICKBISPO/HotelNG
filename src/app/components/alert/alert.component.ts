import { Component, Input } from '@angular/core';
import { Alert } from '../../model/alert';

/**
 * Componente criado para exibir um alerta no canto inferior esquerdo da tela.
 * Para ser criado precisamos inserir um objeto do tipo Alert.
 * O alerta pode ser de sucesso ou erro.
 */
@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {

  @Input() alert!: Alert;

}
