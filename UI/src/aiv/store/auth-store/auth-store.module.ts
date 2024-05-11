import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { authFeature } from './auth-store.reducer';

@NgModule({
  imports: [StoreModule.forFeature(authFeature.name, authFeature.reducer)],
})
export class authStoreModule {}
