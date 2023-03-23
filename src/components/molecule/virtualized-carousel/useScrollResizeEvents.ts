// @ts-nocheck
import { useEffect, useRef } from "react";

 const useScrollResizeEvents=(props) => {
    const { getRefs, setRenderArray, axis, widths, windowBuffer, data, renderArray, updateAllSizeProperties, updateCenterCardState } = props;
    
    const prevCard = useRef(null)
    /** Update renderArray based on what all elements are partially/fully visible to the user.
    */
    const updateRenderedChild = () => {
            const { scrollerRef } = getRefs()
            const currentScroll = Math.abs(scrollerRef.current.getBoundingClientRect()[axis.main] -  widths.window.starting)
            const currentStart = currentScroll - windowBuffer
            const currentEnd = currentScroll + widths.window[axis.mainProperty] + windowBuffer
            let startingChild = Math.floor(currentStart/widths.child[axis.mainProperty])
            if(startingChild < 0) startingChild = 0
            let endingChild = Math.floor((currentEnd + widths.child[axis.mainProperty])/widths.child[axis.mainProperty])
            if (endingChild > data.length - 1) endingChild = data.length - 1
            let newRenderArray = Array.from({length: endingChild - startingChild + 1}, (_, i) => i + startingChild)
            const elementsToBeRendered = newRenderArray.filter((i) => !renderArray.includes(i)) // Elements that are 'inside new array' but 'not in the previous one'.
            const elementsToBeRemoved = renderArray.filter((i) => !newRenderArray.includes(i)) // Elements that are 'inside the old one' but 'not in the new one'.
            newRenderArray = renderArray.map((v,i) => elementsToBeRendered.includes(i) ? i : (elementsToBeRemoved.includes(i) ? null : v)) // Framing the new renderArray.
            if (JSON.stringify(newRenderArray) === JSON.stringify(renderArray)) return // If previous render array is same as the new -> Do nothing!.
            setRenderArray(newRenderArray) 
            /* Updated centercard states, that is used by the scrollBullets */
            if(widths.child.width) {
                const card = Math.floor((currentScroll + widths.window.width/2) / widths.child.width)
                if (prevCard.current !== card) {
                    prevCard.current = card;
                    updateCenterCardState(card)
                }
            }
    }

    /** Aactions to be executed when the window is resized. */
    const handleResize = () => {
        updateAllSizeProperties();
        updateRenderedChild()
    }
    
    const onScroll = () => {
        updateRenderedChild()
        const { windowRef } = getRefs()
        windowRef.current.addEventListener('scroll', updateRenderedChild)
        window.addEventListener('resize', handleResize)
        return () => {
            windowRef.current.removeEventListener('scroll', updateRenderedChild)
            window.removeEventListener('resize', handleResize)
        }
    }
    useEffect(onScroll,[widths, data, renderArray])

    return { updateRenderedChild }

}

export default useScrollResizeEvents;