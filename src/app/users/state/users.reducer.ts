import { createReducer, on, createAction} from '@ngrx/store'

export const userReducer = createReducer(
    { showUserPosition: true},
    on(createAction('[Users] Toggle User Position'), state => {        
        return {
            ...state,
            showUserPosition : !state.showUserPosition
        }
    })
);
