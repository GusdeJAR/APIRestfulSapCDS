namespace inv;


type DetailRowReg : {
    CURRENT : Boolean;
    REGDATE : DateTime;
    REGTIME : DateTime; 
    REGUSER : String;
};

type DetailRow : {
    ACTIVED        : Boolean;
    DELETED        : Boolean;
    DETAIL_ROW_REG : array of DetailRowReg;
};

type StrategyRule : {
    INDICATOR : String;
    PERIOD    : Integer;
    CONDITION : String;
    ACTION    : String;
};

// Entidades
entity Simulation {
    key idSimulation       : String;
        idUser             : String;
        idStrategy         : String;
        simulationName     : String;
        symbol             : String;
        startDate          : Date;
        endDate            : Date;
        amount             : Decimal(10,2);
        specs              : String;
        result             : Decimal(10,2);
        percentageReturn   : Decimal(5,2);
        signals            : array of Signal;
        DETAIL_ROW         : array of DetailRow;
}

type Signal {
    date        : DateTime;
    type        : String;
    price       : Decimal(10,2);
    reasoning   : String;
}

entity strategies {
    key ID          : String;
        NAME        : String;
        DESCRIPTION : String;
        RULES       : array of StrategyRule;
        DETAIL_ROW  : array of DetailRow;
}

entity company {
    key SYMBOL                   : String;
        NAME                     : String;
        SECTOR                   : String;
        INDUSTRY                 : String;
        DESCRIPTION              : String;
        COUNTRY                  : String;
        CURRENCY                 : String;
        ADDRESS                  : String;
        ASSET_TYPE               : String;
        MARKET_CAP               : Decimal(20,0);
        EPS                      : Decimal(10,4);
        PE_RATIO                 : Decimal(10,4);
        PEG_RATIO                : Decimal(10,4);
        DIVIDEND_YIELD           : Decimal(10,4);
        DIVIDEND_PER_SHARE       : Decimal(10,4);
        EX_DIVIDEND_DATE         : Date;
        DIVIDEND_DATE            : Date;
        FISCAL_YEAR_END          : String;
        BOOK_VALUE               : Decimal(10,4);
        BETA                     : Decimal(10,4);
        PROFIT_MARGIN            : Decimal(10,4);
        OPERATING_MARGIN_TTM     : Decimal(10,4);
        RETURN_ON_ASSETS_TTM     : Decimal(10,4);
        RETURN_ON_EQUITY_TTM     : Decimal(10,4);
        REVENUE_TTM              : Decimal(20,0);
        GROSS_PROFIT_TTM         : Decimal(20,0);
        REVENUE_PER_SHARE_TTM    : Decimal(10,4);
        SHARES_OUTSTANDING       : Decimal(20,0);
        EBITDA                   : Decimal(20,0);
        LATEST_QUARTER           : Date;
        TRAILING_PE              : Decimal(10,4);
        FORWARD_PE               : Decimal(10,4);
        PRICE_TO_BOOK            : Decimal(10,4);
        PRICE_TO_SALES_TTM       : Decimal(10,4);
        QUARTERLY_EARNINGS_YOY   : Decimal(10,4);
        QUARTERLY_REVENUE_YOY    : Decimal(10,4);
        ANALYST_TARGET_PRICE     : Decimal(10,2);
        ANALYST_BUY              : Integer;
        ANALYST_HOLD             : Integer;
        ANALYST_SELL             : Integer;
        ANALYST_STRONG_BUY       : Integer;
        ANALYST_STRONG_SELL      : Integer;
        MOVING_AVERAGE_50D       : Decimal(10,2);
        MOVING_AVERAGE_200D      : Decimal(10,2);
        WEEK_52_HIGH             : Decimal(10,2);
        WEEK_52_LOW              : Decimal(10,2);
        OFFICIAL_SITE            : String;
}

entity Indicators{
        SYMBOL               : String;
        INDICATOR            : String;
        INTERVAL             : String;
        TIMEZONE             : String;
        DATA : array of {
            DATE : String;
            VALUE: String;
        }; 
}

