import {
    IDimensionObject,
    IStatsObject,
    ITreatmentObject,
} from "../models/warehouseAPIService";

const fixStatsObject = (stats: IStatsObject):IStatsObject => {
    let fixedStats = {
        TotalYield: 0,
        SumX: 0,
        SumX2: 0,
        Min: 0,
        Max: 0,
        NumberOfCropZones: 0,
        NumberOfAcres: 0,
        Mean: 0,
        StdDev: 0,
        HighMid: 0,
        LowMid: 0
    };
    for (let property in stats) {
        if (stats[property]) {
            fixedStats[property] = stats[property];
        }
    }
    return fixedStats;
};

export const fixDimensionObject = (dimension: IDimensionObject):IDimensionObject => {
    let fixedDimension = Object.assign({}, dimension);
    fixedDimension.CropZoneAcres = dimension.CropZoneAcres || 0;
    fixedDimension.CropZoneCount = dimension.CropZoneCount || 0;
    return fixedDimension;
};

export const fixTreatmentObject = (treatmentResults: ITreatmentObject):ITreatmentObject => {
    treatmentResults.Dimension = fixDimensionObject(treatmentResults.Dimension);
    treatmentResults.Results = treatmentResults.Results.map(r => {
        r.Stats = fixStatsObject(r.Stats);
        if (r.ChildResults) {
            r.ChildResults = fixTreatmentObject(r.ChildResults);
        }
        return r;
    });
    return treatmentResults;
};
