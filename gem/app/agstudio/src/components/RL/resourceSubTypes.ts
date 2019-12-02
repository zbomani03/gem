interface ISubTypes {
    id: number;
    name: string;
}

const subTypes: ISubTypes[] = [
    {id: 257, name: 'Fertilizer'},
    {id: 258, name: 'Chemical'},
    {id: 260, name: 'Manure'},
    {id: 264, name: 'Seed'},
    {id: 272, name: 'Commodity'},
    {id: 288, name: 'Amendment'},
    {id: 384, name: 'Product Mix'}
];

const resourceSubTypes = (subType: number): string => {
    if (subTypes.some(s => s.id === subType)) {
        return subTypes.filter(s => s.id === subType)[0].name;
    }
    return "ERROR!";
};

const requiresCrop = (subType: number): boolean => subType === 264 || subType === 272;

const hasGlobalSearch = (subType: number): boolean => subType !== 260 && subType !== 272 && subType !== 384;

export default resourceSubTypes;
export {subTypes, requiresCrop, hasGlobalSearch};
