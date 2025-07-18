import { legacy_createStore as createStore } from 'redux'

export enum navigationActionType {
    TOGGLE_NAVIGATION = 'TOGGLE_NAVIGATION',
    TOGGLE_BARACTION = 'TOGGLE_BARACTION',
}

type action = {
    type: navigationActionType,
    menu?: {
        id: string,
        type: string,
    }
    isToggleAction?: boolean, 
}

const initialState = {
    isOpen: [] as string[],
    isTrigger: [] as string[],
    isToggleAction: false
} 

const reducer = (state = initialState, action: action) => {
    switch (action.type) {
        case navigationActionType.TOGGLE_NAVIGATION:
            let { isOpen, isTrigger } = state;
            const { id: mid, type } = action.menu!;
            const isToggle = isTrigger.includes(mid);
            if (type === 'sub') {
                if (isToggle) { 
                    isOpen = isOpen.filter(id => id !== mid);
                    isTrigger = isTrigger.filter(id => id !== mid);
                } else {
                    isOpen = [...isOpen, mid];
                    isTrigger = [...isTrigger, mid];
                }
            } else {
                if (isToggle) {
                    isOpen = [];
                    isTrigger = [];
                } else {
                    isOpen = [mid];
                    isTrigger = [mid];
                }
            }
            return {
                ...state,
                isOpen,
                isTrigger
            };
        case navigationActionType.TOGGLE_BARACTION:
            return {
                ...state,
                isToggleAction: !state.isToggleAction
            };
        default:
            return state;
    }
}

export const navigationStore = createStore(reducer);