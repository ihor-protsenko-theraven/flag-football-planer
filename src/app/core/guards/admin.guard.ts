import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take, tap } from 'rxjs/operators';
import { APP_ROUTES } from '../constants/routes';

export const adminGuard: CanActivateFn = (route, state) => {
    const auth = inject(Auth);
    const router = inject(Router);

    return authState(auth).pipe(
        take(1),
        map(user => !!user),
        tap(isLoggedIn => {
            if (!isLoggedIn) {
                router.navigate([APP_ROUTES.ADMIN.LOGIN], { queryParams: { returnUrl: state.url } });
            }
        })
    );
};
