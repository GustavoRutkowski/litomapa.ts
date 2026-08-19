export default function calculateRelevance(
    createdAt: Date,
    upvotes: number,
    messages: number
): number {
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;

    const AGE_HOURS = (Date.now() - createdAt.getTime()) / HOUR;

    const VOTE_SCORE = Math.log2(1 + upvotes);
    const MESSAGE_SCORE = Math.log2(1 + messages);

    const FRESHNESS_SCORE = Math.pow(2, -AGE_HOURS / 24);

    const VOTE_SCORE_WEIGHT = 0.45;
    const MESSAGE_SCORE_WEIGHT = 0.3;
    const FRESHNESS_SCORE_WEIGHT = 0.25;

    return (
        VOTE_SCORE_WEIGHT * VOTE_SCORE +
        MESSAGE_SCORE_WEIGHT * MESSAGE_SCORE +
        FRESHNESS_SCORE_WEIGHT * FRESHNESS_SCORE
    );
}
