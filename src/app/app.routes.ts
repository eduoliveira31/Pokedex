import { Routes } from '@angular/router';
import { PokemonList } from './pokemon-list/pokemon-list';
// Se usaste o comando do terminal, o nome do ficheiro e da classe mudam ligeiramente:
import { PokemonDetail } from './pokemon-detail/pokemon-detail'; 

export const routes: Routes = [
  { path: '', component: PokemonList },
  { path: 'pokemon/:id', component: PokemonDetail },
  { path: '**', redirectTo: '' }
];