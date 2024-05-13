import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { RemoteAssetStoreEffects } from './remote-asset-store-effect.module';

@NgModule({
  imports: [EffectsModule.forFeature([RemoteAssetStoreEffects])],
})
export class remoteAssetStoreEffectsModule {}
