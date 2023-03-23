// @ts-nocheck 

import React,{ useEffect, useRef, useState } from "react"

const useInfiniteScrolling = (props) => {
    const { centerCard, rawData, widths, autoScrollDelay, infiniteScrolling , preceedingRepCards, succeedingRepCards, getRefs, axis, anchorDelay, setCenterCard, anchor, handleScrollCount, trackpadScrolling } = props
    const scrollActivityTimer = useRef(null)
    const autoScrollIntervalRef = useRef(null)
    const [pageVisible, setPageVisible] = useState(true)
    const centerCardRef = useRef(centerCard)
    centerCardRef.current = centerCard
  

    /** This function is triggered on scrolling.  It will check whether we are approaching the end/start and if so
     * It will swap the edges accordingly. This function will only be invoked if the rail is an infinite scrolling one.
     */
    function swappingEdges() {
        const { windowRef } = getRefs()
        const currentScrollStart = windowRef.current[`${axis.mainStart === 'left' ? 'scrollLeft' : 'scollTop'}`] 
        const currentScrollFromMiddle = currentScrollStart + widths.window[axis.mainProperty]/2 
        const totalWidthOfPreceedingcCards = preceedingRepCards * widths.child[axis.mainProperty]
        if (currentScrollFromMiddle < totalWidthOfPreceedingcCards) {
            // moved to the extreme start so swap the rail to the end 
            const difference = totalWidthOfPreceedingcCards - currentScrollFromMiddle
            const lastItemScrollPosition = widths.scroller[axis.mainProperty] -  succeedingRepCards * widths.child[axis.mainProperty] - difference
            windowRef.current.scroll({
                [axis.mainStart] : lastItemScrollPosition - widths.window[axis.mainProperty] / 2,
                behavior: 'instant'
            })
            return
        }
        const totalWidthOfSuccedingCards = succeedingRepCards * widths.child[axis.mainProperty]
        const endPositonOfLastRealCard = widths.scroller[axis.mainProperty] - totalWidthOfSuccedingCards
        if ( currentScrollStart + widths.window[axis.mainProperty]/2 > endPositonOfLastRealCard) {
            // moved to the extreme end so swap the rail to the start
            const difference =  (currentScrollStart + widths.window[axis.mainProperty]/2) - endPositonOfLastRealCard
            const firstItemScrollPosition = preceedingRepCards * widths.child[axis.mainProperty] - difference
            windowRef.current.scroll({
                [axis.mainStart] : firstItemScrollPosition - widths.window[axis.mainProperty] / 2,
                behavior: 'instant'
            })
            return
        }
    }

    /** Function will update the state which represent the currently focused center card. This value is used to render the scroll bullet focus state. */
    function updateCenterCardState(absCard) {
        setCenterCard(absCard - preceedingRepCards)
    }

    /** Scroll a card to center of the window. (Not the screen)
     * @param {number} card - Index of the card to be scrolled may have more elements than rawData*
    */
     function scrollToCenter(card, instant = false) {
        const { windowRef } = getRefs()
        if (windowRef.current) {
            windowRef.current.scroll({
                left: ((card + 0.5) * widths.child[axis.mainProperty]) - widths.window[axis.mainProperty]/2,
                behavior: instant ? 'instant' : 'smooth'
            })
        }
        updateCenterCardState(card)
    }

    const eventLitnerHold = useRef(null)
    /** Scroll a particular card to center. The index value varies between 0 and rawData.length - 1 */
    function scrollRealCardToCenter(realCard, instant) {
        scrollToCenter(realCard + preceedingRepCards, instant)
    }

    /** Returns the index of the card that is almost/exactly at the center */
    function findCardAtmiddle() {
        const { windowRef } = getRefs()
        const currentScrollStart = windowRef.current?.[`${axis.mainStart === 'left' ? 'scrollLeft' : 'scollTop'}`] 
        const scrollerMidPoint = currentScrollStart +  widths.window[axis.mainProperty] / 2
        const cardAtMiddle = Math.floor(scrollerMidPoint / widths.child[axis.mainProperty])
        return cardAtMiddle
    }

    const explicitSwappingOfCards = () => {
        if (!infiniteScrolling) return
        clearTimeout(eventLitnerHold.current)
        eventLitnerHold.current = setTimeout(() => {
            eventLitnerHold.current = null; 
            if (centerCardRef.current === rawData.length) {
                //swaptostart
                scrollRealCardToCenter(0, true)

            } else if (centerCardRef.current < 0) {
                //swaptoright
                scrollRealCardToCenter(rawData.length - 1, true)

            }
        }, 900)
    }


    /** When kept idle, scrolling through cards */
    const [autoScroll, setAutoScroll] = useState(false) // This state is used only for fixing one bug in the flow.
    // When the auto scrolling happening the highlighted scroll bullet (centerCardIndex) keeps on flickering, bcause of the repeated calculations.
    function autoScrollOnIdle() {
        if (!autoScroll) {
            clearTimeout(autoScrollIntervalRef.current)
        }
        if (centerCard !== null && autoScroll && autoScrollDelay && pageVisible) {
            autoScrollIntervalRef.current = setTimeout(() => {
                let nextCard = centerCard + 1
                if (nextCard > rawData.length) nextCard = 0
                scrollRealCardToCenter(nextCard, nextCard === 0)
                explicitSwappingOfCards()
            }, autoScrollDelay)
        }
        return () => {
            clearTimeout(autoScrollIntervalRef.current)
        }
    }

    /** Triggers a timeout after which it will scroll the almost middle card to exact center */
    function anchorToCenter() {
        clearTimeout(scrollActivityTimer.current)
        setAutoScroll(false)
        scrollActivityTimer.current = setTimeout(() => {
            const middleCard = findCardAtmiddle()
            scrollToCenter(middleCard)
            setAutoScroll(true)
        }, anchorDelay)
    }

    function onScrolling() {
        if (eventLitnerHold.current) return
        swappingEdges()
        if (anchor === 'center') {
            anchorToCenter()
        }
    }

    /** This function checks & return true if the movement corresponding to event (e) happened in the diretion provided by the (axis)*/
    function checkMovementAxis(e, axis) {
        const differenceBuffer = 0
        const xDiff = Math.abs(e.deltaX)
        const yDiff = Math.abs(e.deltaY)
        if (axis === 'x' && yDiff  - xDiff > differenceBuffer) return true // Permitting scroll if carousal axis is x and the scroll movement is in y direction
        else if (axis === 'y' && xDiff  - yDiff > differenceBuffer) return true // Permitting scroll if carousal axis is y and the scroll movement is in x direction
        return false
    }

    function onWheelMove(e) {
        if (!trackpadScrolling && checkMovementAxis(e, axis.main)) {
            // Preventing scroll of trackpadScrolling is disabled from config & the current scroll occured in the direction fo the carousal.
            return false;
        }
        e.preventDefault()
        return false;
    }

      /** Scrolling first card in input data to start ignoring the preceeding cards */
      function initialScroll() {
        scrollRealCardToCenter(0, true)
    }


    function handleInfiniteScrolling() {
        const { windowRef } = getRefs()
        windowRef.current.addEventListener('mousewheel', onWheelMove) // For preventing scroll w.r.t to the config.
        if (!infiniteScrolling || !widths.child[axis.mainProperty]) return // This controller is not applicabel for rails with no infinite scrolling
        initialScroll() // Scrolling the card to middle initially
        windowRef.current.addEventListener('scroll', onScrolling)
        return () => {
            windowRef.current.removeEventListener('scroll', onScrolling)
            windowRef.current.removeEventListener('mousewheel', onWheelMove)
        }
    }

    /** Scroll the scroller element in DOM when any scroll handler is clicked
     * @param {('right' | 'left')} direction - **left** OR **right**
     */
     const lastClickHandledTime = useRef(null)
     const clickDelay = 600
     /** Function to be triggered when user clicks on the scroll handler */
     function handlerScroll(direction) {
        explicitSwappingOfCards()
        const currentTime = new Date().getTime()
        if (currentTime < lastClickHandledTime.current + clickDelay) return;
        lastClickHandledTime.current =  new Date().getTime()
         const { windowRef } = getRefs()
        let scrollWidth = Math.floor(handleScrollCount * widths.child[axis.mainProperty]);
        if (anchor === 'center') { // if anchor to center enebaled , then the scroll width = width of a single child
            scrollWidth = widths.child[axis.mainProperty]
        }
        const currentScroll = windowRef.current[`${axis.mainStart === 'left' ? 'scrollLeft' : 'scollTop'}`] 
        let newScroll = null
        if(direction === 'left') {
            if(centerCard === -1 && infiniteScrolling) {
                // If its last card resetting scroll tp the first card
                scrollRealCardToCenter(rawData.length - 1, true);
                return;
            } else {
                if (anchor === 'center') {
                    newScroll = currentScroll - scrollWidth
                } else {
                    // let currentFullScroll = Math.floor((currentScroll + (widths.window[axis.mainProperty]*3/4)) / scrollWidth)
                    let currentFullScroll = Math.floor((Math.ceil(currentScroll)) / scrollWidth)
                    newScroll = (currentFullScroll - 1) * scrollWidth
                }
            }
        } else if (direction ==='right') {
            if(centerCard === rawData.length && infiniteScrolling) {
                // If its last card resetting scroll tp the first card
                scrollRealCardToCenter(0, true);
                return;
            } else {
                // let currentFullScroll = Math.floor((currentScroll + (widths.window[axis.mainProperty]/4)) / scrollWidth)
                let currentFullScroll = Math.floor((Math.ceil(currentScroll)) / scrollWidth)
                if (anchor === 'center') {
                    newScroll = currentScroll + scrollWidth
                } else {
                    newScroll = (currentFullScroll + 1) * scrollWidth
                }
            } 
        }
        
        if (isNaN(newScroll)) return
        windowRef.current.scroll({
            left: newScroll,
            behavior: 'smooth'
        })
    }

    /** This function stops auto scrolling when the tab moves out of focus &
     * It wll resume the auto-scrolling once the tab is back in focus.
     */
    function handleVisibility() {
        function onVisibiliyChange() {
            setPageVisible(!document.hidden) 
        }
        window.addEventListener("visibilitychange", onVisibiliyChange)
        return () => window.removeEventListener('visibilitychange', onVisibiliyChange)
    }

    useEffect(handleVisibility, [])
    useEffect(handleInfiniteScrolling ,[widths])
    useEffect(autoScrollOnIdle, [centerCard, autoScroll, autoScrollDelay, pageVisible])

    return {
        scrollRealCardToCenter,
        handlerScroll,
        updateCenterCardState
    }
}

export default useInfiniteScrolling;