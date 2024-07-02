import { useInterval } from "../CustomHooks"

interface TimerProps {
    time: number,
    shouldTick: boolean
    tick: () => void
}

export const Timer = (props: TimerProps) => {

    useInterval(props.tick, props.shouldTick ? 1000 : null)

    return <>
        <h2>{props.time}</h2>
    </>
}