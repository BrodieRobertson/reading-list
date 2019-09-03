import { ReadingState } from './reading-state.enum';

export function stringToReadingState(value: string) {
    switch(value) {
        case "0":
            return ReadingState.CURRENTLY_READING
        case "1":
            return ReadingState.PLAN_TO_READ
        case "2":
            return ReadingState.DROPPED
        default:
            return null;
    }
}

export function stringToBoolean(value: string) {
    return (value === "0" ? false : true)
}