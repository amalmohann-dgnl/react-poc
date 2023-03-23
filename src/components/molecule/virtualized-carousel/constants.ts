// imports
import { Dimensions, Direction, InitalDimensions } from './types';

/**
 * @param direction of type Direction
 * @returns axis
 */
export const getAxis = (direction: Direction) => {
    return {
        main: direction === Direction.Horizontal ? 'x' : 'y',
        cross: direction === Direction.Horizontal ? 'y' : 'x',
        mainProperty: direction === Direction.Horizontal ? 'width' : 'height',
        crossProperty: direction === Direction.Horizontal ? 'height' : 'width',
        mainStart: direction === Direction.Horizontal ? 'left' : 'top',
        crossStart: direction === Direction.Horizontal ? 'top' : 'left',
    }
}

/** INitial width, height & starting values of child, window and scroller */
export const initialWidths: InitalDimensions = {
    window: {
        width: 0,
        height: 0,
        starting: 0
    } as Dimensions,
    child: {
        width: 0,
        height: 0
    } as Dimensions,
    scroller: {
        width: 0,
        height: 0
    } as Dimensions,
}



export const preceedingRepCards: number = 2 // Number of extra cards to be rendered in the beginning for infinite scrolling
export const succeedingRepCards: number = 2 