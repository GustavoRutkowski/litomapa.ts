export type SpecieGroup =
    | 'dolphin'
    | 'turtle'
    | 'fish'
    | 'shark'
    | 'jellyfish'
    | 'ray'
    | 'whale'
    | 'seal'
    | 'crustacean'
    | 'mollusk';

type Specie = {
    id: number;
    name: string;
    scientific_name: string;
    group: SpecieGroup;
};

export default Specie;
