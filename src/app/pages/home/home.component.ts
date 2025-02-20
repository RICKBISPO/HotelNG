import { Component } from '@angular/core';
import { CommonButtonComponent } from '../../components/common-button/common-button.component';
import { RouterLink } from '@angular/router';

/**
 * Componente criado definir pagina inicial da aplicacao.
 */
@Component({
  selector: 'app-home',
  imports: [CommonButtonComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
