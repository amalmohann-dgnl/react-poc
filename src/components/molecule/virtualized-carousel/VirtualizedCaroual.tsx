// @ts-nocheck
import React, { useLayoutEffect, useRef, useState ,useEffect} from 'react';
import { getAxis, initialWidths, preceedingRepCards, succeedingRepCards  } from './constants'
import initFunctions from './init';
import utilsFunctions from './utils';
import RightHandle from './RightHandle';
import LeftHandle from './LeftHandle';
import useScrollResizeEvents from './useScrollResizeEvents';
import useHandleVisibility from './useHandleVisibility';
import useInfiniteScrolling from './useInfinteScrolling';
import { CarousalProps } from './types';
// import './VirtualizedCarouselStyle';

/** Wrapper for the indivudual Rail item in Carousal */
const IndivudualItem = React.memo((props) => {
    const { Item, getPositionStyle, data, item, index, commonPropsToAllItems } = props
    if(item === null) return null // item will be null if that item is not suppposed to be rendered into DOM, by the windowing logic.
    return(<>
    <div id={`car-item-${index}`} data-card={item} className="car-item" style={getPositionStyle(item)}>{
        <Item index={item} itemData={data[item]} {...commonPropsToAllItems} />}
    </div>
    </>)
})
/** Mapping railItems inside the scroller */
const RenderItems = React.memo((props) => {
    const { renderArray, Item, getPositionStyle, data, commonPropsToAllItems } = props
    return(<>
    {renderArray.length && renderArray.map((item, index) => <IndivudualItem item={item}  index={index} data={data} getPositionStyle={getPositionStyle} Item={Item} commonPropsToAllItems={commonPropsToAllItems} />)}
    </>)
})

export const Carousal: React.FunctionComponent<CarousalProps> = (props) => {
    const { data: rawData, Item,
        initialRenderCount = 7, //Number of cards to be rendered initially. Ideally, this should be the total number of cards partially or fully visible in UI as per the design.
        windowBuffer = 800, // Amount of visibility buffer added to the window. If it's 0 then the Virtualized component will only render the item when it starts appearing in the window. But if a buffer is added it will render the item when the item starts appearing before the window corresponding to the windowBuffer. This helps smooth rendering of items.
        direction = 'horizontal', // Direction of the carousal.
        infiniteScrolling = false, // Enable / Disable infinite scrolling in carousal.
        rightHandle = <RightHandle />, // The UI element to be rendered in the right scroll handle.
        leftHandle = <LeftHandle />, // The UI element to be rendered in the left scroll handle.
        classVariables = [], // The elements in the array is used to create dynamic class names for better control over UI styling.
        anchorDelay = 100, // The delay between scroll ending and anchoring of items in rail. The value is in milliseconds.
        anchor = false, // The cards can be anchored to the middle of the window. Mostly used in scenarios like the hero slider.
        autoScrollDelay = 4000, // Delay for autoscrolling. if it's 0 no autoscrolling will happen.
        commonPropsToAllItems = {}, // An object containing common properties to all the items. This object will be passed to all the items without any change.
        handleScrollCount: hsc = 'auto', // Number of cards to be scrolled when the left OR right scroll handler is clicked. if set to ‘auto', the scroll is automatically calculated so that all fully visible cards will be moved out of visibility on each scroll.
        mapIndex,
        showScrollBullets = false, // Show or hide scroll bullets
        trackpadScrolling = false, // Prevent scrolling by scroll wheel.
    } = props;

    const { processRawData, getInitialRenderArray } =
    initFunctions({  infiniteScrolling, rawData, preceedingRepCards, succeedingRepCards, initialRenderCount })

    /* Constants */
    const axis = getAxis(direction) // Calulating all axis properties based on the direction of the carousal
    /* States*/
    const [data, setData] = useState(processRawData) // processed rawData - In case of carousal without infinte scrolling it will be same as the rawData passed via the props.
    const [renderArray, setRenderArray] = useState(getInitialRenderArray) // The actual array thats used to map item to the DOM.
    const [widths, setWidths] = useState(initialWidths) // Width and height propeties of the window, child and scroller.
    const [centerCard, setCenterCard] = useState(null) // Applicable only if its infinite scrolling rail
    /* Refs */
    const scrollerRef = useRef(null) // Reference of the scroller element that contains the mapping of indivudual rial items.
    const windowRef = useRef(null) // Reference of the window component, which is the parent of the scrolle element. The overflow: scroll happens in this component.
    const leftHandleRef = useRef(null) // Refernece for left handle, used for hiding and showing the element
    const rightHandleRef = useRef(null) // Refernece for right handle, used for hiding and showing the element
    /** To get updated Ref values in utilsFunctions */
    const refs = { scrollerRef, windowRef, leftHandleRef, rightHandleRef } // Object containing the refernces of Refs used in the logic.
    const getRefs = () => refs
    /** To get updated State values in utilsFunctions */
    const states = { data, widths }
    const getStates = () => states

    /** if handleScrollCount is auto, calculating the number of cards visible in window to do scrolling */
    let handleScrollCount = hsc
    if (hsc === 'auto' && widths.window.width && widths.child.width) {
        handleScrollCount = Math.floor(widths.window.width / widths.child.width) || 1
    } else if (hsc === 'auto') handleScrollCount = 1;
    /** ------------------------------------------------------------------------------------------------ */
    
    /* All Utils Functions */
    const { updateAllSizeProperties, getPositionStyle, getCustomizedClassNames } =
    utilsFunctions({ getRefs, widths, setWidths, axis, getStates })

    /** The function process and returns a new render array when ever the data prop changes. It take into consideration the
     * current render array as well to return the new array without change in the rendered position.
     */
    const processRenderArray = (r) => {
        const newInitialRenderArray = getInitialRenderArray()
        const currentRenderArray = renderArray
        const pArray = newInitialRenderArray.map((x, index) => {
            if(currentRenderArray[index] !== undefined && currentRenderArray[index] !== null) return currentRenderArray[index]
            return null
        })
        return pArray
    }

    /** logic for handling infinite scrolling, Scrolling cards to center, auto-scrolling on idle, and handler scrolling */
    const { scrollRealCardToCenter, handlerScroll, updateCenterCardState } = useInfiniteScrolling({ mapIndex, centerCard, rawData, autoScrollDelay, widths, infiniteScrolling, preceedingRepCards, succeedingRepCards, getRefs, axis, anchorDelay, setCenterCard, anchor, handleScrollCount, trackpadScrolling })
    /** Calculate widths/heights & Set Scroller height w.r.t to child height - after first render*/
    useLayoutEffect(updateAllSizeProperties,[data])
    /** Updating data and rendered array when input data changes. This interurn will update the width & height properties.*/
    function updateDataWhenPropDataChange() { setData(processRawData); setRenderArray(processRenderArray(rawData)); }
    useEffect(updateDataWhenPropDataChange, [rawData])
    /** On scroll & resize listner and its effects */
    useScrollResizeEvents({ mapIndex, getRefs, getStates, setRenderArray, renderArray, axis, widths, windowBuffer, data , updateAllSizeProperties, updateCenterCardState })
    /** Handling dispaly and hiding of handles */
    useHandleVisibility({ getRefs, getStates, axis, widths, data, renderArray, mapIndex})
    return(
        <div className={getCustomizedClassNames('railwrapper', classVariables, true)}>
            <div id={getCustomizedClassNames('left-handle', classVariables, true)} ref={leftHandleRef} className="left-handle" onClick={() => { handlerScroll('left') }}>{leftHandle}</div>
            <div ref={windowRef} className={getCustomizedClassNames('window', classVariables, true)} id={'window' + Math.random()}>   
                <div className={getCustomizedClassNames('scroller', classVariables, true)} ref={scrollerRef}  id={'scroller' + Math.random()}>
                    <RenderItems renderArray={renderArray} Item={Item} getPositionStyle={getPositionStyle} data={data} commonPropsToAllItems={commonPropsToAllItems} />
                </div>
                
            </div>
            <div id={getCustomizedClassNames('right-handle', classVariables, true)} ref={rightHandleRef} className="right-handle" onClick={() => { handlerScroll('right') }}>{rightHandle}</div>
            {anchor === 'center' && showScrollBullets && rawData.map ? 
                    <div className={getCustomizedClassNames('scroll-bullet-wrapper', classVariables, true)}>
                        {rawData.map((item, index) => 
                        <div onClick={() => { scrollRealCardToCenter(index) }} className={`${getCustomizedClassNames('scroll-bullets', classVariables, true)} ${centerCard === index ? 'active' : ''}`}>
                        </div>)}
                    </div>
                : null
            }
        </div>
    )

}

