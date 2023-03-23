// @ts-nocheck
const Utils = (params) => {
    const { getRefs, widths, setWidths, axis, getStates } = params
    
    const getDimention = (element , property = 'width') => element && element.getBoundingClientRect()[property]
    const getNthChildDimention = (parentElement, property = 'width', n = 0) => parentElement && getDimention(parentElement?.children?.[n], property)
    
    /** Calculate all width and height of window, scroller and children */
    const updateAllSizeProperties = () => {
        const { scrollerRef, windowRef } = getRefs()
        const { data } = getStates()
        window.ss = scrollerRef.current
        const _return =  {
            window: { 
                width: getDimention(windowRef.current, 'width'),
                height: getDimention(windowRef.current, 'height'), 
                starting: getDimention(windowRef.current, axis.main)
            },
            child: {
                width: getNthChildDimention(scrollerRef.current, 'width', 1),
                height: getNthChildDimention(scrollerRef.current, 'height', 1),
            },
        }
        scrollerRef.current.style[axis.crossProperty] =  _return.child[axis.crossProperty] + 'px' // Setting crossAxisProperty of the Scroller
        scrollerRef.current.style[axis.mainProperty] =  _return.child[axis.mainProperty] * data.length  + 'px' // Setting crossAxisProperty of the Scroller
        _return.scroller = {
            width: getDimention(scrollerRef.current, 'width'),
            height: getDimention(scrollerRef.current, 'height'),
        }
        if(JSON.stringify(widths) === JSON.stringify(_return)) return
        setWidths(_return) // Setting widths STATE
    }

    /** Returns the left & top values for each side based on its index */
    const getPositionStyle = (index) => {
        const { widths } = getStates()
        const ps = {}
        ps[axis.mainStart] = index * widths.child[axis.mainProperty] + 'px'
        return ps
    }

    const getCustomizedClassNames = (className, variable, pureClass) => {
        /* This function can be used when you need to customize a classname by adding an extra value to it 
            Case 1: getCustomizedClassNames('black_thick_heading', 'homepage')
            Output : black_thick_heading_homepage
          
            Case 2: getCustomizedClassNames('black_thick_heading', ['homepage', 'footer'])
            Output : black_thick_heading_homepage black_thick_heading_footer
      
            An optional third parameter (true/flase), corresponds to whether include the original className in the returned customized class name
            
            Case 3: getCustomizedClassNames('black_thick_heading', 'homepage', true)
            Output: black_thick_heading black_thick_heading_homepage
      
            Case 4: getCustomizedClassNames('black_thick_heading', ['homepage', 'footer'], true)
            Output : black_thick_heading black_thick_heading_homepage black_thick_heading_footer
      
            Case 5:  getCustomizedClassNames('black_thick_heading') (No Need to use this function at all. )
            Output: black_thick_heading
      
        */
        const pureClassName = pureClass ? className + ' ' : ''
        if (typeof variable === 'string') return pureClassName + className + '_' + variable
        else if (typeof variable === 'object')return pureClassName + variable.reduce((acc, v) => acc + ' ' + className + '_' + v, '')
        return className
      }
      /* --------------------------------------------- */

    return {
        updateAllSizeProperties,
        getPositionStyle,
        getCustomizedClassNames,
    }
}

export default Utils;