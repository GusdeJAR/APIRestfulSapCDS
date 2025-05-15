// 1. Import the data model
// using {inv as myph} from '../models/inv-priceshistory';

using {inv as myinv} from '../models/inv-inversions';

// 2. Import the controller to implement the Logic

@impl: 'src/api/controllers/inv-inversions-controller.js'

// 3. Define the method to expose the routes
// for all APIs of prices history

service PricesHistoryRouter @(path: '/api/inv') {

    // 4. Instance the prices history entity
    //entity priceshistory as projection on myph.priceshistory;
    entity entstrategies as projection on myinv.strategies;
    entity entsimulation as projection on myinv.Simulation;
    entity entcompany    as projection on myinv.company;
    entity entindicators as projection on myinv.Indicators;

    // 5. Define the route for API Get All Prices History
    // Important: Don't forget that function name must be the same as the path

    //Crud para simulaciones
    @Core.Description: 'crud-simulation'
    @path            : 'crudSimulation'
    action crudSimulation(simulation : entsimulation) returns array of entsimulation;

    //Crud para strategies
    @Core.Description: 'crud-strategies'
    @path            : 'crudStrategies'
    action crudStrategies(strategy : entstrategies)   returns array of entstrategies;

    //GET para company
    @path: 'company'
    action company(company : entcompany)              returns array of entcompany;

    //GET para strategies
    @path: 'strategy'
    action strategy(strategy : entstrategies)       returns array of entstrategies;

    @path: 'indicators'
    action indicators(indicator : entindicators)     returns array of entindicators;

    //GET para strategies
    @path: 'priceshistory'
    function priceshistory(strategy : entstrategies)       returns array of entstrategies;

};
