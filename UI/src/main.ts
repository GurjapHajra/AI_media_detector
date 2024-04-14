import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './aiv/app.module';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
