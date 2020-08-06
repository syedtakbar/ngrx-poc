import { createReducer, on, createAction} from '@ngrx/store'
import { JsonPipe } from '@angular/common';

export const loginReducer = createReducer(
    { maskUserName: true},
    on(createAction('[User] Mask User Name'), state => {                
        return {
            ...state,
            maskUserName : !state.maskUserName
        }
    })
);
