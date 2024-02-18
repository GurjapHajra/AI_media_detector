import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AssetUploaderDirective } from './directives/image_uploader/asset-uploader.directive';
import { MediaUploaderComponent } from './components/media-uploader/media-uploader.component';
import { HomePageComponent } from './screens/home-page/home-page.component';
import { UploaderComponent } from './screens/uploader/uploader.component';

@NgModule({
  declarations: [
    AppComponent,
    AssetUploaderDirective,
    MediaUploaderComponent,
    HomePageComponent,
    UploaderComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
