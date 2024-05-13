import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { RemoteAssetStoreEffects } from './remote-asset-store.effects';

@NgModule({
  imports: [EffectsModule.forFeature([RemoteAssetStoreEffects])],
})
export class remoteAssetStoreEffectsModule {}
