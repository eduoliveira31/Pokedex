import { Component, OnInit, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pokemon as PokemonService } from '../services/pokemon';
import { finalize } from 'rxjs'; 
import { Team } from '../services/team';
import { PokemonCard } from '../pokemon-card/pokemon-card'; // Import do novo cartão

export interface Pokemon {
  id: number;
  name: string;
  url: string;
  image: string;
}

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [FormsModule, CommonModule, PokemonCard], // Cartão registado aqui
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.css',
})
export class PokemonList implements OnInit {
  private pokemonService = inject(PokemonService);
  private platformId = inject(PLATFORM_ID);
  
  teamService = inject(Team); 
  
  activeTab = signal<'current' | 'saved'>('current'); 
  setTab(tab: 'current' | 'saved') { this.activeTab.set(tab); }

  pokemons = signal<Pokemon[]>([]);
  isLoading = signal(false);
  currentPage = signal(1);
  searchTerm = signal('');
  totalCount = signal(0);
  
  limit = 20;
  removingPokemons = signal<string[]>([]);

  filteredPokemons = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const list = this.pokemons();
    if (!term) return list;
    return list.filter(p => p.name.toLowerCase().includes(term));
  });

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    const offset = (this.currentPage() - 1) * this.limit;
    
    this.pokemonService.getPokemons(this.limit, offset)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          if (!data || !data.results) return;
          this.totalCount.set(data.count || 0);
          this.pokemons.set(data.results.map((p) => {
            const parts = p.url.split('/').filter(x => !!x);
            const id = parts[parts.length - 1];
            return {
              id: Number(id),
              name: p.name,
              url: p.url,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            };
          }));
        }
      });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount() / this.limit);
  }

  goToPage(page: number) {
    if (this.isLoading() || page < 1 || page > this.totalPages) return;
    this.currentPage.set(page);
    this.searchTerm.set(''); 
    this.loadPokemons();
    if (isPlatformBrowser(this.platformId)) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage() { this.goToPage(this.currentPage() + 1); }
  previousPage() { this.goToPage(this.currentPage() - 1); }
  resetPokemons() { this.goToPage(1); }

  removePokemon(name: string) {
    this.removingPokemons.update(prev => [...prev, name]);
    setTimeout(() => {
      this.pokemons.update(prev => prev.filter(p => p.name !== name));
      this.removingPokemons.update(prev => prev.filter(n => n !== name));
    }, 400); 
  }

  addToTeam(pokemon: Pokemon) {
    this.teamService.addPokemon(pokemon);
  }
}