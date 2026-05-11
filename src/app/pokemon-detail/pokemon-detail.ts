import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Pokemon as PokemonService } from '../services/pokemon';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.css'
})
export class PokemonDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);
  
  pokemon = signal<any>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pokemonService.getPokemonDetails(id).subscribe(data => {
        this.pokemon.set(data);
      });
    }
  }
}