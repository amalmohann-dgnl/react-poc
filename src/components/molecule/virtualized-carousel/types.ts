export enum Direction {
    Horizontal = "horizontal",
    Vertical = "vertical",
}

export interface InitalDimensions {
    window: Dimensions,
    child: Dimensions,
    scroller: Dimensions,
}

export interface Dimensions {
    width: number,
    height: number,
    starting?: number
}

export interface InitParams {
    infiniteScrolling: boolean,
    rawData: any[],
    preceedingRepCards: number,
    succeedingRepCards: number,
    initialRenderCount: number,
}

export interface InitReturn {
    processRawData: ProcessRawData,
    getInitialRenderArray: GetInitialRenderArray
}

export interface CarousalProps {
    data: any,
    Item: any,
    initialRenderCount?: number, //Number of cards to be rendered initially. Ideally, this should be the total number of cards partially or fully visible in UI as per the design.
    windowBuffer?: number, // Amount of visibility buffer added to the window. If it's 0 then the Virtualized component will only render the item when it starts appearing in the window. But if a buffer is added it will render the item when the item starts appearing before the window corresponding to the windowBuffer. This helps smooth rendering of items.
    direction?: Direction, // Direction of the carousal.
    infiniteScrolling?: boolean, // Enable / Disable infinite scrolling in carousal.
    rightHandle?: JSX.Element, // The UI element to be rendered in the right scroll handle.
    leftHandle?: JSX.Element, // The UI element to be rendered in the left scroll handle.
    classVariables?: any[], // The elements in the array is used to create dynamic class names for better control over UI styling.
    anchorDelay?: number, // The delay between scroll ending and anchoring of items in rail. The value is in milliseconds.
    anchor?: boolean, // The cards can be anchored to the middle of the window. Mostly used in scenarios like the hero slider.
    autoScrollDelay?: number, // Delay for autoscrolling. if it's 0 no autoscrolling will happen.
    commonPropsToAllItems?: any, // An object containing common properties to all the items. This object will be passed to all the items without any change.
    handleScrollCount?: string, // Number of cards to be scrolled when the left OR right scroll handler is clicked. if set to ‘auto', the scroll is automatically calculated so that all fully visible cards will be moved out of visibility on each scroll.
    mapIndex?: number,
    showScrollBullets?: boolean, // Show or hide scroll bullets
    trackpadScrolling?: boolean,
}

export type Init = (params: InitParams) => InitReturn
export type ProcessRawData = () => any[]
export type GetInitialRenderArray = () => any[]