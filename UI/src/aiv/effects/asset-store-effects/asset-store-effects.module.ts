import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { AssetStoreEffects } from './asset-store.effects';

@NgModule({
  imports: [EffectsModule.forFeature([AssetStoreEffects])],
})
export class AssetStoreEffectsModule {}
