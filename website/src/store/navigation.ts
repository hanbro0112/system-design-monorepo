import { legacy_createStore as createStore } from 'redux'

export enum navigationActionType {
    TOGGLE_NAVIGATION = 'TOGGLE_NAVIGATION',
    SET_ACTIVE_NAVIGATION = 'SET_ACTIVE_NAVIGATION',
}

type action = {
    type: navigationActionType,
    menu: {
        id: string,
        type: string,
    }
}

const initialState = {
    isOpen: [] as string[],
    isTrigger: [] as string[],
} 

const reducer = (state = initialState, action: action) => {
    switch (action.type) {
        case navigationActionType.TOGGLE_NAVIGATION:
            let { isOpen, isTrigger } = state;
            const isToggle = isTrigger.includes(action.menu.id);
            if (action.menu.type === 'sub') {
                if (isToggle) { 
                    isOpen = isOpen.filter(id => id !== action.menu.id);
                    isTrigger = isTrigger.filter(id => id !== action.menu.id);
                } else {
                    isOpen = [...isOpen, action.menu.id];
                    isTrigger = [...isTrigger, action.menu.id];
                }
            } else {
                if (isToggle) {
                    isOpen = [];
                    isTrigger = [];
                } else {
                    isOpen = [action.menu.id];
                    isTrigger = [action.menu.id];
                }
            }
            return {
                ...state,
                isOpen,
                isTrigger
            };
        default:
            return state;
    }
}

export const navigationStore = createStore(reducer);