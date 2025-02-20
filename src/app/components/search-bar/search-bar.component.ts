import { Component, ElementRef, ViewChild } from '@angular/core';
import { SearchBarService } from '../../services/search-bar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Componente criado para exibir uma barra de pesquisa. 
 * Todo caractere é atualizado no respectivo service.
 */
@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  searchedValue: string = "";

  @ViewChild('searchBarInput') searchBarInput!: ElementRef;

  constructor(
    private searchBarService: SearchBarService
  ) { }

  ngAfterViewInit(): void {
    this.searchBarInput.nativeElement.focus();
  }

  inputSearchedValue(): void  {
    this.searchBarService.searchBarSubject$.next(this.searchedValue);
  }

}
