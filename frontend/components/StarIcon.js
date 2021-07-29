import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
    return (
        <Svg
            width={35}
            height={36.71}
            viewBox="0 0 43 41"
            fill="gold"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M21.5 1.618l4.576 14.084.112.345H41.36l-11.98 8.704-.294.214.112.345 4.576 14.084-11.98-8.704-.294-.214-.294.214-11.98 8.704 4.576-14.084.112-.345-.294-.214-11.98-8.704h15.172l.112-.345L21.5 1.618z"
                stroke="#000"
            />
        </Svg>
    )
}

export default SvgComponent
