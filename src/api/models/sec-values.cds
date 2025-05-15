namespace secValues;

entity values {
        COMPANYID   : Integer;
        CEDIID      : Integer;
        LABELID     : String;
        VALUEPAID   : String;
    key VALUEID     : String;
        VALUE       : String;
        ALIAS       : String;
        SEQUENCE    : Integer;
        IMAGE       : String;
        VALUESAPID  : String;
        DESCRIPTION : String;
        ROUTE       : String;
        DETAIL_ROW  : array of {
            ACTIVED        : Boolean;
            DELETED        : Boolean;
            DETAIL_ROW_REG : array of {
                CURRENT : Boolean;
                REGDATE : DateTime;
                REGTIME : DateTime;
                REGUSER : String;
            }
        }
};
