import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubProcessComponent } from './sub-process/sub-process.component';
import { BaseComponent } from './base/base.component';
import { AuthGaurd } from './services/commonServices/auth-gaurd/auth.gaurd';

const routes: Routes = [
  { path: '', component: BaseComponent},
  { path: '**', redirectTo: ''}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
