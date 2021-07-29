import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
    return (
        <Svg
            width={30}
            height={30}
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M11.25 9.375l37.5 41.25M36.306 36.937a9.375 9.375 0 01-12.612-13.874"
                stroke="#D8E3E1"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M17.343 16.077C7.787 20.916 3.75 30 3.75 30S11.25 46.873 30 46.873a27.662 27.662 0 0012.656-2.951M48.893 39.633C54.003 35.056 56.25 30 56.25 30S48.75 13.123 30 13.123a29.373 29.373 0 00-4.847.395M31.764 20.791a9.38 9.38 0 017.57 8.327"
                stroke="#D8E3E1"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default SvgComponent
