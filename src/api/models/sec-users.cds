namespace sec;

entity users {
    key USERID         : String;
        USERNAME       : String;
        ALIAS          : String;
        FIRSTNAME      : String;
        LASTNAME       : String;
        BIRTHDAYDATE   : String; // Formato "DD.MM.YYYY"
        COMPANYID      : Integer;
        COMPANYNAME    : String;
        COMPANYALIAS   : String;
        CEDIID         : String;
        EMPLOYEEID     : String;
        EMAIL          : String;
        PHONENUMBER    : String;
        EXTENSION      : String;
        DEPARTMENT     : String;
        FUNCTION       : String;
        STREET         : String;
        POSTALCODE     : Integer;
        CITY           : String;
        REGION         : String;
        STATE          : String;
        COUNTRY        : String;
        ROLES          : array of {
            ROLEID    : String;
            ROLEIDSAP : String;
        };
        DETAIL_ROW_REG : array of {
            CURRENT : Boolean;
            REGDATE : DateTime;
            REGTIME : DateTime;
            REGUSER : String;
        }
}
