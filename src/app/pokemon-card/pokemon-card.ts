import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pokemon } from '../pokemon-list/pokemon-list';
import { RouterLink } from '@angular/router'; // 1. Importa o RouterLink

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [RouterLink], 
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css'
})
export class PokemonCard {
  @Input() pokemon!: Pokemon;
  @Input() isTeamMode: boolean = false;
  @Output() addClicked = new EventEmitter<Pokemon>();
  @Output() removeClicked = new EventEmitter<Pokemon>();

  onAdd() { this.addClicked.emit(this.pokemon); }
  onRemove() { this.removeClicked.emit(this.pokemon); }
}