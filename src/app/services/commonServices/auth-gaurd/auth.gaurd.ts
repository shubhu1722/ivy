import { CanActivate, Router, ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { ContextService } from '../contextService/context.service';
import { ActionService } from '../../action/action.service';

@Injectable({
  providedIn: 'root'
})
export class  AuthGaurd implements CanActivate {
  constructor( private router: Router, private contextService: ContextService, private actions: ActionService) {

  }
  data = [];

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
return  undefined
  }
}
