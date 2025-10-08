import { FC } from "react"
import { Page } from "@/components/Page"
import { TarotStage, Arc, Card } from "@/components/tarot/tarot-wheel"


export const TarotPage: FC = () => {
    return (
    <Page>
        <TarotStage>
            <Arc arcDegrees={120} radius={300} maxRotation={60} showDebugLines={true}>
                {Array.from({ length: 78 }).map((_, i) => (
                    <Card key={i} width={70} height={140} />
                ))}
            </Arc>
        </TarotStage>
    </Page>
    )
}