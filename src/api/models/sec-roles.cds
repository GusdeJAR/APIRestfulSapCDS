namespace secRoles;

entity Roles {
    key ROLEID      : String;
        ROLENAME    : String;
        DESCRIPTION : String;
        PRIVILEGES  : array of {
            PROCESSID   : String;
            PRIVILEGEID : array of String;
        };
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
}
