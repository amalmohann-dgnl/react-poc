import { GetInitialRenderArray, Init, InitParams, InitReturn, ProcessRawData } from "./types"

const init: Init = (params: InitParams) : InitReturn => {

    const { infiniteScrolling, rawData, preceedingRepCards, succeedingRepCards, initialRenderCount } = params

    /** process rawCards received as props and return the updated array to be used by the component.
     ** If rail is not infinitescrolling rail, it wont do any processing, It will just return the original array.
     */
    const processRawData: ProcessRawData = () : any[] => {
        if (infiniteScrolling) {
            return [...rawData.slice(rawData.length - preceedingRepCards, rawData.length), ...rawData, ...rawData.slice( 0, succeedingRepCards)]
        } else {
            return rawData
        }
    }

    // Total data count at any particular moment
    const getDataCount: () => number = (): number => infiniteScrolling ? rawData.length + preceedingRepCards + succeedingRepCards : rawData.length

    // A util function
    const absoluteIntialRenderCount:() => number = (): number => initialRenderCount > rawData.length ? rawData.length : initialRenderCount
    
    // Calculating initial renderArray
    const getInitialRenderArray: GetInitialRenderArray = (): any[] => [Array.from(Array(absoluteIntialRenderCount()).keys()), ...new Array(getDataCount() - absoluteIntialRenderCount()).fill(null)]

    return {
        processRawData,
        getInitialRenderArray,
    } as InitReturn
}

export default init;
