import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Pokemon } from '../pokemon-list/pokemon-list';

@Injectable({
  providedIn: 'root'
})
export class Team {
  team: Pokemon[] = [];
  savedTeams: Pokemon[][] = []; // Array que vai guardar várias equipas
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('pokemon-team');
      if (saved) this.team = JSON.parse(saved);

      // Carregar as equipas guardadas da memória[cite: 3]
      const savedMulti = localStorage.getItem('pokemon-saved-teams');
      if (savedMulti) this.savedTeams = JSON.parse(savedMulti);
    }
  }

  private saveTeam() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('pokemon-team', JSON.stringify(this.team));
      localStorage.setItem('pokemon-saved-teams', JSON.stringify(this.savedTeams));
    }
  }

  addPokemon(pokemon: Pokemon) {
    if (this.team.length >= 6) { alert('Team is full'); return; }
    if (this.team.find((p) => p.id === pokemon.id)) { alert('Pokemon already in team'); return; }
    this.team.push(pokemon);
    this.saveTeam();
  }

  removePokemon(pokemon: Pokemon) {
    this.team = this.team.filter((p) => p.id !== pokemon.id);
    this.saveTeam();
  }

  // --- NOVOS MÉTODOS PARA MÚLTIPLAS EQUIPAS ---
  saveCurrentTeam() {
    if (this.team.length === 0) return;
    this.savedTeams.push([...this.team]); // Guarda uma cópia da equipa
    this.team = []; // Limpa o construtor atual
    this.saveTeam();
    alert('Equipa guardada com sucesso!');
  }

  removeSavedTeam(index: number) {
    this.savedTeams.splice(index, 1);
    this.saveTeam();
  }

  loadSavedTeam(index: number) {
    this.team = [...this.savedTeams[index]]; // Carrega a equipa para edição
    this.saveTeam();
  }
}