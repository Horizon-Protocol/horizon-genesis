import PageCard from "@components/PageCard";
import HistoryRecord from "./HistoryRecord";
import { useUpdateAtom } from "jotai/utils";
// import { HistoryTypeAtom } from "@atoms/record";

export default function History() {

    // const [historyType, setHistoryType] = useAtom(HistoryTypeAtom)
    // const updateHistoryType = useUpdateAtom(HistoryTypeAtom)
    // const update

    return (
        <PageCard
            mx='auto'
            // color={THEME_COLOR}
            // headerBg={headerBg}
            title='History'
            description={
                <>
                    View and sort all your previous transactions<br />on Horizon Genesis.
                </>
            }
        >
            <HistoryRecord />
        </PageCard>
    )
}