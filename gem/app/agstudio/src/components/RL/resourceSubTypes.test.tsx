import resourceSubTypes from "./resourceSubTypes";

// fertilizer: 257
// chemical: 258
// manure: 260
// seed: 264
// commodity: 272
// amendment: 288
// product mix: 384
// unknown: 0 || undefined

describe('resourceSubTypes', () => {

    test('should return "fertilizer" string when resourceSubType passed as argument', () => {
        expect(resourceSubTypes(257).toLowerCase()).toEqual('fertilizer');
    });

    test('should return "chemical" string when resourceSubType passed as argument', () => {
        expect(resourceSubTypes(258).toLowerCase()).toEqual('chemical');
    });

    test('should return "manure" string when resourceSubType passed as argument', () => {
        expect(resourceSubTypes(260).toLowerCase()).toEqual('manure');
    });

    test('should return "seed" string when resourceSubType passed as argument', () => {
        expect(resourceSubTypes(264).toLowerCase()).toEqual('seed');
    });

    test('should return "commodity" string when resourceSubType passed as argument', () => {
        expect(resourceSubTypes(272).toLowerCase()).toEqual('commodity');
    });

    test('should return "amendment" string when resourceSubType passed as argument', () => {
        expect(resourceSubTypes(288).toLowerCase()).toEqual('amendment');
    });

    test('should return "product mix" string when resourceSubType passed as argument', () => {
        expect(resourceSubTypes(384).toLowerCase()).toEqual('product mix');
    });
});
