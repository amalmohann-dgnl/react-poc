import { useLayoutEffect, useRef } from "react"


const useHandleVisibility =  (props: { getRefs: any; axis: any; widths: any; data: any; renderArray: any }) => {
    const { getRefs, axis, widths, data, renderArray } = props
    const computedStyleValues = useRef({})
    const computedStyleCache = () => computedStyleValues.current

    /** This function decides whether to show/hide handles and will udpate the UI as well. */
    function decideOnHandlevisibility() {
        const { windowRef,  leftHandleRef, rightHandleRef } = getRefs()
        const currentScroll = Math.floor(windowRef.current[`${axis.mainStart === 'left' ? 'scrollLeft' : 'scollTop'}`] )
        // @ts-ignore
        const leftBuffer =   computedStyleCache().leftBuffer || getComputedStyle(windowRef.current, 'paddingLeft')
        // @ts-ignore
        const rightBuffer = computedStyleCache().rightBuffer || getComputedStyle(windowRef.current, 'paddingRight')
        const scrollerEnd = Math.floor(widths.scroller.width - widths.window.width + leftBuffer + rightBuffer)
        const scrollerWidth = widths.scroller.width;
        const windowWidth = widths.window.width;
        computedStyleValues.current = { leftBuffer, rightBuffer, scrollerWidth, windowWidth}
        
        if (currentScroll > 10) {
            // above check should ideally be currentScroll > 0,
            // but sometime there may be a slight difference of couple of pixels hence the above condition
            leftHandleRef.current.style.display = 'flex'
        }
        if (currentScroll < 10) {
            // above check should ideally be currentScroll === 0,
            // but sometime there may be a slight difference of couple of pixels hence the above condition
            leftHandleRef.current.style.display = 'none'
        }
        if (Math.abs(currentScroll - scrollerEnd) < 10 )  { 
            // above check should ideally be currentScroll === scrollerEnd,
            // but sometime there may be a slight difference of couple of pixels hence the above condition
            rightHandleRef.current.style.display = 'none'
        }
        if (currentScroll < scrollerEnd - 10) {
            // above check should ideally be currentScroll < scrollerEnd,
            // but sometime there may be a slight difference of couple of pixels hence the above condition
            rightHandleRef.current.style.display = 'flex'
        }
        if (scrollerWidth < windowWidth) {
            leftHandleRef.current.style.display = 'none'
            rightHandleRef.current.style.display = 'none'
        }
    }
    const handleHandleVisiblity = () => {
        const { windowRef } = getRefs()
        decideOnHandlevisibility()
        windowRef.current.addEventListener('scroll', decideOnHandlevisibility)
        return () => windowRef.current.removeEventListener('scroll', decideOnHandlevisibility)
    }
    useLayoutEffect(handleHandleVisiblity,[widths, data, renderArray])   
}

function getComputedStyle(element:any, property:any) {
    return Number((window.getComputedStyle(element)?.[property] || '').replace('px', ''))
  }

export default useHandleVisibility