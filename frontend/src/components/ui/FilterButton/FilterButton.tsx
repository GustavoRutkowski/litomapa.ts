import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './FilterButton.module.scss';

export type FilterOption<T extends string> = {
    value: T;
    label: string;
    icon: IconDefinition;
};

interface FilterButtonProps<T extends string> {
    option: FilterOption<T>;
    active: boolean;
    onClick: () => void;
}

export function FilterButton<T extends string>({ option, active, onClick }: FilterButtonProps<T>) {
    return (
        <button
            type="button"
            className={[styles.filterButton, active ? styles.filterButtonActive : '']
                .filter(Boolean)
                .join(' ')}
            aria-pressed={active}
            onClick={onClick}
        >
            <span className={styles.icon} aria-hidden="true">
                <FontAwesomeIcon icon={option.icon} />
            </span>
            <span>{option.label}</span>
        </button>
    );
}

interface FilterButtonListProps<T extends string> {
    options: readonly FilterOption<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
}

export function FilterButtonList<T extends string>({
    options,
    value,
    onChange,
    className
}: FilterButtonListProps<T>) {
    const containerClassName = [styles.filterButtonList, className].filter(Boolean).join(' ');

    return (
        <div className={containerClassName}>
            {options.map(option => (
                <FilterButton
                    key={option.value}
                    option={option}
                    active={value === option.value}
                    onClick={() => onChange(option.value)}
                />
            ))}
        </div>
    );
}
