import PageCard from "@components/PageCard";
import HistoryRecord from "./HistoryRecord";
import { COLOR } from "@utils/theme/constants";
import { useUpdateAtom } from "jotai/utils";
// import { HistoryTypeAtom } from "@atoms/record";

export default function History() {
    return (
        <PageCard
            mx='auto'
            title='History'
            color={COLOR.text}
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