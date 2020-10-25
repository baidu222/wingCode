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
            let biz_name;
            let biz_type;
            let address;
            let store_name;
            let store_type;
            let store_manager;
            let manager_phone;
            let manager_email;
            let contact;
            let introduction;
            let biz_scope;
            let biz_prac;
            let expire_date;
            let logo;
            let license;
            let account;
            let prod_cert;
            let registration;
            let online_sales;
            let legal_person_front;
            let legal_person_back;
            //商户状态。待审核(提交):0,一审通过:10,一审驳回:11,二审通过:20,二审驳回:21,超时:30,重新提交:1,创建:2
            let status = 0;
            //企业全称
            if (think.isNullOrUndefined(data.biz_name)){
                biz_name = '';
            }else{
                biz_name = data.biz_name;
            }
            //注册用户的id
            let user_id = data.user_id;
            //企业类型。生产企业:0,经销商:1
            if (think.isNullOrUndefined(data.biz_type)){
                biz_type = 1;
            }else{
                if (think.isInt(data.biz_type)){
                    biz_type = data.biz_type;
                }else{
                    biz_type = 1;
                }
            }
            //企业地址
            if (think.isNullOrUndefined(data.address)){
                address = '';
            }else{
                address = data.address;
            }
            //店铺全称
            if (think.isNullOrUndefined(data.store_name)){
                store_name = '';
            }else{
                store_name = data.store_name;
            }
            //店铺类型。旗舰店:0,专卖店:1,专营店:2
            if (think.isNullOrUndefined(data.store_type)){
                store_type = 1;
            }else{
                if (think.isInt(data.store_type)){
                    store_type = data.store_type;
                }else{
                    store_type = 1;
                }
            }
            //店铺负责人姓名
            if (think.isNullOrUndefined(data.store_manager)){
                store_manager = '';
            }else{
                store_manager = data.store_manager;
            }
            //店铺负责人电话
            if (think.isNullOrUndefined(data.manager_phone)){
                manager_phone = '';
            }else{
                manager_phone = data.manager_phone;
            }
            //店铺负责人邮箱
            if (think.isNullOrUndefined(data.manager_email)){
                manager_email = '';
            }else{
                manager_email = data.manager_email;
            }
            //联系方式
            if (think.isNullOrUndefined(data.contact)){
                contact = '';
            }else{
                contact = data.contact;
            }
            //企业介绍
            if (think.isNullOrUndefined(data.introduction)){
                introduction = '';
            }else{
                introduction = data.introduction;

            }
            //企业经营范围
            if (think.isNullOrUndefined(data.biz_scope)){
                biz_scope = '';
            }else{
                biz_scope = data.biz_scope;
            }
            //企业经营方式
            if (think.isNullOrUndefined(data.biz_prac)){
                biz_prac = '';
            }else{
                biz_prac = data.biz_prac;
            }
            //到期日期
            if (think.isNullOrUndefined(data.expire_date)){
                expire_date = 1;
            }else{
                expire_date = new Date(data.expire_date).valueOf();
            }
            //企业log路径
            if (think.isNullOrUndefined(data.logo)){
                logo = '';
            }else{
                logo = data.logo;
            }
            //企业营业执照路径
            if (think.isNullOrUndefined(data.license)){
                license = '';
            }else{
                license = data.license;
            }
            //银行开户许可证路径
            if (think.isNullOrUndefined(data.account)){
                account = '';
            }else{
                account = data.account;
            }
            //医疗器械生产许可证路径
            if (think.isNullOrUndefined(data.prod_cert)){
                prod_cert = '';
            }else{
                prod_cert = data.prod_cert;
            }
            //生产备案凭证路径
            if (think.isNullOrUndefined(data.registration)){
                registration = '';
            }else{
                registration = data.registration;
            }
            //网络销售许可证路径
            if (think.isNullOrUndefined(data.online_sales)){
                online_sales = '';
            }else{
                online_sales = data.online_sales;
            }
            //法人身份证复印件正面路径
            if (think.isNullOrUndefined(data.legal_person_front)){
                legal_person_front = '';
            }else{
                legal_person_front = data.legal_person_front;
            }
            //法人身份证复印件背面路径
            if (think.isNullOrUndefined(data.legal_person_back)){
                legal_person_back = '';
            }else{
                legal_person_back = data.legal_person_back;
            }

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
                let reject = "";
                if (!think.isNullOrUndefined(data.reject)){
                    reject = data.reject;
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
                let reject = "";
                if (!think.isNullOrUndefined(data.reject)){
                    reject = data.reject;
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

     async applyFirstListAction(){
        if (think.isNullOrUndefined(this.get('page'))){
            var page = 1;
        }else{
            var page = this.get('page');
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
            var page = this.get('page');
        }
        try {
            const list = await this.model('cmswing/business').applySecondQuery(page);
            return this.success({code:200,list:list});
        }catch (e) {
            console.log(e);
            return this.fail({code:500});
        }
    }


    async pollingAction(){
        if(!this.isCli)
            return this.fail(1000, 'deny');
        await this.model('cmswing/business').expireCheck();
    }

    async uploadAction(){
        const data = this.post();
        const filetype = data.filetype
        const uploadfile = this.file(filetype);
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
            const savePath = think.ROOT_PATH + '/static/upload/business/'+filetype;
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
