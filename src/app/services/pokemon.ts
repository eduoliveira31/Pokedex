import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface PokemonApiItem {
  name: string;
  url: string;
}

export interface PokemonApiResponse {
  count: number;
  results: PokemonApiItem[];
}

@Injectable({
  providedIn: 'root',
})
export class Pokemon {
  constructor(private http: HttpClient) {}

  getPokemons(limit: number, offset: number) {
    return this.http.get<PokemonApiResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
  }

  getPokemonDetails(id: string) {
  return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon/${id}`);
  }
  
}