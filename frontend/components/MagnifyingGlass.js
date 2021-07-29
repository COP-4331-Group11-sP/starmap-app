import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
    return (
        <Svg
            width={60}
            height={60}
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M27.188 46.875c10.873 0 19.687-8.814 19.687-19.688 0-10.873-8.814-19.687-19.688-19.687C16.315 7.5 7.5 16.314 7.5 27.188c0 10.873 8.814 19.687 19.688 19.687zM41.108 41.11l11.39 11.39"
                stroke="#D8E3E1"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export default SvgComponent