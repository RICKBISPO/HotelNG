import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { HomeComponent } from './pages/home/home.component';
import { GuestsComponent } from './pages/guests/guests.component';
import { ReservationsDetailsComponent } from './pages/reservations-details/reservations-details.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: HomeComponent
            },
            {
                path: 'reservations',
                component: ReservationsComponent
            },
            {
                path: 'reservations/:id',
                component: ReservationsDetailsComponent
            },
            {
                path: 'guests',
                component: GuestsComponent
            }
        ]
    },

    {
        path: '**',
        component: NotFoundComponent,
    }

];
