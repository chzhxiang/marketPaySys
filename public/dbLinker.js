
exports.dbLinker = (options,cb) => {
    let sqlstr;
    switch (options.erpType) {
        case 'gj':
            sqlstr = "select * from dbo.ptype where ptypeid in (select PTypeId from dbo.xw_PtypeBarCode where BarCode="+options.barCode+")";
            cb (sqlstr)
            break;
        case 'orthers':
            break;
        default:
            break;
    }
}