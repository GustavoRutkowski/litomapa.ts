import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

import styles from './ThreadVote.module.scss';
import { ThreadVoteType } from '../../../../services/threads.service';
import useThreads from '../../../../hooks/useThreads';

interface IProps {
    threadId: number;
    upvotes: number;
    myVote: ThreadVoteType | null;
}

export default function ThreadVote({ threadId, upvotes, myVote }: IProps) {
    const { vote, removeVote } = useThreads();
    const [score, setScore] = useState(upvotes);
    const [selectedVote, setSelectedVote] = useState<ThreadVoteType | null>(myVote);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setScore(upvotes);
        setSelectedVote(myVote);
    }, [myVote, upvotes]);

    const handleVote = async (type: ThreadVoteType) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            if (selectedVote === type) {
                await removeVote(threadId);
                const cancelDelta = type === 'upvote' ? -1 : 1;
                setScore(current => current + cancelDelta);
                setSelectedVote(null);
            } else {
                await vote(threadId, type);
                const voteDelta =
                    selectedVote === null
                        ? type === 'upvote'
                            ? 1
                            : -1
                        : type === 'upvote'
                          ? 2
                          : -2;
                setScore(current => current + voteDelta);
                setSelectedVote(type);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <aside className={styles.container}>
            <button
                type="button"
                aria-label="Upvote"
                aria-pressed={selectedVote === 'upvote'}
                disabled={isSubmitting}
                onClick={event => {
                    event.stopPropagation();
                    void handleVote('upvote');
                }}
                className={selectedVote === 'upvote' ? styles.selected : undefined}
            >
                <FontAwesomeIcon icon={faChevronUp} />
            </button>

            <span>{score}</span>

            <button
                type="button"
                aria-label="Downvote"
                aria-pressed={selectedVote === 'downvote'}
                disabled={isSubmitting}
                onClick={event => {
                    event.stopPropagation();
                    void handleVote('downvote');
                }}
                className={selectedVote === 'downvote' ? styles.selected : undefined}
            >
                <FontAwesomeIcon icon={faChevronDown} />
            </button>
        </aside>
    );
}
