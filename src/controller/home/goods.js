var fs = require('fs');
var path = require('path');
module.exports = class extends think.cmswing.home {

    //检查是否具有添加商品的资格
    async addCheckAction(){
        const data = this.post();
        let user_id = data.user_id;
        let condition = {
            "user_id":user_id,
            "biz_status":20
        };
        const list = await this.model('cmswing/business').applyConditionQuery(condition);
        if (!think.isEmpty(list)){
            return this.success({code:200});
        }else{
            return this.success({code:500});
        }
    }

    //检查序列号是否重复
    async checkBNAction(){
        const data = this.post();
        let batch_number = data.batch_number;
        let condition = {
            "batch_number":batch_number
        };
        const list = await this.model('cmswing/goods').goodConditionQuery(condition);
        if (think.isEmpty(list)){
            return this.success({code:200});
        }else{
            return this.success({code:500});
        }
    }

    async addAction() {
        if (this.isPost) {
            const data = this.post();
            //商品批号
            let batch_number = data.batch_number;
            //添加用户id
            let user_id = data.user_id;
            const applydata = await this.model('cmswing/business').applyQueryByUser(user_id);
            console.log(applydata);
            //商户id
            const biz_id = applydata.id;
            //商品名称
            let goods_name;
            //商品备注
            let remarks;
            //商品单价
            let price;
            //商品数量
            let num;
            //商品申请状态。待审核(添加):0,一审通过:10,一审驳回:11,二审通过:20,二审驳回:21,超时:30,重新提交:1,创建:2',
            let goods_status = 0;
            //商品图片路径
            let picture;
            //商品图片路径
            let picture1;
            //商品图片路径
            let picture2;
            //销售授权委托书路径
            let market_author;
            //每次数据变更时间
            let update_time;
            if (think.isNullOrUndefined(data.goods_name)){
                goods_name = '';
            }else{
                goods_name = data.goods_name;
            }
            if (think.isNullOrUndefined(data.remarks)){
                remarks = '';
            }else{
                remarks = data.remarks;
            }
            if (think.isNullOrUndefined(data.price)){
                price = 0.0;
            }else{
                if (think.isNumber(data.price)){
                    price = data.store_type;
                }else{
                    price = 0.0;
                }
            }
            if (think.isNullOrUndefined(data.num)){
                num = 0;
            }else{
                if (think.isInt(data.num)){
                    price = data.store_type;
                }else{
                    num = 0;
                }
            }
            if (think.isNullOrUndefined(data.picture)){
                picture = '';
            }else{
                picture = data.picture.toFixed(1);
            }
            if (think.isNullOrUndefined(data.picture1)){
                picture1 = '';
            }else{
                picture1 = data.picture1;
            }
            if (think.isNullOrUndefined(data.picture2)){
                picture2 = '';
            }else{
                picture2 = data.picture2;
            }
            if (think.isNullOrUndefined(data.market_author)){
                market_author = '';
            }else{
                market_author = data.market_author;
            }
            update_time = Date.now();
            const goodsData = {
                "batch_number":batch_number,
                "user_id":user_id,
                "biz_id":biz_id,
                "goods_name":goods_name,
                "remarks":remarks,
                "price":price,
                "num":num,
                "goods_status":goods_status,
                "update_time":update_time,
                "picture":picture,
                "picture1":picture1,
                "picture2":picture2,
                "market_author":market_author
            };
            try {
                const goods_id = await this.model('cmswing/goods').goodsAdd(goodsData);
                const goodsdata = await this.model('cmswing/goods').goodsQuery(goods_id);
                return this.success({code:200,goodsdata:goodsdata});
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
        const goods_id = data.goods_id;
        const user_id = data.user_id;
        if (!think.isNullOrUndefined(data.action_type)){
            const action_type = data.action_type;
            if (action_type == "first_pass"){
                const  condition = {
                    "id":goods_id
                };
                const  updatedata = {
                    "goods_status":10,
                    "first_pass_user":user_id,
                    "update_time":Date.now()
                };
                await this.model('cmswing/goods').applyUpdate(condition,updatedata);
                return this.success({code:200});
            }else if(action_type == "second_pass"){
                const  condition = {
                    "id":goods_id
                };
                const  updatedata = {
                    "goods_status":20,
                    "second_pass_user":user_id,
                    "update_time":Date.now()
                };
                await this.model('cmswing/goods').applyUpdate(condition,updatedata);
                return this.success({code:200});
            }else if(action_type == "first_reject"){
                let reject = "";
                if (!think.isNullOrUndefined(data.reject)){
                    reject = data.reject;
                }
                const  condition = {
                    "id":goods_id
                };
                const  updatedata = {
                    "goods_status":11,
                    "first_reject":reject,
                    "update_time":Date.now()
                };
                await this.model('cmswing/goods').applyUpdate(condition,updatedata);
                return this.success({code:200,reject:reject});
            }else if(action_type == "second_reject"){
                let reject = "";
                if (!think.isNullOrUndefined(data.reject)){
                    reject = data.reject;
                }
                const  condition = {
                    "id":goods_id
                };
                const  updatedata = {
                    "goods_status":21,
                    "second_reject":reject,
                    "update_time":Date.now()
                };
                await this.model('cmswing/goods').applyUpdate(condition,updatedata);
                return this.success({code:200,reject:reject});
            }else{
                return this.fail({code:500,msg:"error param"});
            }
        }
    }

    async goodsDetailAction(){
        const data = this.post();
        const biz_id = data.biz_id;
        try {
            const applydata = await this.model('cmswing/goods').goodsQuery(goods_id);
            return this.success({code:200,applydata:applydata});
        }catch (e) {
            console.log(e);
            return this.fail({code:500});
        }
    }

    //商户（店铺）已添加的所有商品
    async goodsQueryByUserAction(){
        const data = this.post();
        const user_id = data.user_id;
        try {
            const list = await this.model('cmswing/goods').applyQueryByUser(user_id);
            return this.success({code:200,list:list});
        }catch (e) {
            console.log(e);
            return this.fail({code:500});
        }
    }

     async goodsFirstListAction(){
        if (think.isNullOrUndefined(this.get('page'))){
            var page = 1;
        }else{
            var page = this.get('page'); 
        }
        try {
            const list = await this.model('cmswing/goods').goodsFirstQuery(page);
            return this.success({code:200,list:list});
        }catch (e) {
            console.log(e);
            return this.fail({code:500});
        }
    }

     async goodsSecondListAction(){
        if (think.isNullOrUndefined(this.get('page'))){
            var page = 1;
        }else{
            var page = this.get('page')
        }
        try {
            const list = await this.model('cmswing/goods').goodsSecondQuery(page);
            return this.success({code:200,list:list});
        }catch (e) {
            console.log(e);
            return this.fail({code:500});
        }
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
         *
         */
    }

    async saveFile(file, base64, filetype) {
        try {
            let filename = file.name;
            let tempPath = file.path;
            const renameFile = think.promisify(fs.rename, fs);
            const savePath = think.ROOT_PATH + '/static/upload/goods/'+filetype;
            think.mkdir(savePath);
            const suffix = filename.split('.').pop();
            // 对文件名进行过滤
            const tmpname = filetype + '_' + filename.split('.').shift().replace(/[\s\\\/,.*@#$%^&\|""“”：:]/gi, '');
            const newname = `${tmpname}_${Date.now()}.${suffix}`;
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
