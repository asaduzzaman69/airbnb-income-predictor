import React, { Children } from "react"
interface StepsProps {
    value: number
}
const Steps: React.FC<StepsProps> = ({ children, value = 0 }) => {
    const childrenArr = Children.toArray(children)

    return (
        <div style={{ width: '100%', maxWidth: '390px', marginLeft: 'auto' }}>
            {
                childrenArr.map((child, i) => {
                    if (value === i) {
                        return child
                    }

                })
            }
        </div>
    )
}

export const Step: React.FC = ({ children }) => {

    return (
        <div >
            {children}
        </div>

    )
}



export default Steps;