var fs = require('fs');
var path = require('path');
module.exports = class extends think.cmswing.home {

    async applyAction(){
        const data = this.post();
        const user_id = data.user_id;
        const applydata = await this.model('cmswing/business').applyQueryByUser(user_id);
        if (think.isEmpty(applydata)){
            return this.success({code:200,staus:0});
        }else{
            return this.success({code:200,staus:1});
        }
    }

    async applysubmitAction() {
        if (this.isPost) {
            const data = this.post();
            //企业全称
            if (think.isNullOrUndefined(data.biz_name)){
                var biz_name = '';
            }else{
                var biz_name = data.biz_name;
            }
            //注册用户的id
            let user_id = data.user_id;
            //企业类型。生产企业:0,经销商:1
            if (think.isNullOrUndefined(data.biz_type)){
                var biz_type = 1;
            }else{
                if (think.isInt(data.biz_type)){
                    var biz_type = data.biz_type;
                }else{
                    var biz_type = 1;
                }
            }
            //企业地址
            if (think.isNullOrUndefined(data.address)){
                var address = '';
            }else{
                var address = data.address;
            }
            //店铺全称
            if (think.isNullOrUndefined(data.store_name)){
                var store_name = '';
            }else{
                var store_name = data.store_name;
            }
            //店铺类型。旗舰店:0,专卖店:1,专营店:2
            if (think.isNullOrUndefined(data.store_type)){
                var store_type = 1;
            }else{
                if (think.isInt(data.store_type)){
                    var store_type = data.store_type;
                }else{
                    var store_type = 1;
                }
            }
            //店铺负责人姓名
            if (think.isNullOrUndefined(data.store_manager)){
                var store_manager = '';
            }else{
                var store_manager = data.store_manager;
            }
            //店铺负责人电话
            if (think.isNullOrUndefined(data.manager_phone)){
                var manager_phone = '';
            }else{
                var manager_phone = data.manager_phone;
            }
            //店铺负责人邮箱
            if (think.isNullOrUndefined(data.manager_email)){
                var manager_email = '';
            }else{
                var manager_email = data.manager_email;
            }
            //商户状态。待审核(提交):0,一审通过:10,一审驳回:11,二审通过:20,二审驳回:21,超时:30,重新提交:1,创建:2
            let status = 0;
            //联系方式
            if (think.isNullOrUndefined(data.contact)){
                var contact = '';
            }else{
                var contact = data.contact;
            }
            //企业介绍
            if (think.isNullOrUndefined(data.introduction)){
                var introduction = '';
            }else{
                var introduction = data.introduction;

            }
            //企业经营范围
            if (think.isNullOrUndefined(data.biz_scope)){
                var biz_scope = '';
            }else{
                var biz_scope = data.biz_scope;
            }
            //企业经营方式
            if (think.isNullOrUndefined(data.biz_prac)){
                var biz_prac = '';
            }else{
                var biz_prac = data.biz_prac;
            }
            //到期日期
            if (think.isNullOrUndefined(data.expire_date)){
                var expire_date = 1;
            }else{
                var expire_date = new Date(data.expire_date).valueOf();
            }
            //企业log路径
            if (think.isNullOrUndefined(data.logo)){
                var logo = '';
            }else{
                var logo = data.logo;
            }
            //企业营业执照路径
            if (think.isNullOrUndefined(data.license)){
                var license = '';
            }else{
                var license = data.license;
            }
            //银行开户许可证路径
            if (think.isNullOrUndefined(data.account)){
                var account = '';
            }else{
                var account = data.account;
            }
            //医疗器械生产许可证路径
            if (think.isNullOrUndefined(data.prod_cert)){
                var prod_cert = '';
            }else{
                var prod_cert = data.prod_cert;
            }
            //生产备案凭证路径
            if (think.isNullOrUndefined(data.registration)){
                var registration = '';
            }else{
                var registration = data.registration;
            }
            //网络销售许可证路径
            if (think.isNullOrUndefined(data.online_sales)){
                var online_sales = '';
            }else{
                var online_sales = data.online_sales;
            }
            //法人身份证复印件正面路径
            if (think.isNullOrUndefined(data.legal_person_front)){
                var legal_person_front = '';
            }else{
                var legal_person_front = data.legal_person_front;
            }
            //法人身份证复印件背面路径
            if (think.isNullOrUndefined(data.legal_person_back)){
                var legal_person_back = '';
            }else{
                var legal_person_back = data.legal_person_back;
            }
            /**
             * 原同步提交文件，现改为异步调教，暂做备份，确定后再删除
             //企业log路径
             var logofile = this.file('logo');
             if (think.isUndefined(logofile)){
                var logo = '';
            }else{
                if (logofile.name == ''){
                    var logo = '';
                }else{
                    var logo = await this.saveFile(logofile,'test','yes','static/upload');
                }
            }
             //企业营业执照路径
             var licensefile = this.file('license');
             if (think.isUndefined(licensefile)){
                var license = '';
            }else{
                if (licensefile.name == ''){
                    var license = '';
                }else{
                    var license = await this.saveFile(licensefile,'test','yes','static/upload');
                }
            }
             //银行开户许可证路径
             var accountfile = this.file('account');
             if (think.isUndefined(accountfile)){
                var account = '';
            }else{
                if (accountfile.name == ''){
                    var account = '';
                }else{
                    var account = await this.saveFile(accountfile,'test','yes','static/upload');
                }
            }
             //医疗器械生产许可证路径
             var prod_certfile = this.file('prod_cert');
             if (think.isUndefined(prod_certfile)){
                var prod_cert = '';
            }else{
                if (prod_certfile.name == ''){
                    var prod_cert = '';
                }else{
                    var prod_cert = await this.saveFile(prod_certfile,'test','yes','static/upload');
                }
            }
             //生产备案凭证路径
             var registrationfile = this.file('registration');
             if (think.isUndefined(registrationfile)){
                var registration = '';
            }else{
                if (registrationfile.name == ''){
                    var registration = '';
                }else{
                    var registration = await this.saveFile(registrationfile,'test','yes','static/upload');
                }
            }
             //网络销售许可证路径
             var online_salesfile = this.file('online_sales');
             if (think.isUndefined(online_salesfile)){
                var online_sales = '';
            }else{
                if (online_salesfile.name == ''){
                    var online_sales = '';
                }else{
                    var online_sales = await this.saveFile(online_salesfile,'test','yes','static/upload');
                }
            }
             //法人身份证复印件正面路径
             var legal_person_forntfile = this.file('legal_person_fornt');
             if (think.isUndefined(legal_person_forntfile)){
                var legal_person_fornt = '';
            }else{
                if (legal_person_forntfile.name == ''){
                    var legal_person_fornt = '';
                }else{
                    var legal_person_fornt = await this.saveFile(legal_person_forntfile,'test','yes','static/upload');
                }
            }
             //法人身份证复印件背面路径
             var legal_person_backfile = this.file('legal_person_back');
             if (think.isUndefined(accountfile)){
                var legal_person_back = '';
            }else{
                if (legal_person_backfile.name == ''){
                    var legal_person_back = '';
                }else{
                    var legal_person_back = await this.saveFile(legal_person_backfile,'test','yes','static/upload');
                }
            }
             if (biz_type == 1){
                //经销商才需要上传的文件
                //销售授权委托书路径
                var market_authorfile = this.file('market_author');
                if (think.isUndefined(accountfile)){
                    var market_author = '';
                }else{
                    if (prod_certfile.name == ''){
                        var market_author = '';
                    }else{
                        var market_author = await this.saveFile(market_authorfile,'test','yes','static/upload');
                    }
                }
            }
             *
             */

            const applyData = {
                'biz_name' : biz_name,
                'user_id' : user_id,
                'biz_type' : biz_type,
                'address' : address,
                'store_name' : store_name,
                'store_type' : store_type,
                'store_manager' : store_manager,
                'manager_phone' : manager_phone,
                'manager_email' : manager_email,
                'status' : status,
                'contact' : contact,
                'introduction' : introduction,
                'biz_scope' : biz_scope,
                'biz_prac' : biz_prac,
                'expire_date' : expire_date,
                'logo' : logo,
                'first_reject' : '',
                'second_reject' : '',
                'license' : license,
                'account' : account,
                'prod_cert' : prod_cert,
                'registration' : registration,
                'online_sales' : online_sales,
                'legal_person_front' : legal_person_front,
                'legal_person_back' : legal_person_back
            };
            try {
                await this.model('cmswing/business').applyAdd(applyData);
                const applydata = await this.model('cmswing/business').applyQueryByUser(user_id);
                return this.success({code:200,applydata:applydata});
            }catch (e) {
                console.log(e);
                return this.fail({code:500});
            }
        }else{
            return this.display();
        }
    }

    async updateAction(){
        const data = this.post();
        const biz_id = data.biz_id;
        const user_id = data.user_id;
        if (!think.isNullOrUndefined(data.action_type)){
            const action_type = data.action_type;
            if (action_type == "first_pass"){
                const  condition = {
                    "id":biz_id
                };
                const  updatedata = {
                    "status":10,
                    "first_pass_user":user_id
                };
                await this.model('cmswing/business').applyUpdate(condition,updatedata);
                return this.success({code:200});
            }else if(action_type == "second_pass"){
                const  condition = {
                    "id":biz_id
                };
                const  updatedata = {
                    "status":20,
                    "second_pass_user":user_id
                };
                await this.model('cmswing/business').applyUpdate(condition,updatedata);
                return this.success({code:200});
            }else if(action_type == "first_reject"){
                if (!think.isNullOrUndefined(data.reject)){
                    var reject = data.reject;
                }else{
                    var reject = "";
                }
                const  condition = {
                    "id":biz_id
                };
                const  updatedata = {
                    "status":11,
                    "first_reject":reject
                };
                await this.model('cmswing/business').applyUpdate(condition,updatedata);
                return this.success({code:200,reject:reject});
            }else if(action_type == "second_reject"){
                if (!think.isNullOrUndefined(data.reject)){
                    var reject = data.reject;
                }else{
                    var reject = "";
                }
                const  condition = {
                    "id":biz_id
                };
                const  updatedata = {
                    "status":21,
                    "second_reject":reject
                };
                await this.model('cmswing/business').applyUpdate(condition,updatedata);
                return this.success({code:200,reject:reject});
            }else{
                return this.fail({code:500,msg:"error param"});
            }
        }
    }

    async applyDetailAction(){
        const data = this.post();
        const biz_id = data.biz_id;
        try {
            const applydata = await this.model('cmswing/business').applyQuery(biz_id);
            return this.success({code:200,applydata:applydata});
        }catch (e) {
            console.log(e);
            return this.fail({code:500});
        }
    }

    async applyQueryByUserAction(){
        const data = this.post();
        const user_id = data.user_id;
        try {
            const applydata = await this.model('cmswing/business').applyQueryByUser(user_id);
            return this.success({code:200,applydata:applydata});
        }catch (e) {
            console.log(e);
            return this.fail({code:500});
        }
    }


    async applyListAction(){
        if (think.isNullOrUndefined(this.get('page'))){
            var page = 1;
        }else{
            var page = this.get('page')
        }
        try {
            const list = await this.model('cmswing/business').applyListQuery(page);
            return this.success({code:200,list:list});
        }catch (e) {
            console.log(e);
            return this.fail({code:500});
        }
    }


    /**
     *
     * 原一审待审和二审待审的列表分开展示，改为合并展示。备份
     *
     * async applyFirstListAction(){
        if (think.isNullOrUndefined(this.get('page'))){
            var page = 1;
        }else{
            var page = this.get('page')
        }
        try {
            const list = await this.model('cmswing/business').applyFirstQuery(page);
            return this.success({code:200,list:list});
        }catch (e) {
            console.log(e);
            return this.fail({code:500});
        }
    }

     async applySecondListAction(){
        if (think.isNullOrUndefined(this.get('page'))){
            var page = 1;
        }else{
            var page = this.get('page')
        }
        try {
            const list = await this.model('cmswing/business').applySecondQuery(page);
            return this.success({code:200,list:list});
        }catch (e) {
            console.log(e);
            return this.fail({code:500});
        }
    }
     *
     */


    async pollingAction(){
        if(!this.isCli)
            return this.fail(1000, 'deny');
        await this.model('cmswing/business').expireCheck();
    }

    async uploadAction(){
        const data = this.post();
        const filetype = data.filetype
        console.log(filetype);
        const uploadfile = this.file(filetype);
        console.log(uploadfile);
        const url = await this.saveFile(uploadfile,false,filetype);
        if (url == 'fail'){
            return this.fail({code:500});
        }else{
            return this.success({code:200,url:url});
        }
        /**
         *filetype为以下值
         *
         logo
         license
         account
         prod_cert
         registration
         online_sales
         legal_person
         */
    }

    async saveFile(file, base64, filetype) {
        try {
            let filename = file.name;
            let tempPath = file.path;
            const renameFile = think.promisify(fs.rename, fs);
            const savePath = think.ROOT_PATH + '/static/upload/'+filetype;
            think.mkdir(savePath);
            const suffix = filename.split('.').pop();
            // 对文件名进行过滤
            const name = filetype + '_' + filename.split('.').shift().replace(/[\s\\\/,.*@#$%^&\|""“”：:]/gi, '');
            const newname = `${name}_${Date.now()}.${suffix}`;
            // 如果是base64 文件的话 进行转buffer保存
            if (base64) {
                base64 = base64.replace(/^data:\w+\/\w+;base64,/, '');
                const buffer = new Buffer(base64, 'base64');
                fs.writeFileSync(path.join(savePath, newname), buffer);
            } else {
                // 直接移动文件保存
                await renameFile(tempPath, path.join(savePath, newname));
            }
            // 返回文件资源链接
            return `${savePath}/${newname}`;
        }catch (e) {
            console.log(e);
            return 'fail';
        }
        
    }
};
