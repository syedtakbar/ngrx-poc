import { createReducer, on, createAction} from '@ngrx/store'

export const userReducer = createReducer(
    { showUserPosition: false},
    on(createAction('[Users] Toggle User Position'), state => {        
        return {
            ...state,
            showUserPosition : !state.showUserPosition
        }
    })
);
