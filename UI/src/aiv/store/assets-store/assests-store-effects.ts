import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import * as UserActions from './asset-store.actions';

@Injectable()
export class UserEffects {

    constructor(private actions$: Actions) { }

    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.updateUser),
            map(action => {
                // Perform side effects like API calls to update user info
                return { type: 'User Updated Successfully' };
            })
        )
    );
}